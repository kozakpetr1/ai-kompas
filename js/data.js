/* AI Kompas – data o nástrojích (stav: říjen 2026).
   Jeden zdroj pravdy pro dashboard (karty, rychlý výběr) i pro stránky nástrojů.
   Myšlenková mapa: šest stejných „účelů“ u každého nástroje, aby šly nástroje porovnat. */

var UCELY = [
  { id: 'priprava',  nazev: 'Příprava výuky',          kratce: 'Příprava',       barva: 'var(--c1)' },
  { id: 'hodnoceni', nazev: 'Hodnocení a zpětná vazba', kratce: 'Hodnocení',      barva: 'var(--c2)' },
  { id: 'uceni',     nazev: 'Učení žáků',               kratce: 'Žáci',           barva: 'var(--c3)' },
  { id: 'tvorba',    nazev: 'Tvorba materiálů',         kratce: 'Tvorba',         barva: 'var(--c4)' },
  { id: 'zdroje',    nazev: 'Výzkum a práce se zdroji', kratce: 'Zdroje',         barva: 'var(--c5)' },
  { id: 'admin',     nazev: 'Administrativa',           kratce: 'Administrativa', barva: 'var(--c6)' }
];

var NASTROJE = [
/* ---------------------------------------------------------------- GEMINI */
{ id: 'gemini', nazev: 'Google Gemini', firma: 'Google', mark: 'Ge', barva: '#4a7fc9', cat: 'asistent', catNazev: 'Obecný AI asistent · Google',
  popis: 'AI asistent Googlu propojený s Classroom, Dokumenty, Prezentacemi a Gmailem. Ve školním účtu Workspace for Education s ochranou dat.',
  pouziti: ['Příprava hodiny a rubriky přímo v Google Classroom', 'Gemy – vlastní asistenti, které učitel přiřadí třídě', 'Deep Research – podklady k tématu s odkazy na zdroje'],
  badge: ['Zdarma v rámci Workspace', 'success'], url: 'https://edu.google.com/intl/ALL_cz/ai/gemini-for-education/',
  shrnuti: 'Gemini není jedna aplikace, ale vrstva AI napříč celým Google Workspace for Education. Učitel ji potká v samostatné aplikaci Gemini, v Google Classroom, v Dokumentech a Prezentacích i v NotebookLM. Ve školním účtu jsou konverzace chráněné: podle Googlu se nepoužívají k trénování modelů a nečtou je lidé. Pro krajské školy je Gemini důležité i kvůli memorandu kraje s partnerem Google for Education (DPDC): zavedení Workspace for Education a proškolení všech škol přes kurz Gemini Academy.',
  fakta: [['Přístup', 'Školní účet Google Workspace for Education'], ['Cena', 'Základ zdarma ve všech edicích; některé funkce jen v Education Plus nebo doplňku Teaching & Learning'], ['Žáci', 'V Classroom pro všechny věkové skupiny, pokud to povolí správce (stav 8/2026)'], ['Čeština', 'Ano (rubriky v Classroom zatím jen anglicky)'], ['V kraji', 'Memorandum s DPDC: Workspace for Education + Gemini Academy pro všechny školy']],
  eko: [
    { t: 'Přístup', items: ['Školní účet Google', 'Správce povoluje funkce pro učitele a žáky'] },
    { t: 'Aplikace', items: ['Aplikace Gemini', 'Gemini v Classroom', 'NotebookLM', 'Gemy (vlastní asistenti)', 'Deep Research', 'Canvas'] },
    { t: 'Propojení', items: ['Dokumenty, Prezentace, Tabulky', 'Gmail a Disk', 'Formuláře', 'Gemini Academy (školení)'] }
  ],
  mapa: {
    priprava: [['Příprava v Classroom', 'Gemini v Classroom navrhne cíle a průběh hodiny k zadanému tématu a ročníku.'], ['Gemy', 'Vlastní asistent s instrukcemi a soubory, např. „generátor diferencovaných zadání pro 1. ročník“.'], ['Canvas', 'Pracovní plocha, kde z promptu vznikne dokument, kvíz nebo malá interaktivní aplikace.']],
    hodnoceni: [['Rubriky v Classroom', 'Převede vaši rubriku z Disku do hodnoticí rubriky v Classroom (zatím anglicky).'], ['Návrh komentářů', 'Navrhne zpětnou vazbu k písemné práci podle zvoleného zaměření (Education Plus / Teaching & Learning).'], ['Kvízy a otázky', 'Z látky připraví kvíz nebo otázky na ověření porozumění.']],
    uceni: [['Gemini pro žáky', 'Záložka Gemini v Classroom: pomoc s úkolem, studijní materiály, přiřazené Gemy – jen když ji správce zapne.'], ['Přiřazené Gemy', 'Šablony jako „Studijní partner“ nebo „Vyzkoušej mě“, které učitel nasdílí třídě.'], ['Notebook třídy', 'Žáci si ze zdrojů od učitele vytvoří studijní průvodce, kartičky a cvičné kvízy.']],
    tvorba: [['Obrázky', 'Generování ilustrací k materiálům přímo v aplikaci Gemini.'], ['Prezentace', 'Gemini v Prezentacích Google navrhne snímky a texty.'], ['Audio a video přehled', 'Přes NotebookLM vznikne z látky „podcast“ nebo krátké video.']],
    zdroje: [['Deep Research', 'Samostatně prohledá desítky webů a sestaví zprávu s odkazy na zdroje.'], ['NotebookLM', 'Odpovídá jen z vámi nahraných materiálů a cituje je.'], ['Vyhledávání Google', 'Odpovědi s aktuálními informacemi z webu.']],
    admin: [['Gmail', 'První verze e-mailu rodičům nebo kolegům.'], ['Dokumenty', 'Shrnutí dlouhého dokumentu, zápis z porady z poznámek.'], ['Tabulky', 'Vzorce, přehledy a grafy z výsledků žáků.']]
  },
  start: ['Přihlaste se do gemini.google.com školním účtem (ne soukromým).', 'Vyzkoušejte v Classroom „Gemini“ u jedné třídy – příprava hodiny nebo kvíz.', 'Vytvořte si první Gem s instrukcemi pro svůj předmět a sdílejte ho s kolegy.'],
  pozor: ['Funkce pro žáky musí povolit správce Workspace – domluvte se se správcem IT.', 'Soukromý účet Google nemá stejnou ochranu dat jako školní.', 'Plánovaný přechod Gemů na „Gemini Skills“ (nejdříve od června 2027) – Gemy se budou muset znovu aktivovat.'],
  odkazy: [['Gemini for Education', 'https://edu.google.com/intl/ALL_cz/ai/gemini-for-education/'], ['Gemini v Classroom (blog Google)', 'https://blog.google/outreach-initiatives/education/classroom-ai-features']]
},
/* ---------------------------------------------------------------- COPILOT */
{ id: 'copilot', nazev: 'Microsoft Copilot', firma: 'Microsoft', mark: 'Co', barva: '#2e7dbd', cat: 'asistent', catNazev: 'Obecný AI asistent · Microsoft',
  popis: 'AI ve Wordu, PowerPointu, Excelu, Teams a Forms. Modul Teach připraví hodinu, rubriku nebo kvíz. Copilot Chat je pro školní účty zdarma.',
  pouziti: ['Teach – příprava hodiny, rubriky a diferenciace v jednom místě', 'Prezentace v PowerPointu z hotového dokumentu', 'Kvíz ve Forms vygenerovaný z textu'],
  badge: ['Součástí M365', 'success'], url: 'https://www.microsoft.com/cs-cz/education/products/copilot-in-education',
  shrnuti: 'Copilot má ve škole dvě úrovně. Copilot Chat je dostupný zdarma všem se školním účtem Microsoft 365 (včetně bezplatné licence A1) a má ochranu podnikových dat. Plný Microsoft 365 Copilot je placená licence, která přidává AI přímo do Wordu, PowerPointu, Excelu, Outlooku a Teams. Pro učitele je klíčový modul Teach v aplikaci Microsoft 365 Copilot. Ústecký kraj má s Microsoftem memorandum (školení učitelů, AI licence, VR brýle, AI kabinety) – proto je Copilot v kraji velmi pravděpodobným „krajským“ nástrojem.',
  fakta: [['Přístup', 'Školní účet Microsoft 365 (Entra ID)'], ['Cena', 'Copilot Chat a Teach i v bezplatné A1; plný M365 Copilot je placený doplněk'], ['Žáci', 'Copilot Chat a studijní agent od 13 let'], ['Čeština', 'Ano'], ['V kraji', 'Memorandum s Microsoftem: školení, AI licence, VR, AI kabinety']],
  eko: [
    { t: 'Přístup', items: ['Školní účet Microsoft 365', 'Copilot Chat (zdarma)', 'Microsoft 365 Copilot (licence)'] },
    { t: 'Aplikace', items: ['Teach', 'Word, PowerPoint, Excel', 'Forms', 'Teams a Outlook', 'Copilot Notebooks'] },
    { t: 'Propojení', items: ['Teams Assignments', 'Learning Accelerators', 'Learning Zone (Windows)', 'Agenti a Copilot Studio'] }
  ],
  mapa: {
    priprava: [['Teach', 'Z předmětu, ročníku a délky vytvoří plán hodiny nebo celé jednotky, materiály a diferencované verze.'], ['Word', 'Pracovní list nebo text pro žáky z jedné věty zadání.'], ['Learning Zone', 'Interaktivní lekce s přehledem o práci žáků (aplikace pro Windows).']],
    hodnoceni: [['Rubriky v Teach', 'Hodnoticí kritéria k úkolu za pár vteřin.'], ['Forms', 'Kvíz nebo test vygenerovaný z vloženého textu.'], ['Excel', 'Analýza výsledků třídy, grafy pro třídní schůzky.']],
    uceni: [['Copilot Chat pro žáky', 'Školní AI asistent s ochranou dat, pro žáky od 13 let.'], ['Studijní agent', 'Interaktivní doučování a procvičování se zpětnou vazbou (13+).'], ['Copilot Notebooks', 'Ze třídních materiálů vytvoří studijní průvodce.'], ['Reading Progress', 'Sleduje čtenářské dovednosti a navrhuje procvičování.']],
    tvorba: [['PowerPoint', 'Prezentace z osnovy nebo z hotového dokumentu.'], ['Designer', 'Obrázky a grafika k materiálům.'], ['Word – přepis', 'Stejný text v jednodušší nebo náročnější verzi.']],
    zdroje: [['Researcher', 'Agent, který sestaví rešerši z webu i vašich souborů (M365 Copilot).'], ['Copilot Chat s webem', 'Odpovědi s odkazy na zdroje.'], ['Notebooks', 'Otázky nad vlastní sadou dokumentů.']],
    admin: [['Outlook', 'Návrh e-mailu rodičům, shrnutí dlouhého vlákna.'], ['Teams', 'Shrnutí a zápis z porady (M365 Copilot).'], ['Excel', 'Vzorce a přehledy bez hledání návodů.']]
  },
  start: ['Otevřete m365.cloud.microsoft a přihlaste se školním účtem – zelený štít znamená ochranu dat.', 'V aplikaci Microsoft 365 Copilot otevřete Teach a připravte jednu hodinu.', 'Vyzkoušejte ve Forms „Vytvořit s Copilotem“ kvíz z vlastního textu.'],
  pozor: ['Ne každá funkce je v bezplatném Copilot Chatu – plná AI ve Wordu nebo Teams vyžaduje licenci.', 'Žáci mladší 13 let Copilot Chat používat nesmí.', 'Konkrétní produkt krajských AI licencí kraj zatím veřejně neupřesnil.'],
  odkazy: [['Copilot ve vzdělávání', 'https://www.microsoft.com/cs-cz/education/products/copilot-in-education'], ['Microsoft Education blog', 'https://www.microsoft.com/en-us/education/blog/'], ['Microsoft Learn pro učitele', 'https://learn.microsoft.com/cs-cz/training/educator-center/']]
},
/* ---------------------------------------------------------------- CHATGPT */
{ id: 'chatgpt', nazev: 'ChatGPT', firma: 'OpenAI', mark: 'Ch', barva: '#2f8f6f', cat: 'asistent', catNazev: 'Obecný AI asistent · OpenAI',
  popis: 'Nejrozšířenější univerzální chatbot. Velmi dobrá čeština, hlasový režim, generování obrázků, vlastní GPTs a studijní režim.',
  pouziti: ['Brainstorming aktivit, projektů a motivačních úvodů', 'Studijní režim – vede žáka otázkami místo hotové odpovědi', 'Hlasová konverzace pro nácvik cizího jazyka'],
  badge: ['Freemium účet', 'neutral'], url: 'https://chatgpt.com',
  shrnuti: 'ChatGPT od OpenAI je samostatná aplikace bez vazby na kancelářský balík. Kolem chatu vyrostla řada nástrojů: vlastní asistenti (GPTs), Projekty se soubory, Canvas pro delší texty, Deep Research, hlasový režim a generování obrázků. Pro školy existuje ChatGPT Edu (nákup instituce, hlavně univerzity) a ChatGPT for Teachers, který je ale zatím jen pro učitele v USA. U nás tedy učitelé většinou používají osobní účet Free nebo Plus – a musí si sami ohlídat nastavení dat.',
  fakta: [['Přístup', 'Osobní účet (Free, Plus); instituce ChatGPT Edu'], ['Cena', 'Základ zdarma, Plus placené'], ['Žáci', 'Od 13 let se souhlasem rodičů'], ['Čeština', 'Výborná, včetně hlasu'], ['Data', 'U osobního účtu vypněte v nastavení používání chatů ke zlepšování modelu']],
  eko: [
    { t: 'Přístup', items: ['Osobní účet Free / Plus', 'ChatGPT Edu (instituce)', 'ChatGPT for Teachers (jen USA)'] },
    { t: 'Aplikace', items: ['Chat a hlasový režim', 'GPTs (vlastní asistenti)', 'Projekty', 'Canvas', 'Studijní režim'] },
    { t: 'Propojení', items: ['Deep Research', 'Generování obrázků', 'Analýza souborů a tabulek', 'Vyhledávání na webu'] }
  ],
  mapa: {
    priprava: [['GPTs', 'Vlastní asistent s instrukcemi pro předmět, který mohou používat i kolegové.'], ['Projekty', 'Složka pro jeden předmět: soubory, instrukce a všechny chaty pohromadě.'], ['Canvas', 'Společná úprava delšího textu nebo osnovy s AI vedle sebe.']],
    hodnoceni: [['Zpětná vazba k textu', 'Komentáře k eseji podle kritérií, která zadáte.'], ['Rubriky', 'Hodnoticí kritéria k projektu nebo prezentaci.'], ['Analýza dat', 'Nahrajete tabulku výsledků, dostanete přehled a grafy.']],
    uceni: [['Studijní režim', 'Vede žáka otázkami a nápovědami krok za krokem místo hotové odpovědi.'], ['Hlasový režim', 'Konverzace v cizím jazyce nanečisto.'], ['Simulace rolí', 'AI hraje historickou postavu nebo zákazníka v odborném předmětu.']],
    tvorba: [['Obrázky', 'Ilustrace, schémata a plakáty z popisu (popisky vždy zkontrolujte).'], ['Canvas – kód', 'Malá webová aplikace nebo interaktivní cvičení.'], ['Texty', 'Příběhy, dialogy a cvičení na míru tématu.']],
    zdroje: [['Deep Research', 'Vícezdrojová rešerše se strukturovanou zprávou a citacemi.'], ['Vyhledávání', 'Aktuální informace z webu s odkazy.'], ['Práce se soubory', 'Shrnutí a otázky nad nahraným PDF.']],
    admin: [['E-maily', 'První verze zprávy rodičům nebo vedení.'], ['Zápisy', 'Strukturovaný zápis z poznámek z porady.'], ['Tabulky', 'Úprava a vyčištění dat v Excelu nebo CSV.']]
  },
  start: ['V nastavení v části o datech vypněte používání chatů ke zlepšování modelu.', 'Založte si Projekt pro svůj předmět a nahrajte do něj ŠVP a materiály.', 'Vyzkoušejte studijní režim na úloze, kterou dáváte žákům.'],
  pozor: ['Osobní účet není školní služba – žádné osobní údaje žáků.', 'ChatGPT for Teachers s bezplatným plným přístupem je zatím jen pro učitele v USA.', 'Žáci mladší 18 let jen se souhlasem rodičů, mladší 13 let vůbec.'],
  odkazy: [['ChatGPT', 'https://chatgpt.com'], ['Nastavení dat (nápověda)', 'https://help.openai.com/']]
},
/* ---------------------------------------------------------------- CLAUDE */
{ id: 'claude', nazev: 'Claude', firma: 'Anthropic', mark: 'Cl', barva: '#c1542e', cat: 'asistent', catNazev: 'Obecný AI asistent · Anthropic',
  popis: 'Silný v dlouhých textech, pečlivé zpětné vazbě a tvorbě interaktivních materiálů (artefaktů). Jen pro dospělé – tedy pro učitele, ne pro žáky.',
  pouziti: ['Podrobná písemná zpětná vazba k esejím a seminárním pracím', 'Interaktivní simulace a kvízy jako sdílená webová stránka', 'Rozbor dlouhých dokumentů – RVP, ŠVP, směrnice'],
  badge: ['Freemium · 18+', 'neutral'], url: 'https://claude.ai',
  shrnuti: 'Claude od společnosti Anthropic je obecný AI asistent zaměřený na práci s textem a dokumenty. Pro učitele je nejzajímavější funkce artefakty: z popisu vznikne interaktivní stránka (simulace, kvíz, pracovní list), kterou lze sdílet odkazem. Projekty drží materiály k jednomu předmětu pohromadě a Research sestaví rešerši s citacemi. Claude umí vytvořit i soubory Word, Excel nebo PowerPoint. Pro vysoké školy existuje Claude for Education s výukovým režimem. Spotřebitelský účet je ale jen pro osoby od 18 let.',
  fakta: [['Přístup', 'Osobní účet na claude.ai (Free, Pro, Max)'], ['Cena', 'Základ zdarma, Pro placené'], ['Žáci', 'Ne – účet je jen od 18 let'], ['Čeština', 'Výborná'], ['Obrázky', 'Negeneruje fotky ani malby; diagramy, grafy a interaktivní grafiku ano']],
  eko: [
    { t: 'Přístup', items: ['Osobní účet claude.ai', 'Claude for Education (VŠ)', 'Aplikace pro počítač a mobil'] },
    { t: 'Aplikace', items: ['Chat', 'Projekty', 'Artefakty', 'Research', 'Tvorba souborů'] },
    { t: 'Propojení', items: ['Konektory (např. Google Disk)', 'Claude v Chrome', 'Claude v Excelu', 'Claude Code'] }
  ],
  mapa: {
    priprava: [['Projekty', 'ŠVP, učebnice a vlastní materiály na jednom místě – Claude z nich vychází.'], ['Artefakty', 'Interaktivní pracovní list, simulace nebo kvíz jako webová stránka.'], ['Soubory', 'Hotový dokument Word nebo prezentace PowerPoint ke stažení.']],
    hodnoceni: [['Zpětná vazba', 'Podrobné, adresné komentáře k delším textům podle vašich kritérií.'], ['Rubriky', 'Hodnoticí kritéria s popisem úrovní.'], ['Kontrola zadání', 'Najde nejasnosti a chyby v testu dřív, než ho dáte žákům.']],
    uceni: [['Sdílený artefakt', 'Žák dostane odkaz na hotové interaktivní cvičení – sám účet nepotřebuje.'], ['Výukový režim', 'V Claude for Education (VŠ) vede studenta otázkami místo odpovědí.']],
    tvorba: [['Simulace', 'Interaktivní model jevu (fyzika, ekonomie) s posuvníky.'], ['Diagramy', 'Schémata, myšlenkové mapy a grafy.'], ['Weby', 'Malý web nebo rozcestník – jako tento AI Kompas.']],
    zdroje: [['Research', 'Rešerše z mnoha zdrojů se zprávou a citacemi.'], ['Dlouhé dokumenty', 'Rozbor a srovnání dlouhých PDF a směrnic.'], ['Vyhledávání', 'Aktuální informace z webu s odkazy.']],
    admin: [['Směrnice a dokumenty', 'Úprava a zkrácení školních dokumentů.'], ['E-maily', 'Citlivě formulované zprávy rodičům.'], ['Excel', 'Tabulky a přehledy včetně vzorců.']]
  },
  start: ['Založte si účet na claude.ai (jen pro sebe – žáci mladší 18 let nemohou).', 'Požádejte o interaktivní kvíz k tématu a zobrazte ho jako artefakt.', 'Vytvořte Projekt pro předmět a nahrajte do něj ŠVP.'],
  pozor: ['Žáci mladší 18 let Claude používat nesmí – sdílejte jim jen hotové artefakty.', 'Osobní účet není školní služba – žádné osobní údaje žáků.', 'Neumí generovat fotografie a malby.'],
  odkazy: [['Claude', 'https://claude.ai'], ['Nápověda Claude', 'https://support.claude.com'], ['Claude for Education', 'https://www.anthropic.com/education']]
},
/* ---------------------------------------------------------------- SCIOBOT */
{ id: 'sciobot', nazev: 'ScioBot', firma: 'Scio', mark: 'Sb', barva: '#7c8c4a', cat: 'vyuka', catNazev: 'Příprava výuky · český, vázaný na RVP',
  popis: 'Český nástroj od Scio. Zadáte téma a ročník, ScioBot navrhne cíle hodiny, aktivity a materiály – psané rovnou pro české školství.',
  pouziti: ['Kompletní příprava na hodinu včetně vzdělávacích cílů', 'Pracovní listy k tématu', 'Jediný nástroj v přehledu stavěný přímo na RVP'],
  badge: ['Omezeně zdarma', 'info'], url: 'https://www.sciobot.cz',
  shrnuti: 'ScioBot je úzce zaměřený nástroj: nesnaží se být univerzálním chatbotem, ale pomocníkem pro přípravu výuky v českém kontextu. Výhodou je jazyk, terminologie a vazba na RVP, takže výstup nemusíte „překládat“ do českých školních poměrů. Ekosystém je menší než u velkých asistentů – jde hlavně o přípravu, ne o práci se žáky nebo administrativu.',
  fakta: [['Přístup', 'Účet na webu sciobot.cz'], ['Cena', 'Omezený počet příprav zdarma, dál placeně (ověřte aktuální ceník)'], ['Žáci', 'Určeno učitelům'], ['Čeština', 'Nativně česky'], ['Silná stránka', 'Vazba na RVP a české školství']],
  eko: [
    { t: 'Přístup', items: ['Účet na sciobot.cz'] },
    { t: 'Aplikace', items: ['Příprava hodiny', 'Pracovní listy', 'Vzdělávací cíle podle RVP'] },
    { t: 'Propojení', items: ['Export a úprava v textovém editoru'] }
  ],
  mapa: {
    priprava: [['Příprava hodiny', 'Z tématu a ročníku vznikne plán hodiny s cíli a aktivitami.'], ['Cíle podle RVP', 'Formulace vzdělávacích cílů v souladu s RVP.'], ['Aktivity', 'Návrhy činností pro jednotlivé fáze hodiny.']],
    hodnoceni: [['Ověření porozumění', 'Otázky a úlohy k ověření, zda žáci látku pochopili.']],
    uceni: [['Materiály pro žáky', 'Pracovní listy, se kterými žáci pracují v hodině.']],
    tvorba: [['Pracovní listy', 'Pracovní list k tématu připravený k tisku nebo úpravě.']],
    zdroje: [['Český kontext', 'Terminologie a příklady z českého prostředí.']],
    admin: [['Dokumentace přípravy', 'Přehledně strukturovaná příprava pro portfolio nebo hospitaci.']]
  },
  start: ['Zaregistrujte se na sciobot.cz.', 'Zadejte téma hodiny, ročník a předmět.', 'Výstup upravte podle své třídy a uložte si ho.'],
  pozor: ['Ceník a počet bezplatných příprav se mění – ověřte aktuální stav.', 'Výstup je návrh, ne hotová hodina – vždy ho přizpůsobte třídě.'],
  odkazy: [['ScioBot', 'https://www.sciobot.cz'], ['Scio', 'https://www.scio.cz']]
},
/* ---------------------------------------------------------------- MAGICSCHOOL */
{ id: 'magicschool', nazev: 'MagicSchool AI', firma: 'MagicSchool', mark: 'Ms', barva: '#7a3428', cat: 'vyuka', catNazev: 'Příprava výuky · anglické rozhraní',
  popis: 'Rozcestník s více než 80 dílčími nástroji pro učitele – od plánu hodiny po komentář na vysvědčení. Rozhraní anglicky, výstup lze mít v češtině.',
  pouziti: ['Generátor rubrik a strukturované zpětné vazby', 'Text Leveler – stejný text pro různé úrovně žáků', 'MagicStudent – bezpečné AI prostředí pro žáky pod dohledem učitele'],
  badge: ['Freemium účet', 'neutral'], url: 'https://www.magicschool.ai',
  shrnuti: 'MagicSchool je platforma postavená jen pro školy. Místo jednoho chatu nabízí desítky formulářů na konkrétní úkoly učitele: plán hodiny, rubrika, test, zjednodušení textu, e-mail rodičům. Asistentka Raina pomáhá v chatu. Části MagicStudent učitel vytváří „místnosti“ s vybranými nástroji pro žáky a vidí, co žáci s AI dělají. Rozhraní je anglické, ale výstupy lze nastavit v češtině.',
  fakta: [['Přístup', 'Účet na magicschool.ai (přihlášení přes Google nebo Microsoft)'], ['Cena', 'Free, rozšířené funkce v Plus a školních licencích'], ['Žáci', 'MagicStudent pod dohledem učitele'], ['Čeština', 'Rozhraní anglicky, výstup česky'], ['Silná stránka', 'Hotové nástroje na konkrétní úkoly učitele']],
  eko: [
    { t: 'Přístup', items: ['Účet učitele', 'Přihlášení přes Google / Microsoft'] },
    { t: 'Aplikace', items: ['80+ nástrojů pro učitele', 'Raina (chat)', 'MagicStudent', 'Vlastní nástroje'] },
    { t: 'Propojení', items: ['Export do Dokumentů Google a Wordu', 'Sdílení do Classroom'] }
  ],
  mapa: {
    priprava: [['Plán hodiny', 'Formulář: téma, ročník, cíle → hotový plán hodiny.'], ['Plán jednotky', 'Rozvržení tématu do více hodin.'], ['Vlastní nástroj', 'Vlastní šablona promptu, kterou používáte opakovaně.']],
    hodnoceni: [['Generátor rubrik', 'Rubrika s popisem úrovní k libovolnému úkolu.'], ['Zpětná vazba', 'Strukturované komentáře k práci žáka.'], ['Testy a otázky', 'Výběr z možností, otevřené otázky, otázky k textu.']],
    uceni: [['MagicStudent', 'Místnosti s AI nástroji pro žáky, učitel vidí jejich aktivitu.'], ['Text Leveler', 'Stejný text ve snazší nebo náročnější verzi.'], ['Podpora SVP', 'Nástroje pro individuální plány a úpravy zadání.']],
    tvorba: [['Pracovní listy', 'Cvičení, doplňovačky a slovníčky k tématu.'], ['Prezentace', 'Osnova a texty snímků.']],
    zdroje: [['Raina', 'Chatovací asistentka pro rychlé dotazy k výuce.'], ['Shrnutí textu', 'Zkrácení a zjednodušení odborného textu.']],
    admin: [['E-mail rodičům', 'Zpráva rodičům v profesionálním tónu.'], ['Komentáře k vysvědčení', 'Návrh slovního hodnocení k doladění.'], ['Doporučující dopis', 'První verze doporučení pro žáka.']]
  },
  start: ['Přihlaste se na magicschool.ai školním účtem Google nebo Microsoft.', 'V nastavení zvolte jazyk výstupu češtinu.', 'Vyzkoušejte Text Leveler na textu z učebnice.'],
  pozor: ['Služba je americká a cílí na americké předpisy (FERPA, COPPA) – u nás nevkládejte osobní údaje žáků.', 'Některé nástroje počítají s americkým školským systémem (známky, standardy).'],
  odkazy: [['MagicSchool', 'https://www.magicschool.ai']]
},
/* ---------------------------------------------------------------- NOTEBOOKLM */
{ id: 'notebooklm', nazev: 'NotebookLM', firma: 'Google', mark: 'Nb', barva: '#3f6b6b', cat: 'studium', catNazev: 'Výzkum a studium · Google',
  popis: 'Nahrajete vlastní materiály a AI z nich vytvoří poznámky, kartičky, kvízy, myšlenkovou mapu i audio „podcast“ se dvěma moderátory.',
  pouziti: ['Audio přehled dlouhého textu k poslechu (i česky)', 'Kartičky a kvízy z nahraných studijních materiálů', 'Odpovídá jen z vašich zdrojů – menší riziko výmyslu'],
  badge: ['Zdarma', 'success'], url: 'https://notebooklm.google.com',
  shrnuti: 'NotebookLM funguje jinak než běžný chatbot: pracuje jen se zdroji, které do „notebooku“ nahrajete (PDF, Dokumenty Google, weby, videa z YouTube), a u odpovědí ukazuje, odkud informace pochází. Z těchto zdrojů vytváří studijní výstupy – audio a video přehledy, myšlenkové mapy, kartičky, kvízy a zprávy. Je součástí Google Workspace for Education, takže ve školním účtu platí stejná ochrana dat jako u Gemini.',
  fakta: [['Přístup', 'Školní nebo osobní účet Google'], ['Cena', 'Zdarma; vyšší limity ve vyšších edicích'], ['Žáci', 'Ve školním účtu podle nastavení správce'], ['Čeština', 'Ano, včetně audio přehledů'], ['Silná stránka', 'Odpovídá jen z vašich zdrojů a cituje je']],
  eko: [
    { t: 'Zdroje', items: ['PDF a soubory', 'Dokumenty a Prezentace Google', 'Webové stránky', 'Videa YouTube'] },
    { t: 'Notebook', items: ['Chat se zdroji', 'Poznámky', 'Citace ke každé odpovědi'] },
    { t: 'Výstupy (Studio)', items: ['Audio přehled', 'Video přehled', 'Myšlenková mapa', 'Kartičky a kvízy', 'Zprávy a studijní průvodce'] }
  ],
  mapa: {
    priprava: [['Studijní průvodce', 'Z kapitoly učebnice vznikne přehled pojmů a otázek.'], ['Časová osa a FAQ', 'Rychlá struktura tématu z více zdrojů.'], ['Sloučení materiálů', 'Několik dokumentů v jednom notebooku – AI je propojí.']],
    hodnoceni: [['Kvízy', 'Cvičný test z nahraných materiálů.'], ['Kartičky', 'Pojem – vysvětlení na procvičování.']],
    uceni: [['Sdílený notebook', 'Žáci pracují s notebookem, který jim připravíte.'], ['Audio přehled', 'Látka jako rozhovor dvou moderátorů k poslechu.'], ['Myšlenková mapa', 'Interaktivní mapa souvislostí v tématu.']],
    tvorba: [['Video přehled', 'Krátké vysvětlující video se snímky z vašich zdrojů.'], ['Zprávy', 'Shrnutí, briefing nebo blogový článek z materiálů.']],
    zdroje: [['Odpovědi s citacemi', 'Každé tvrzení odkazuje na konkrétní místo ve zdroji.'], ['Hledání zdrojů', 'Návrh dalších webových zdrojů k tématu.']],
    admin: [['Směrnice a ŠVP', 'Rychlé odpovědi z dlouhých školních dokumentů.'], ['Podklady k poradě', 'Shrnutí více dokumentů na jednu stránku.']]
  },
  start: ['Otevřete notebooklm.google.com školním účtem.', 'Vytvořte notebook a nahrajte kapitolu z učebnice nebo vlastní prezentaci.', 'Ve Studiu vygenerujte audio přehled v češtině a myšlenkovou mapu.'],
  pozor: ['Kvalita výstupu závisí na kvalitě zdrojů – co v nich není, AI neví.', 'U materiálů chráněných autorským právem nesdílejte notebook veřejně.'],
  odkazy: [['NotebookLM', 'https://notebooklm.google.com'], ['Nápověda NotebookLM', 'https://support.google.com/notebooklm']]
},
/* ---------------------------------------------------------------- PERPLEXITY */
{ id: 'perplexity', nazev: 'Perplexity', firma: 'Perplexity AI', mark: 'Pp', barva: '#20808d', cat: 'studium', catNazev: 'Výzkum a studium · vyhledávání',
  popis: 'AI vyhledávač, který u každého tvrzení uvádí zdroj. Vhodný tam, kde na ověřitelnosti záleží víc než u běžného chatbota.',
  pouziti: ['Rešerše k seminárním pracím s odkazy na zdroje', 'Rychlé ověření aktuálního faktu', 'Ukázka žákům, jak vypadá citovatelný AI výstup'],
  badge: ['Freemium účet', 'neutral'], url: 'https://www.perplexity.ai',
  shrnuti: 'Perplexity je „odpovídací vyhledávač“: místo seznamu odkazů napíše odpověď a ke každé větě připojí číslovaný zdroj. Nad tím stojí Research (hloubková rešerše s delší zprávou), Spaces (sdílené tematické sbírky s vlastními instrukcemi a soubory) a Labs pro tvorbu reportů. Pro výuku je cenný hlavně jako nástroj pro práci se zdroji a ověřování informací.',
  fakta: [['Přístup', 'Web a aplikace, i bez přihlášení'], ['Cena', 'Free, rozšířené funkce v Pro'], ['Žáci', 'Podle podmínek služby a pravidel školy'], ['Čeština', 'Ano'], ['Silná stránka', 'Citace u každé odpovědi']],
  eko: [
    { t: 'Přístup', items: ['Web perplexity.ai', 'Mobilní aplikace', 'Prohlížeč Comet'] },
    { t: 'Režimy', items: ['Rychlé vyhledávání', 'Pro Search', 'Research'] },
    { t: 'Organizace', items: ['Spaces (sbírky)', 'Labs (reporty)', 'Sdílení odkazem'] }
  ],
  mapa: {
    priprava: [['Aktuální podklady', 'Čerstvé informace k tématu hodiny se zdroji.'], ['Spaces', 'Tematická sbírka zdrojů a instrukcí pro jeden předmět.']],
    hodnoceni: [['Ověření tvrzení', 'Rychlá kontrola faktů v práci žáka.']],
    uceni: [['Práce se zdroji', 'Žáci porovnávají odpověď AI s původními zdroji.'], ['Mediální výchova', 'Ukázka, proč nestačí věřit odpovědi bez zdroje.']],
    tvorba: [['Labs', 'Report nebo jednoduchý přehled z rešerše.']],
    zdroje: [['Citace', 'Každá věta s odkazem na zdroj.'], ['Research', 'Hloubková rešerše s delší zprávou.'], ['Akademické zdroje', 'Zaměření vyhledávání na odborné články.']],
    admin: [['Rychlé dotazy', 'Předpisy, termíny a fakta s odkazem na původní stránku.']]
  },
  start: ['Otevřete perplexity.ai a položte otázku ze svého oboru.', 'Klikněte na čísla citací a ověřte, co zdroj opravdu říká.', 'Založte si Space pro předmět se seznamem důvěryhodných zdrojů.'],
  pozor: ['Citace neznamená pravdivost – zdroj může být nekvalitní nebo špatně pochopený.', 'Bezplatná verze má omezený počet hloubkových rešerší.'],
  odkazy: [['Perplexity', 'https://www.perplexity.ai'], ['Nápověda Perplexity', 'https://www.perplexity.ai/help-center']]
},
/* ---------------------------------------------------------------- CANVA */
{ id: 'canva', nazev: 'Canva (Magic Studio)', firma: 'Canva', mark: 'Cv', barva: '#5a4fcf', cat: 'obsah', catNazev: 'Tvorba obsahu · vizuál',
  popis: 'Canva pro školy je zdarma pro ověřené učitele a jejich žáky. Magic Studio přidává AI generování obrázků, převod dokumentu na prezentaci a úpravy na jeden klik.',
  pouziti: ['Prezentace, plakáty a pracovní listy s jednotným vizuálem', 'Magic Switch – z dokumentu prezentace nebo překlad', 'Ilustrace k materiálům z textového popisu'],
  badge: ['Zdarma pro školu', 'success'], url: 'https://www.canva.com/cs_cz/vzdelavani/',
  shrnuti: 'Canva je grafický editor, do kterého je AI vestavěná jako sada funkcí Magic Studio. Učitel s ověřeným účtem Canva pro vzdělávání má prémiové funkce zdarma a může do svých tříd pozvat žáky. AI pomáhá s textem (Magic Write), obrázky a videem (Magic Media), převodem formátů a překladem (Magic Switch), úpravou fotek a nově i s tvorbou malých interaktivních aplikací (Canva Code).',
  fakta: [['Přístup', 'Účet Canva pro vzdělávání (ověření učitele)'], ['Cena', 'Zdarma pro učitele a žáky ZŠ a SŠ'], ['Žáci', 'Ano, ve třídách učitele'], ['Čeština', 'Ano'], ['Silná stránka', 'Vizuální materiály bez grafika']],
  eko: [
    { t: 'Přístup', items: ['Canva pro vzdělávání', 'Třídy a pozvání žáků'] },
    { t: 'Magic Studio', items: ['Magic Write', 'Magic Media', 'Magic Switch', 'Magic Edit a Grab', 'Canva Code'] },
    { t: 'Propojení', items: ['Google Classroom', 'Microsoft Teams', 'Export PDF, PPTX, video'] }
  ],
  mapa: {
    priprava: [['Magic Design', 'Z tématu navrhne hotovou prezentaci nebo plakát.'], ['Šablony pro školy', 'Tisíce šablon pracovních listů a prezentací.']],
    hodnoceni: [['Zadání a odevzdání', 'Žáci odevzdají návrh přes třídu, učitel komentuje.']],
    uceni: [['Třídy', 'Žáci tvoří vlastní plakáty a prezentace v bezpečném prostředí.'], ['Canva Code', 'Interaktivní cvičení nebo kvíz jako malá aplikace.']],
    tvorba: [['Magic Media', 'Obrázky a krátká videa z textového popisu.'], ['Magic Switch', 'Dokument → prezentace, překlad celého návrhu.'], ['Magic Edit', 'Úprava nebo odstranění části fotky.'], ['Magic Write', 'Texty na plakáty a snímky.']],
    zdroje: [['Vizualizace dat', 'Grafy z tabulky přímo v návrhu.']],
    admin: [['Školní komunikace', 'Pozvánky, letáky a certifikáty v jednotném vizuálu školy.'], ['Brand Kit', 'Logo, barvy a písma školy na jednom místě.']]
  },
  start: ['Zaregistrujte se v Canva pro vzdělávání a ověřte se jako učitel.', 'Vyzkoušejte Magic Switch na svém dokumentu – převod na prezentaci.', 'Vytvořte třídu a pozvěte žáky na společný projekt.'],
  pozor: ['Obrázky generované AI kontrolujte – texty a detaily v nich bývají chybné.', 'Generování AI má měsíční limity i v bezplatné školní verzi.'],
  odkazy: [['Canva pro vzdělávání', 'https://www.canva.com/cs_cz/vzdelavani/'], ['Magic Studio', 'https://www.canva.com/magic/']]
},
/* ---------------------------------------------------------------- EDPUZZLE */
{ id: 'edpuzzle', nazev: 'Edpuzzle', firma: 'Edpuzzle', mark: 'Ep', barva: '#b34f1e', cat: 'obsah', catNazev: 'Tvorba obsahu · interaktivní video',
  popis: 'Do výukového videa vloží otázky, na které žák musí odpovědět, než pokračuje dál. AI pomáhá otázky navrhnout, učitel vidí přehled odpovědí celé třídy.',
  pouziti: ['Převrácená třída – video s otázkami jako domácí příprava', 'Okamžitý přehled, kdo látku pochopil a kdo ne', 'Funguje s vlastním videem i s YouTube'],
  badge: ['Freemium účet', 'neutral'], url: 'https://edpuzzle.com',
  shrnuti: 'Edpuzzle je nástroj na interaktivní video. Učitel vezme video (YouTube, vlastní nahrávku), ořízne ho, přidá komentář a do vybraných míst vloží otázky. AI asistent navrhne otázky k obsahu videa, takže příprava trvá minuty. Žáci video sledují svým tempem a učitel vidí, kdo co zhlédl a jak odpověděl. Propojí se s Google Classroom, Microsoft Teams i LMS.',
  fakta: [['Přístup', 'Účet učitele, žáci přes kód třídy'], ['Cena', 'Free s omezeným počtem videí, více v placených plánech'], ['Žáci', 'Ano, přes třídu učitele'], ['Čeština', 'Rozhraní částečně, obsah libovolný'], ['Silná stránka', 'Data o tom, jak žáci video opravdu sledovali']],
  eko: [
    { t: 'Vstup', items: ['YouTube a další videa', 'Vlastní nahrávka', 'Knihovna hotových lekcí'] },
    { t: 'Úprava', items: ['Ořez videa', 'Hlasový komentář', 'Otázky ve videu', 'AI návrh otázek'] },
    { t: 'Propojení', items: ['Google Classroom', 'Microsoft Teams', 'LMS (Moodle, Canvas)'] }
  ],
  mapa: {
    priprava: [['AI návrh otázek', 'Z obsahu videa navrhne otázky, které jen upravíte.'], ['Knihovna lekcí', 'Hotová videa s otázkami od jiných učitelů.']],
    hodnoceni: [['Přehled odpovědí', 'Kdo odpověděl správně a kde se třída zasekla.'], ['Sledování', 'Kolik videa žák opravdu zhlédl.']],
    uceni: [['Převrácená třída', 'Video doma, procvičení ve škole.'], ['Vlastní tempo', 'Žák se může vracet, ale nemůže přeskočit otázku.']],
    tvorba: [['Hlasový komentář', 'Vlastní vysvětlení do cizího videa.'], ['Ořez a poznámky', 'Jen ta část videa, kterou potřebujete.']],
    zdroje: [['Video jako zdroj', 'Práce s odborným videem místo textu.']],
    admin: [['Classroom a Teams', 'Zadání a výsledky bez ručního přepisování.']]
  },
  start: ['Založte si účet učitele na edpuzzle.com.', 'Vyberte krátké video k tématu a nechte AI navrhnout otázky.', 'Zadejte video třídě přes Classroom nebo Teams.'],
  pozor: ['Bezplatný účet má omezený počet uložených videí.', 'AI otázky kontrolujte – mohou se ptát na nepodstatné detaily.'],
  odkazy: [['Edpuzzle', 'https://edpuzzle.com'], ['Nápověda Edpuzzle', 'https://support.edpuzzle.com']]
}
];

/* Projekt Ústeckého kraje – podle zpráv na kr-ustecky.cz (poslední ověření 13. 10. 2026) */
var PROJEKT = {
  cisla: [
    ['212 mil. Kč', 'celkové náklady projektu (až 85 % z OP Spravedlivá transformace)'],
    ['51', 'zapojených středních škol + Datové centrum Ústeckého kraje'],
    ['1 121', 'AI licencí'],
    ['51 + 50', 'AI ambasadorů a AI praktiků'],
    ['51 / 31', 'hybridních učeben / škol s vybavením pro VR'],
    ['~60', 'vzdělávacích akcí, 3 úrovně vzdělávání učitelů']
  ],
  osa: [
    ['26. 2. 2025', 'Start projektu Návrat do budoucnosti', 'Memorandum s Microsoftem: vzdělávání učitelů v AI, AI licence, 200 sad VR brýlí, AI předmětové kabinety.', 'hotovo'],
    ['7. 4. 2025', 'První školení Microsoftu na krajském úřadě', 'Ve čtyřech termínech projde školením o AI přes 300 učitelů.', 'hotovo'],
    ['2.–3. 9. 2025', 'Školení pro základní školy', 'Jeden zástupce z každé ZŠ, ve spolupráci s Microsoftem.', 'hotovo'],
    ['15. 9. 2025', 'Start AI kabinetů na SŠ', 'Sedm předmětových kabinetů (ČJ, AJ, NJ, ZSV, M, Ch, F) vedených AI praktiky.', 'hotovo'],
    ['5. 5. 2026', 'Memorandum s partnerem Google (DPDC)', 'Google Workspace for Education pro krajské školy a proškolení všech škol přes Gemini Academy.', 'hotovo'],
    ['8. 9. 2026', 'Zastupitelstvo schválilo projektový záměr', '„Zavádění nástrojů AI do výuky na středních školách Ústeckého kraje“ – až 212 mil. Kč.', 'nove'],
    ['listopad 2026', 'Podání žádosti do OP Spravedlivá transformace', 'Plánovaný termín podle kraje.', 'plan'],
    ['leden 2027 – červenec 2029', 'Realizace projektu', 'Licence, hybridní učebny, VR, AI kabinety, ambasadoři a praktici, vzdělávání učitelů.', 'plan']
  ],
  zdroje: [
    ['Ústecký kraj pokračuje v zavádění AI do středních škol (8. 9. 2026)', 'https://www.kr-ustecky.cz/ustecky-kraj-pokracuje-v-zavadeni-umele-inteligence-do-strednich-skol-navazuje-na-navrat-do-budoucnosti'],
    ['Memorandum se společností Google (5. 5. 2026)', 'https://www.kr-ustecky.cz/memorandum-se-spolecnosti-google-pomuze-skolam-s-umelou-inteligenci'],
    ['Zahájení činnosti AI kabinetů (15. 9. 2025)', 'https://www.kr-ustecky.cz/ustecky-kraj-zahajuje-cinnost-ai-kabinetu-na-strednich-skolach-jde-o-dalsi-krok-v-projektu-navrat-do-budoucnosti'],
    ['Návrat do budoucnosti – představení projektu (26. 2. 2025)', 'https://www.kr-ustecky.cz/navrat-do-budoucnosti-ustecky-kraj-investuje-do-vzdelavani-a-modernich-technologii']
  ]
};

/* Rychlý výběr na dashboardu: účel → doporučené nástroje (pořadí = doporučení) */
var DOPORUCENI = {
  priprava:  ['copilot', 'gemini', 'sciobot', 'magicschool'],
  hodnoceni: ['magicschool', 'copilot', 'claude', 'edpuzzle'],
  uceni:     ['notebooklm', 'gemini', 'copilot', 'edpuzzle'],
  tvorba:    ['canva', 'claude', 'chatgpt', 'notebooklm'],
  zdroje:    ['perplexity', 'notebooklm', 'gemini', 'chatgpt'],
  admin:     ['copilot', 'gemini', 'chatgpt', 'magicschool']
};

function najdiNastroj(id) { for (var i = 0; i < NASTROJE.length; i++) if (NASTROJE[i].id === id) return NASTROJE[i]; return null; }
