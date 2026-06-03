# Analisi Tecnica: Componente Menu (Hamburger)

## 1. Obiettivo & Analisi Visiva
- **Riferimento**: Richiesta utente per sostituzione icona "leaf" con "hamburger" e apertura drawer.
- **Comportamento**: Un menu a comparsa (Drawer) che scorre da destra verso l'indice o appare come overlay.
- **Design Tokens**:
    - Sfondo: `var(--white)` o `var(--primary-green-light)` per coerenza.
    - Testo: `var(--text-main)`.
    - Ombra: `0 4px 12px rgba(0,0,0,0.1)`.

## 2. Architettura dei Componenti (Regola 3+3)
- **Prefisso**: `.men`
- **Struttura**:
    - `.men-overlay`: Sfondo scuro semitrasparente.
    - `.men-drawer`: Il contenitore bianco laterale.
    - `.men-item`: Singola riga del menu (usando `ListTile` se possibile).

## 3. Logica e Gestione Dati
- **Stato**: `isOpen` (boolean).
- **Funzioni**: `openMenu()`, `closeMenu()`.
- **Integrazione**: L'Header attiva l'apertura tramite un evento custom o callback.

## 4. Roadmap di Implementazione
- [x] **Step 1 (Scaffolding)**: Creazione cartella e file base (analisi.md, menu.html, menu.js).
- [x] **Step 2 (UI & Style)**: Definizione del layout CSS per il drawer (hidden by default).
- [x] **Step 3 (Header Update)**: Modifica di `header.js` per includere l'icona hamburger e il trigger click.
- [x] **Step 4 (Orchestration)**: Collegamento tra Header e Menu in `today.js`.
- [x] **Step Finale**: Verifica navigazione e chiusura menu al click fuori.
