# Armonia Flow - Project Documentation

## Overview
Armonia Flow è un mockup di interfaccia mobile realizzato in **Vanilla JavaScript**, focalizzato sulla modularità e sulla manutenibilità senza l'uso di framework esterni. Il progetto segue un approccio **Component-Based** personalizzato.

## Architettura dei Componenti
Il progetto utilizza un sistema di caricamento dinamico basato sulla Fetch API per iniettare frammenti di HTML e logica JS nel DOM.

### Motore di Caricamento (`script.js`)
- `loadComponent(id, path, initFunc)`: Esegue il fetch di un file HTML e lo inserisce nel container specificato. Opzionalmente esegue una funzione di inizializzazione.
- `loadScript(src)`: Carica dinamicamente file JavaScript aggiuntivi.

### Gerarchia di Caricamento
1.  **Entry Point**: `index.html` (carica `script.js` e la shell globale).
2.  **Vista Principale**: `components/today/today.html` (carica il frame mobile).
3.  **Orchestratore**: `components/today/today.js` (coordina il caricamento dei sotto-componenti).
4.  **Sotto-Componenti**: Situati in `components/today/sub_components/` (Header, Calendar, Meals, Progress).

## Convenzioni di Sviluppo

### Regola Generale di Generazione Prefissi (Regola "3+3")
Per garantire coerenza nei futuri sviluppi, i prefissi devono essere generati seguendo questo schema:

1.  **Componente Radice (Vista/Pagina)**: Prime 3 lettere del nome della cartella (es. `settings` -> `.set`).
2.  **Sotto-Componente**: Prefisso della Radice + `-` + Prime 3 lettere del nome del sotto-componente (es. `settings/account` -> `.set-acc`).

**Linee guida per le abbreviazioni:**
- Usa solo lettere minuscole.
- Se il nome è composto da più parole, usa la prima lettera di ogni parola o le prime 3 dell'ultima (es. `user-profile` -> `.usp`).
- In caso di collisione (es. `profile` e `products` entrambi `.pro`), aggiungi una quarta lettera o usa una consonante distintiva (es. `.pri` vs `.pro`).

#### Esempio di Applicazione Generica:
```text
folder: components/profile/
prefix: .pro

folder: components/profile/sub_components/avatar/
prefix: .pro-ava
```

#### Tabella dei Prefissi (Vista Today: `.tod`)

| Componente | Percorso | Prefisso |
| :--- | :--- | :--- |
| **Today (Shell)** | `components/today/today.html` | `.tod` |
| **Header** | `.../sub_components/header/` | `.tod-hea` |
| **Calendar** | `.../sub_components/calendar/` | `.tod-cal` |
| **Meals** | `.../sub_components/meals/` | `.tod-mea` |
| **Progress** | `.../sub_components/progress/` | `.tod-pro` |

**Regola Operativa:**
Tutti i selettori CSS devono essere discendenti del prefisso o applicati direttamente ad esso.
```html
<!-- Esempio: components/today/sub_components/header/header.html -->
<div class="tod-hea header-container">
    <style>
        .tod-hea.header-container { ... }
        .tod-hea .greeting-text { ... }
    </style>
</div>
```

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

---

## Struttura Standard dei Componenti Principali (Viste)

Ogni componente principale (che rappresenta una vista o una pagina intera) deve seguire rigorosamente questa struttura di cartelle e file:

### Schema della Cartella
```text
components/[nome-componente]/
├── [nome-componente].html      # Shell/Container principale
├── [nome-componente].js        # Orchestratore della vista (opzionale)
├── [nome-componente].md        # Piano di implementazione (Mockup-to-Plan)
├── analisi.md                  # Note tecniche e documentazione specifica
└── sub_components/             # Sotto-moduli atomici isolati
    ├── [sub-1]/
    │   └── [sub-1].html
    └── [sub-2]/
        ├── [sub-2].html
        └── [sub-2].js
```

### Regole sui File:
1.  **Nomi Coerenti**: Il file HTML principale deve avere lo stesso nome della cartella genitore.
2.  **Orchestratore**: Se la vista carica più sotto-componenti, deve avere un file `.js` che coordina le chiamate `loadComponent`.
3.  **Documentazione**: Ogni vista deve contenere il proprio piano di implementazione (`.md`) per tracciarne l'evoluzione rispetto al mockup originale.
4.  **Isolamento**: I sotto-componenti non devono mai trovarsi alla radice di `components/` se sono specifici di una vista; devono essere dentro la cartella `sub_components/` della vista di appartenenza.

---

## Come aggiungere un componente
1.  Crea la cartella in `components/`.
2.  Crea il file `.html` (con eventuali stili inline).
3.  (Opzionale) Crea il file `.js` con la funzione `window.initMyComponent`.
4.  Registra il caricamento nel file orchestratore pertinente (es. `today.js`).


