# Analisi Tecnica: Implementazione Pagina Welcome (prima_bis.png)

## 1. Obiettivo
Riprodurre fedelmente il mockup visivo `prima_bis.png` utilizzando esclusivamente tecnologie web (HTML5 e CSS3), garantendo un layout mobile-first pulito, elegante e performante.

## 2. Struttura HTML (Scaffolding)
La gerarchia dei tag deve seguire la disposizione verticale del mockup, suddivisa in aree logiche:

- **Root Container (`.wel`)**: Contenitore principale per isolare lo stile e gestire il layout Flexbox.
- **Header (`.wel__header`)**: Area superiore per il logo centrale con le foglie.
- **Branding (`.wel__content`)**: 
    - Titolo `<h1>`: Testo "ARMONIA" con font Serif e spaziatura ampia.
    - Sottotitolo `<p>`: Testo "Il tuo equilibrio inizia oggi".
- **Actions Area (`.wel__actions`)**:
    - Campo di input per il "Nome" (Pill-shaped).
    - Pulsante secondario "Importa PDF".
    - Pulsante primario "Inizia" con freccia di navigazione.
- **Decoration Area (`.wel__decoration`)**: Area riservata all'immagine dei vasi e delle piante posizionata in background.

## 3. Design Tokens & Tipografia
- **Titolo "ARMONIA"**:
    - **Colore**: Verde Bosco/Scuro.
    - **Font**: Serif Lapidario (es. Cinzel o Georgia).
    - **Case**: Uppercase.
    - **Spaziatura**: `letter-spacing` elevato (effetto arioso).
- **Testi Interfaccia**: Font Sans-Serif moderno per massima leggibilità su schermi piccoli.
- **Forme**: Tutte le aree interattive seguono il design "Pill" (bordi molto arrotondati).

## 4. Logica e Funzionalità
- **Interattività**: Gli elementi devono avere `id` univoci per la gestione tramite `welcome.js`.
- **Dati**: L'input "Nome" deve permettere la memorizzazione del nome utente per la personalizzazione dell'esperienza.
- **Navigazione**: Il pulsante "Inizia" funge da trigger per l'ingresso nell'applicazione principale.

## 5. Roadmap Operativa
1. [x] Creazione struttura HTML semantica.
2. [x] Implementazione dello stile CSS per la sezione Branding.
3. [x] Implementazione dello stile CSS per Input, Bottoni e Navigation.
4. [x] Documentazione del piano tecnico (`analisi.md`).
5. [ ] Implementazione della logica interattiva in `welcome.js`.

## 6. Da Fare (Elementi Mancanti)
Per una riproduzione identica al mockup `prima_bis.png`, occorre integrare:

- **Iconografia specifica**: 
    - Icona utente per l'input Nome.
    - Icona documento per "Importa PDF".
    - Icona freccia (`>`) per il pulsante "Inizia".
- **Barra di Stato Sistema**: Aggiunta di orario (9:41), segnale, Wi-Fi e batteria per realismo demo.
- **Sfondo Decorativo**: Inserimento dell'immagine dei vasi e delle piante nell'area `.wel__decoration`.
- **Font Esterni**: Link a Google Fonts nell'HTML per caricare il font Serif (es. Cinzel) invece del fallback locale.
