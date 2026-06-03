## Workflow di Sviluppo (Git Flow)

Il progetto segue il modello **Git Flow** per la gestione dei rami e dei rilasci.

- **main**: Ramo di produzione (stabile).
- **develop**: Ramo principale per lo sviluppo.
- **feature/**: Nuove funzionalità (partono da `develop`).
- **hotfix/**: Correzioni urgenti in produzione (partono da `main`).
- **release/**: Preparazione per il rilascio (partono da `develop`).

È caldamente raccomandato l'uso dei comandi `git flow [feature|hotfix|release] start/finish` per garantire la coerenza del repository.

---

## Processo di Pianificazione Nuove Viste (Mockup-to-Plan)

Prima di iniziare l'implementazione di una nuova vista o pagina partendo da un mockup (es. un file immagine), è obbligatorio creare un file di pianificazione (es. `nome_vista.md`) seguendo questo schema standard:

### Struttura del Piano Tecnico
1.  **Obiettivo & Analisi Visiva**: 
    - Identificazione del file di riferimento (es. `quarta.png`).
    - Elenco dei componenti logici (Header, List, Card, ecc.).
    - Estrazione dei Design Tokens (Colori, Spaziature, Border-radius).
2.  **Architettura dei Componenti (Regola 3+3)**:
    - Definizione del prefisso radice e della mappa dei sotto-componenti.
3.  **Logica e Gestione Dati**:
    - Distinzione tra elementi statici e dinamici (che richiedono file `.js`).
4.  **Roadmap di Implementazione**:
    - **Step 1 (Scaffolding & Root)**: 
        - Creazione immediata della cartella e dei file core: `[nome].html`, `[nome].js`, e `analisi.md`.
        - Definizione del container radice nel file HTML con la classe del prefisso (es. `.mea`).
        - Registrazione dello script orchestratore.
    - **Step 2...N**: Implementazione dei sotto-componenti (HTML + CSS isolato + JS).
    - **Step Finale**: Inserire una checklist di riepilogo per monitorare l'avanzamento di tutti gli step definiti nella Roadmap.

---

## Componenti Plug-and-Play (Reusable Components)

Per garantire coerenza visiva e velocità di sviluppo, è obbligatorio verificare e utilizzare i componenti "pluggable" prima di creare nuovo codice UI ridondante.

### 1. ListTile (`components/list-tile/list-tile.js`)
Il componente atomico più importante per liste e intestazioni.
- **Varianti**:
    - `default`: Card bianca con ombra, usata per elementi di liste cliccabili.
    - `header`: Trasparente, font grandi, usata per titoli di sezione.
- **Proprietà principali**: `leading` (icona/immagine), `title`, `subtitle`, `trailing` (azione/status), `bgClass`.

### 2. Header (`components/header/header.js`)
Gestore della barra di navigazione superiore.
- **Funzione**: `initHeader(container, {left, rigth})`.
- **Utilizzo**: Gestione di titoli dinamici, pulsanti "back" e menu opzioni.
- **Stato**: Supporta `updateHeader` per aggiornamenti in tempo reale senza re-rendering dell'intera pagina.

### 3. InfoBanner (`components/info-banner/info-banner.js`)
Componente per messaggi informativi, alert o note.
- **Funzione**: `renderInfoBanner({icon, message, variant})`.
- **Utilizzo**: Banner a piè di pagina o messaggi di sistema.
- **Varianti**: `info` (default beige/marrone).

### Regola d'Oro del Riuso
Se un elemento del mockup somiglia a una riga di lista o a una barra superiore, **NON** scrivere HTML/CSS custom nella nuova vista. "Plugga" i componenti sopra citati e configurali via JavaScript nell'orchestratore della vista.

---