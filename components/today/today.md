# Pianificazione Implementazione Mockup "Today" (Armonia Flow)

## Obiettivo
Ricreare con precisione l'interfaccia utente mobile mostrata nel file `seconda.png`. L'architettura sarà strettamente modulare, basata su Vanilla JavaScript, HTML e CSS, per garantire massima manutenibilità.

## Analisi Visiva e Strutturale (seconda.png)
L'interfaccia è un'app mobile (layout verticale, angoli arrotondati) con le seguenti sezioni logiche:
1. **Global/Base**: Sfondo grigio/crema chiaro, font sans-serif pulito (stile iOS).
2. **Header**: 
   - Saluto testuale ("Ciao, Giulia") con icona foglia verde.
   - Giorno della settimana grande ("Lunedì") e data ("12 Maggio") con icona calendario.
3. **Selettore Settimanale (Calendar)**:
   - Una riga orizzontale di giorni (Dom 11 - Sab 17).
   - Le "card" dei giorni sono bianche con una leggera ombra. Il giorno selezionato ("Lun 12") ha sfondo verde e testo bianco.
4. **Lista Pasti (Meals)**:
   - Titolo di sezione: "Pasti della giornata".
   - 4 Card pasto identiche per struttura: Icona tematica (sole, mela, ciotola, luna) con sfondo pastello, Titolo (Colazione, Spuntino, ecc.), Contatore ("3 / 3 completati"), e un indicatore di stato visivo (Spunta verde, anello arancione parziale, anello grigio vuoto).
5. **Progresso Giornaliero (Progress)**:
   - Card rettangolare con sfondo verde pallido.
   - Intestazione "Giornata completata" con la percentuale "70%".
   - Barra di progresso lineare (sfondo semi-transparente, riempimento verde pieno).
   - Messaggio motivazionale "Ottimo lavoro! 🌱".
6. **Barra di Navigazione Inferiore (Bottom Nav)**:
   - Fissa in basso, 4 icone (Home, Piano, Progressi, Profilo).
   - L'elemento "Home" è evidenziato in verde.

## Architettura dei File
L'architettura prevede un caricatore centrale (`index.html`) che include il frammento principale (`today.html`), il quale a sua volta fungerà da contenitore per i sub-componenti.
- `index.html`: Shell principale. Carica le dipendenze globali.
- `style.css`: Solo Token globali (colori, typography) e reset CSS.
- `script.js`: Motore di caricamento dinamico (Fetch API).
- `components/today/`: Modulo principale della vista.
  - `today.html`: Struttura del contenitore mobile e placeholder dei componenti.
  - `today.css`: Stili del contenitore (layout mobile, scrollbar).
  - `today.js`: Orchestratore per il caricamento dei sub-componenti.
- `components/`: Cartelle per i sub-componenti (`header`, `calendar`, `meals`, `progress`, `nav`). Ognuno conterrà HTML, CSS e JS propri.

## Step di Implementazione

### Step 1: Base e Layout Contenitore (Today Root)
- Pulizia dell'ambiente.
- Definizione dei design tokens (colori estratti dall'immagine) nel file globale `style.css`.
- Costruzione del layout "mobile-frame" in `components/today/today.html` e stili in `components/today/today.css`.
- Aggiornamento di `script.js` e `today.js` per far funzionare l'inclusione dinamica di base.

### Step 2: Componente Header
- Sviluppo di `components/header/header.html` e `header.css` (o stili inline).
- Inserimento dei testi statici e degli SVG per la foglia e il calendario.

### Step 3: Componente Calendario (Selettore Settimanale)
- Sviluppo di `components/calendar/calendar.html` e `calendar.css`.
- Creazione della riga dei giorni e applicazione degli stili "attivo" e "inattivo".

### Step 4: Componente Lista Pasti
- Sviluppo del contenitore `components/meals/meals.html`.
- Creazione di un motore di rendering in `components/meals/meals.js` che, partendo da un array di dati (che simula i pasti, i contatori e gli stati visuali), generi dinamicamente l'HTML delle singole "Meal Card".
- Disegno tramite SVG degli indicatori circolari di stato.

### Step 5: Componente Progresso Giornaliero
- Sviluppo di `components/progress/progress.html`.
- Realizzazione della card verde e della barra di avanzamento percentuale.

### Step 6: Componente Bottom Nav e Integrazione Finale
- Sviluppo di `components/nav/nav.html` con le icone SVG.
- Integrazione di tutti i componenti nei rispettivi placeholder all'interno di `today.html` tramite `today.js`.
- Verifica visiva finale di allineamenti, margini e colori per garantire la corrispondenza con il mockup originale.
