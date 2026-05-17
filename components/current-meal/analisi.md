# Analisi Tecnica: Dettaglio Pasto (current-meal)

## 1. Obiettivo & Analisi Visiva
L'obiettivo è implementare la vista di gestione del pasto corrente (es. "Colazione") basandosi sul mockup `terza.png`. La vista mostra gli alimenti previsti, il loro stato di completamento e le alternative disponibili.

### Componenti Logici:
1.  **Top Navigation**: Pulsante "Indietro" (sinistra) e pulsante "Menu/Opzioni" (destra, tre puntini).
2.  **Meal Header**: Icona descrittiva (es. Sole), Titolo del pasto ("Colazione") e contatore di completamento ("3 / 3 completati").
3.  **Food List**: Lista di schede (Card) verticali.
    - **Food Card**: Immagine circolare/arrotondata a sinistra, Titolo ("Caffè"), Sottotitolo/Quantità ("1 tazzina") e indicatore di stato (Checkmark verde).
4.  **Alternatives Footer**: Barra orizzontale arrotondata con colore di sfondo tenue, testo "Alternative disponibili" e contatore con freccia.

### Design Tokens:
- **Colori**:
    - Sfondo Pagina: `#FFFFFF` (o grigio chiarissimo quasi bianco).
    - Background Card: `#FFFFFF` con leggera ombra o bordo tenue.
    - Checkmark: Verde soft (`#8DA67D`).
    - Footer Background: Arancio/Beige chiarissimo (`#FFF0E0`).
- **Spaziature**: Margini laterali di circa `20px`, gap tra le card di `12px`.
- **Border-radius**: `24px` per le card e il footer.

## 2. Architettura dei Componenti (Regola 3+3)
La vista è costruita "pluggando" componenti generici esistenti per massimizzare il riuso:
- **Prefisso Radice**: `.c-meal`
- **Mappa Componenti**:
    - `.c-meal__nav`: Implementato tramite **Header pluggable** (`initHeader`), configurato con icone di navigazione.
    - `.c-meal__header`: Implementato tramite **ListTile pluggable** (variant: `header`), configurato con l'icona del sole e il progresso.
    - `.c-meal__list`: Container che istanzia più **ListTile pluggable** (variant: `default`) per gli alimenti.
    - `.c-meal__footer`: Componente custom per le alternative (Barra pillola).

## 3. Logica e Gestione Dati
- **Integrazione Componenti**:
    - `ListTile.js`: Caricato dinamicamente se non presente. Uso di `renderListTile` per la generazione del markup.
    - `Header.js`: Utilizzato per la barra di navigazione superiore per gestire stati dinamici (es. cambio titolo).
- **Elementi Dinamici**: 
    - Array di oggetti `items` (nome, quantità, immagine, completato).
    - Calcolo automatico del testo "X / Y completati".
    - Gestione dello stato "Checked" tramite le `statusIcons` (pattern derivato da `meals.js`).

## 4. Roadmap di Implementazione

- **Step 1: Scaffolding & Root**
    - [x] Verifica cartella e file base (`current-meal.html`, `.js`, `.css`).
    - [x] Definizione del container radice `.c-meal`.
- **Step 2: Top Nav & Header (Plugging)**
    - [ ] Inizializzazione `Header` per la navigazione con icone "back" e "more".
    - [ ] Inizializzazione `ListTile` (variant header) per il riepilogo pasto.
- **Step 3: Food List & Item Card (Rendering)**
    - [ ] Rendering dinamico della lista alimenti usando `renderListTile` per ogni riga.
    - [ ] Mapping dei dati (immagine, titolo, quantità, checkmark).
- **Step 4: Alternatives Footer**
    - [ ] Styling e implementazione della barra inferiore `.c-meal__footer`.
- **Step 5: Logic & Interaction**
    - [ ] Toggle dello stato completato al click sulla card e aggiornamento contatore.

### Checklist di Avanzamento
- [x] Step 1: Scaffolding & Root
- [x] Step 2: Top Nav & Header
- [x] Step 3: Food List & Item Card
- [x] Step 4: Alternatives Footer
- [x] Step 5: Logic & Interaction
