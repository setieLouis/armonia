# Analisi Tecnica: Pagina Novità (Features Info)

## 1. Obiettivo & Analisi Visiva
- **Obiettivo**: Informare l'utente sulle nuove funzionalità rilasciate e su quelle in arrivo.
- **Riferimento Visivo**: Stile "Zen" coerente con il resto dell'app. Lista verticale di card eleganti.
- **Componenti logici**:
    - **Header**: Con pulsante "Back" (sinistra) e Titolo "Novità" (centro).
    - **Feature Card**: Card contenente Icona, Titolo, Descrizione e Badge di Stato (Disponibile/In Arrivo).
    - **Empty State**: Messaggio se non ci sono novità caricate.

## 2. Architettura dei Componenti (Regola 3+3)
- **Prefisso**: `.fei` (Features Info)
- **Struttura**:
    - `.fei-container`: Root container con scroll verticale.
    - `.fei-card`: Card bianca con ombra leggera.
    - `.fei-badge`: Etichetta colorata per lo stato (es. verde per "Nuovo", arancio per "Prossimamente").

## 3. Logica e Gestione Dati
- **Data Source**: File `features_data.json` per facilitare l'aggiornamento senza toccare il codice.
- **Rendering**: Funzione `renderFeatures()` che cicla sui dati JSON e genera l'HTML.
- **Stato**: Gestione badge dinamico in base al campo `status` nel JSON.

## 4. Roadmap di Implementazione
- [x] **Step 1 (Scaffolding)**: Creazione cartella e file core.
- [x] **Step 2 (Data Setup)**: Popolamento del file `features_data.json` con le feature attuali e future.
- [x] **Step 3 (UI Design)**: Scrittura HTML e CSS per la lista di card.
- [x] **Step 4 (JS Logic)**: Implementazione del fetch dei dati e rendering dinamico.
- [x] **Step 5 (Navigation)**: Collegamento nel Menu Hamburger e routing in `script.js`.
- [x] **Step Finale**: Validazione e rifinitura estetica.
