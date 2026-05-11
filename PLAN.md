# Plan: Implementazione Mockup Armonia Flow

## Objective
Ricreare fedelmente l'interfaccia utente mostrata nel mockup `seconda.png`, adottando un approccio modulare, pulito e mantenibile utilizzando Vanilla JavaScript, HTML e CSS.

## Key Files & Context
- `index.html`: Cordinerà il caricamento dei componenti.
- `style.css`: Conterrà le variabili globali di design (colori, typography) e il layout base per simulare lo schermo mobile.
- `script.js`: Gestirà il dynamic loading dei componenti (Fetch API) come già impostato.
- Nuovi componenti in `components/`:
  - `header`: Saluti e data.
  - `calendar`: Selettore giorni della settimana.
  - `meal-card`: Componente riutilizzabile per i singoli pasti.
  - `progress`: Card di riepilogo giornaliero.
  - `bottom-nav`: Barra di navigazione inferiore.

## Implementation Steps

### Step 1: Design System & Reset
- Ripulire `index.html`, `style.css` e `components/today/*` dagli esperimenti precedenti.
- Definire in `style.css` le variabili CSS estratte dal mockup (es. `--primary-green: #719b6e`, `--bg-color: #fbfbfb`, `--text-main: #333`).
- Impostare un layout mobile-first centrato nella pagina (es. `width: 375px`, `height: 812px`, `border-radius: 40px`).

### Step 2: Componente Header & Calendar
- Creare `components/header/header.html` per "Ciao Giulia" e la data.
- Creare `components/calendar/calendar.html` e `.js`. Il CSS gestirà lo stato "attivo" (verde) e "inattivo" (bianco con ombra).

### Step 3: Componente Lista Pasti
- Poiché ci sono molte card simili, l'approccio migliore è creare un "contenitore" (`meals-list`) e un JavaScript che inietta dinamicamente le `meal-card` passando parametri (titolo, icone, stato completamento).
- Implementare i CSS per le icone arrotondate e gli SVG per gli stati (spunta verde, cerchio arancione parziale, cerchio vuoto).

### Step 4: Componente Progressi
- Creare `components/progress/progress.html`.
- Implementare il box verde chiaro con la barra di progresso e il posizionamento dei testi al 70%.

### Step 5: Componente Navigazione
- Creare `components/nav/nav.html` per la barra in basso.
- Fissare la barra sul fondo del contenitore mobile.
- Impostare gli stili per l'icona attiva (Home).

### Step 6: Assemblaggio Finale
- Aggiornare `index.html` inserendo i placeholder nell'ordine corretto.
- Aggiornare `script.js` per caricare in sequenza tutti i componenti.

## Verification & Testing
- Verificare visivamente che proporzioni, colori, spaziature e font (fallback su sans-serif moderni come Inter/San Francisco) combacino con `seconda.png`.
- Assicurarsi che i componenti vengano caricati correttamente e senza errori in console.
- Controllare che il layout non "strabordi" dai limiti del finto schermo mobile e che la sezione pasti sia scrollabile se necessario.
