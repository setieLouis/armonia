# Analisi Tecnica: Alternative Ingrediente (ingredient/alternatives)

## 1. Obiettivo & Analisi Visiva
L'obiettivo è implementare la vista "Alternative disponibili", presentata come un modal/bottom sheet che si sovrappone alla vista corrente. Permette all'utente di scegliere un sostituto per un ingrediente specifico.

### Componenti Logici:
1.  **Overlay Background**: Sfondo sfocato o scurito che mostra la vista sottostante (l'ingrediente originale).
2.  **Modal Sheet**: Container bianco con angoli superiori molto arrotondati.
    - **Handle**: Piccola barra orizzontale per indicare la natura trascinabile.
    - **Header**: Titolo "Alternative disponibili" e pulsante di chiusura (X).
3.  **Alternative List**: Lista di schede informative.
    - **Alt Card**: Layout orizzontale. Immagine a sinistra, testi centrali (Titolo, Grammi, Macro-nutrienti), pulsante "+" a destra.
4.  **Info Banner**: Nota a piè di pagina con icona informativa su sfondo beige tenue.

### Design Tokens:
- **Colori**:
    - Card 1 (Selected/Green): `#E8F5E9` (Verde chiarissimo).
    - Card 2 (Yellow): `#FFF9C4` (Giallo chiarissimo).
    - Card 3+ (Default): `#FFFFFF` con bordo sottile.
    - Info Banner: `#FDF5E6`.
    - Testi: Grigio scuro/Nero per i titoli, grigio medio per i dettagli.
- **Spaziature**: Margini interni al modal di `24px`. Gap tra le card di `16px`.
- **Border-radius**: `32px` per il modal, `20px` per le card.

## 2. Architettura dei Componenti (Regola 3+3)
La vista sfrutta la modularità per gestire l'overlay e la lista:
- **Prefisso Radice**: `.c-alt`
- **Mappa Componenti**:
    - `.c-alt__overlay`: Lo sfondo oscurato.
    - `.c-alt__sheet`: Il pannello bianco principale.
    - `.c-alt__header`: Titolo e chiusura.
    - `.c-alt__list`: Container della lista.
    - `.c-alt__card`: La singola scheda alternativa (basata su un'estensione di **ListTile**).
    - `.c-alt__info`: Il banner informativo finale.

## 3. Logica e Gestione Dati
- **Dati Dinamici**:
    - Ingrediente originale (per mostrare lo sfondo).
    - Array di oggetti `alternatives` (nome, kcal, macro, img, colore_bg).
- **Integrazione**:
    - Riuso della logica di caricamento script per mostrare il modal sopra `current-meal`.
    - Evento di chiusura per tornare alla vista precedente.
    - Evento di selezione per sostituire l'ingrediente.

## 4. Roadmap di Implementazione

- **Step 1: Scaffolding & Modal Root**
    - [ ] Creazione struttura HTML con overlay e sheet.
    - [ ] CSS per il posizionamento "fixed" e angoli arrotondati.
- **Step 2: Sheet Header & Info Banner**
    - [ ] Implementazione testata del modal e banner beige in fondo.
- **Step 3: Alternative Card (Rich ListTile)**
    - [ ] Creazione del layout della card con 3 righe di testo e pulsante azione.
- **Step 4: Rendering & Logic**
    - [ ] Mapping dei dati delle alternative.
    - [ ] Funzione di chiusura modal.
- **Step 5: Integration**
    - [ ] Collegamento dal pulsante "Alternative disponibili" di `current-meal`.

### Checklist di Avanzamento
- [x] Step 1: Scaffolding & Modal Root
- [x] Step 2: Sheet Header & Info Banner
- [x] Step 3: Alternative Card
- [x] Step 4: Rendering & Logic
- [x] Step 5: Integration
