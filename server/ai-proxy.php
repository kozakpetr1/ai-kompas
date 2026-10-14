<?php
/* AI Kompas – ukázková proxy pro asistenta (ZATÍM SE NEPOUŽÍVÁ)
   ---------------------------------------------------------------------------
   Proč: API klíč k AI nesmí být v prohlížeči. Asistent pošle konverzaci sem,
   proxy přidá klíč a přepošle ji poskytovateli. Klíč zůstane na serveru.

   Nasazení na školní hosting (PHP 8+ s cURL):
   1. Zkopírujte složku server/ na hosting.
   2. Vytvořte MIMO veřejnou složku soubor config, např. ../ai-kompas-config.php:
        <?php return [
          'endpoint' => 'https://api.openai.com/v1/chat/completions',   // nebo Azure / Gemini OpenAI-compatible
          'api_key'  => '…',
          'model'    => 'gpt-4o-mini',
          'origins'  => ['https://www.skolavdf.cz'],                    // odkud smí přijít dotazy
          'max_per_hour' => 60,                                          // limit dotazů na IP
        ];
   3. V nastavení asistenta zvolte „AI přes API“ a jako adresu zadejte URL tohoto souboru.
      Pole „Model“ a „API klíč“ nechte prázdná – použije se config.
   --------------------------------------------------------------------------- */

$config = require __DIR__ . '/../../ai-kompas-config.php';   // upravte cestu podle hostingu

header('Content-Type: application/json; charset=utf-8');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin, $config['origins'], true)) {
  header('Access-Control-Allow-Origin: ' . $origin);
  header('Vary: Origin');
  header('Access-Control-Allow-Headers: Content-Type');
  header('Access-Control-Allow-Methods: POST, OPTIONS');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo '{"error":"Jen POST"}'; exit; }
if ($origin && !in_array($origin, $config['origins'], true)) { http_response_code(403); echo '{"error":"Nepovolený původ"}'; exit; }

/* jednoduchý limit dotazů na IP (soubor v dočasné složce) */
$ip = hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'x');
$lim = sys_get_temp_dir() . '/ai-kompas-' . $ip . '-' . date('YmdH');
$pocet = (int) @file_get_contents($lim);
if ($pocet >= ($config['max_per_hour'] ?? 60)) { http_response_code(429); echo '{"error":"Příliš mnoho dotazů, zkuste to za chvíli."}'; exit; }
@file_put_contents($lim, (string) ($pocet + 1));

/* vstup: { messages: [{role, content}] } – vezmeme jen to, co potřebujeme */
$vstup = json_decode(file_get_contents('php://input'), true);
$zpravy = [];
foreach (($vstup['messages'] ?? []) as $m) {
  if (!in_array($m['role'] ?? '', ['system', 'user', 'assistant'], true)) continue;
  $zpravy[] = ['role' => $m['role'], 'content' => mb_substr((string) ($m['content'] ?? ''), 0, 12000)];
}
if (!$zpravy) { http_response_code(400); echo '{"error":"Chybí zprávy"}'; exit; }

$ch = curl_init($config['endpoint']);
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_TIMEOUT => 60,
  CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Authorization: Bearer ' . $config['api_key']],
  CURLOPT_POSTFIELDS => json_encode([
    'model' => $config['model'],
    'messages' => array_slice($zpravy, -14),
    'temperature' => 0.4,
  ]),
]);
$odpoved = curl_exec($ch);
$kod = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($odpoved === false ? 502 : $kod);
echo $odpoved === false ? '{"error":"Poskytovatel AI neodpověděl"}' : $odpoved;
