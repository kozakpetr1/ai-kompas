/* AI Kompas – asistent: MOZEK S AI přes API kompatibilní s OpenAI
   --------------------------------------------------------------------------
   Formát „chat/completions“ dnes přijímá většina služeb, takže jeden adaptér
   pokryje víc možností – mění se jen adresa a model:

   • Ollama na vlastním počítači / školním serveru (zdarma, bez klíče):
       adresa: http://localhost:11434/v1/chat/completions   model: např. gemma3
   • Školní proxy (doporučeno pro ostrý provoz, klíč zůstane na serveru):
       adresa: https://<školní-web>/ai-kompas/server/ai-proxy.php
   • Přímo poskytovatel (jen pro lokální test! klíč by byl vidět v prohlížeči):
       OpenAI, Azure OpenAI (přes proxy), Gemini (OpenAI-compatible endpoint)…

   Dokud není vyplněná adresa, hlásí se jako nedostupný a jádro automaticky
   odpoví mozkem bez AI.
   -------------------------------------------------------------------------- */
(function () {
  KompasAsistent.registrovat({
    id: 'openai-kompatibilni',
    nazev: 'AI přes API (OpenAI-kompatibilní)',
    popis: 'Generativní model přes rozhraní chat/completions – Ollama, školní proxy nebo poskytovatel AI. Do modelu se posílají instrukce, znalosti kompasu a konverzace.',
    jeAI: true,
    nastaveni: [
      { klic: 'adresa', nazev: 'Adresa API', typ: 'url', napoveda: 'např. http://localhost:11434/v1/chat/completions (Ollama) nebo adresa školní proxy' },
      { klic: 'model', nazev: 'Model', typ: 'text', napoveda: 'např. gemma3, llama3.2, gpt-4o-mini…' },
      { klic: 'klic', nazev: 'API klíč (jen pro lokální test)', typ: 'password', napoveda: 'Ve veřejném webu nevyplňujte – klíč patří na server do proxy.' }
    ],

    dostupny: async function (nast) {
      if (!nast.adresa) return 'není vyplněná adresa API';
      return true;
    },

    odpovez: async function (zpravy, kontext) {
      const n = kontext.nastaveni;
      const telo = {
        model: n.model || undefined,
        messages: [{ role: 'system', content: kontext.instrukce + '\n\nZNALOSTI KOMPASU:\n' + kontext.znalosti }]
          .concat(zpravy.slice(-12)),          // posledních 12 zpráv stačí a šetří tokeny
        temperature: 0.4,
        stream: false
      };
      const hlavicky = { 'Content-Type': 'application/json' };
      if (n.klic) hlavicky.Authorization = 'Bearer ' + n.klic;

      const res = await fetch(n.adresa, { method: 'POST', headers: hlavicky, body: JSON.stringify(telo), signal: kontext.signal });
      if (!res.ok) {
        let detail = '';
        try { detail = (await res.text()).slice(0, 200); } catch (e) { /* nic */ }
        throw new Error('API vrátilo chybu ' + res.status + (detail ? ': ' + detail : ''));
      }
      const data = await res.json();
      const text = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      if (!text) throw new Error('API vrátilo odpověď v neočekávaném formátu.');
      return { content: text };
    }
  });
})();
