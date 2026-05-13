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

## Come aggiungere un componente
1.  Crea la cartella in `components/`.
2.  Crea il file `.html` (con eventuali stili inline).
3.  (Opzionale) Crea il file `.js` con la funzione `window.initMyComponent`.
4.  Registra il caricamento nel file orchestratore pertinente (es. `today.js`).


