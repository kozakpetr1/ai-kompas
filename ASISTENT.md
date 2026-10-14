# Asistent AI Kompasu

Chat pod úvodním panelem. Zatím odpovídá **bez AI** z obsahu kompasu. Později se dá napojit na AI tak, že se zvolí jiný „mozek“. Rozhraní ani zbytek webu se přitom nemění.

## Jak je to poskládané

```
asistent-ui.js              chat, návrhy dotazů, nastavení (⚙)
        │  KompasAsistent.odeslat(text)
asistent-jadro.js           konverzace [{role, content}], registr mozků, záloha
        │  mozek.odpovez(zpravy, kontext)
        ├─ asistent-mozek-pravidla.js   bez AI – klíčová slova nad js/data.js
        └─ asistent-mozek-api.js        AI přes API kompatibilní s OpenAI (chat/completions)
                                           → Ollama / školní proxy (server/ai-proxy.php) / poskytovatel
```

* **Formát konverzace** je pole `{role: 'user'|'assistant', content}`. Je to stejný formát, jaký přijímají OpenAI, Azure OpenAI, Gemini (OpenAI-compatible) i Ollama.
* **Odpověď mozku**: `{ content: 'text s lehkým markdownem', navrhy?: [...] }`. UI umí zobrazit tučné písmo, kurzívu, seznamy a odkazy. Jiný formátovací kód se nezobrazí, takže je to bezpečné i pro výstupy AI.
* **Záloha:** když AI mozek není nastavený nebo neodpoví, jádro automaticky použije mozek bez AI a pod odpovědí ukáže poznámku.
* **Znalosti pro AI**: jádro z `js/data.js` sestaví stručný přehled nástrojů a doporučení a přidá ho k instrukcím. Když upravíte data kompasu, AI se o změně dozví automaticky.
* **Nastavení** (zvolený mozek, adresa a model, instrukce) se ukládá do `localStorage` prohlížeče. **Konverzace se neukládá.**

## Jak napojit AI

| Možnost | Adresa API v nastavení | Cena | Poznámka |
|---|---|---|---|
| Ollama lokálně | `http://localhost:11434/v1/chat/completions`, model např. `gemma3` | zdarma | Jen na počítači, kde Ollama běží. Vhodné na zkoušku. |
| Školní proxy | URL `server/ai-proxy.php` na školním hostingu | podle poskytovatele | Klíč zůstává na serveru. Doporučeno pro ostrý provoz. |
| Přímo poskytovatel | jeho URL pro chat/completions + API klíč | podle poskytovatele | Jen pro lokální test, klíč je vidět v prohlížeči. |

Pokud kraj přidělí licence s API, stačí přidat nový soubor `asistent-mozek-<nazev>.js` se stejným rozhraním (viz komentář v `asistent-jadro.js`) a načíst ho v `index.html` před `asistent-ui.js`.

## Úprava odpovědí bez AI

V `asistent-mozek-pravidla.js`:
* `ALIASY`: jak se dá nástroj napsat (bez diakritiky).
* `UCEL_KLICE`: slova, podle kterých se pozná oblast práce učitele.
* `TEMATA`: pevné odpovědi na časté otázky (GDPR, halucinace, prompt, projekt, jak AI funguje).

Klíčová slova se píšou bez diakritiky a malými písmeny. Stačí začátek slova, například `hodnoc` najde „hodnocení“ i „hodnocením“.
