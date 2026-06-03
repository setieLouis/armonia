# Analisi Tecnica: Pagina Aggiornamento Dieta (Diet Update)

## 1. Obiettivo & Analisi Visiva
- **Obiettivo**: Permettere all'utente di caricare un nuovo piano alimentare (JSON) con lo stesso stile della "Welcome Page", aggiungendo un controllo per la sovrascrittura di date esistenti.
- **Riferimento Visivo**: Coerenza con `welcome.html` (modalità full-page). 
- **Componenti logici**:
    - **Header**: Con pulsante "Back" per tornare alla Today.
    - **Input Section**: Campo per il nome (facoltativo/pre-compilato) e pulsante "Sfoglia" per il JSON.
    - **Counter Weeks**: Selettore per quante settimane generare.
    - **Conflict Modal**: Overlay di avviso se le date calcolate sono già presenti nel DB.

## 2. Architettura dei Componenti (Regola 3+3)
- **Prefisso**: `.diu` (Diet Update)
- **Struttura**:
    - `.diu-container`: Root container flessibile.
    - `.diu-card`: Box bianco arrotondato per le azioni.
    - `.diu-alert`: Banner di avviso (nascosto per default) per i conflitti.

## 3. Logica e Gestione Dati
- **Shared Logic**: Verrà estratta/replicata la logica di `transformGenerateData` per il calcolo delle date.
- **Conflict Detection**: Prima del salvataggio, una query su `window.db.meals` verificherà se le chiavi (date) generate sono già popolate.
- **Persistence**: Salvataggio tramite `window.localDB.saveMeal`.

## 4. Roadmap di Implementazione
- [x] **Step 1 (Scaffolding)**: Creazione cartella e file core.
- [x] **Step 2 (UI Design)**: Scrittura HTML e CSS (ispirato al welcome).
- [x] **Step 3 (JS Logic)**: Implementazione import file e logica di calcolo date.
- [x] **Step 4 (Conflict Check)**: Implementazione della funzione di verifica override.
- [x] **Step 5 (Navigation)**: Collegamento nel Menu Hamburger e routing in `script.js`.
- [x] **Step Finale**: Validazione completa.
