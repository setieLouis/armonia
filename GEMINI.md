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

### Struttura di un Componente
Ogni componente deve idealmente essere isolato utilizzando la **Strict Hierarchical Namespacing Rule**:

1.  **Componente Padre**: Prefisso di 3 lettere (es. `today` -> `.tod`).
2.  **Sub-Componente**: Prefisso Padre + 3 lettere del sub-componente (es. `today/header` -> `.tod-hea`).

**Esempio di utilizzo:**
```html
<!-- today/sub_components/meals/meals.html -->
<div class="tod-mea meals-container">
    <style>
        .tod-mea.meals-container { ... }
        .tod-mea .meal-card { ... }
    </style>
</div>
```

## Come aggiungere un componente
1.  Crea la cartella in `components/`.
2.  Crea il file `.html` (con eventuali stili inline).
3.  (Opzionale) Crea il file `.js` con la funzione `window.initMyComponent`.
4.  Registra il caricamento nel file orchestratore pertinente (es. `today.js`).


