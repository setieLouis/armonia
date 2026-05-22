# Analisi Tecnica: Barra di Navigazione (bottom-nav)

## 1. Obiettivo & Analisi Visiva
L'obiettivo è implementare una barra di navigazione inferiore persistente, basata sul design mostrato nel mockup `prima.png`. La barra deve permettere il passaggio rapido tra le sezioni principali dell'app (Home, Piano, Progressi, Profilo).

### Componenti Logici
- **Contenitore Nav**: Barra fissa al fondo dello schermo con sfondo bianco.
- **Nav Items**: 4 pulsanti interattivi composti da Icona (SVG) e Label.
- **Stato Active**: Evidenziazione cromatica (verde brand) dell'elemento corrispondente alla vista corrente.

### Design Tokens
- **Background**: `var(--white)`
- **Active Color**: `var(--primary-green)` (#719b6e)
- **Inactive Color**: `var(--text-muted)` (#777777)
- **Border Top**: 1px solid `var(--gray-light)` (#f0f0f0)

---

## 2. Stato Attuale e Lacune
Attualmente il file `components/nav/nav.html` contiene la struttura HTML e gli stili CSS, ma presenta diverse criticità:

1. **Mancanza di Logica**: Non esiste un file `nav.js`. I pulsanti non reagiscono al click e non c'è gestione dello stato "attivo".
2. **Integrazione Layout**: La Nav non è ancora inclusa nelle viste principali (`today.html`, `current-meal.html`).
3. **Posizionamento**: L'uso di `position: absolute` all'interno di `.scrollable-content` causerebbe lo scorrimento della barra insieme ai pasti. Deve essere spostata all'esterno del contenitore di scroll.
4. **Semantica**: Gli item sono `div`. Per accessibilità e feedback touch dovrebbero essere `button`.

---

## 3. Architettura e Gestione Dati
- **Prefisso Radice**: `.bottom-nav`
- **Dati Dinamici**: La Nav deve ricevere la "vista corrente" per evidenziare l'icona giusta.
- **Eventi**: Ogni click deve chiamare la funzione globale `navigateTo(view)`.

---

## 4. Roadmap di Implementazione

### Step 1: Refactoring Struttura (HTML/CSS)
- [ ] Trasformare gli item in `<button>` o aggiungere `role="button"`.
- [ ] Rimuovere il `border-bottom-radius` se la Nav tocca il bordo fisico dello schermo.
- [ ] Preparare gli stili per le diverse varianti di stato (hover/active).

### Step 2: Orchestrazione (`nav.js`)
- [ ] Creare `components/nav/nav.js`.
- [ ] Implementare la funzione `initNav(container, activeTab)`.
- [ ] Collegare i click al motore di navigazione di `script.js`.

### Step 3: Integrazione Globale
- [ ] Aggiungere `<div id="nav-root"></div>` in `today.html` e `current-meal.html`.
- [ ] Modificare gli orchestratori (`today.js`, `current-meal.js`) per inizializzare la Nav al caricamento della pagina.

### Step 4: Polish & Feedback
- [ ] Aggiungere una leggera transizione o micro-animazione (scale) al cambio di tab.
- [ ] Verificare la persistenza del `dateId` durante il cambio di tab se necessario.

---
## Checklist di Avanzamento
- [x] Analisi Tecnica e Visiva
- [ ] Step 1: Refactoring HTML/CSS
- [ ] Step 2: Logica JavaScript
- [ ] Step 3: Integrazione Layout
- [ ] Step 4: Final Polish
