# Analisi Tecnica: Dettaglio Pasto (current-meal)

## 1. Obiettivo & Analisi Visiva
L'obiettivo è implementare la vista di dettaglio di un singolo pasto (es. "Pranzo") basandosi sul mockup `terza.png`.

### Componenti Logici:
1.  **Header**: Pulsante Back, Titolo centrato, Pulsante Info.
2.  **Hero Section**: Immagine del piatto con overlay del nome.
3.  **Nutrition Summary**: Chip per Calorie e Macro-nutrienti.
4.  **Lista Alimenti**: Lista verticale di ingredienti con ListTile.
5.  **Action Bar**: Pulsante "Completa Pasto".

### Design Tokens:
- Colori: `#F9F9F9` (BG), `#8DA67D` (Verde).
- Spaziature: `24px`.
- Border-radius: `24px`.

## 2. Architettura dei Componenti (Regola 3+3)
- **Prefisso Radice**: `.cur-mea`
- **Mappa Componenti**: Header (ListTile), Hero, Stats, IngredientList (ListTile).

## 3. Logica e Gestione Dati
- Dati dinamici: Oggetto `meal` con ingredienti.
- Riuso: Componente globale `ListTile`.

## 4. Roadmap di Implementazione

- **Step 1: Scaffolding**
    - [ ] Creazione cartella e file base (HTML, JS, CSS).
- **Step 2: Header & Root**
    - [ ] Struttura HTML base.
    - [ ] Implementazione header con ListTile (variante nav).
- **Step 3: Hero & Stats**
    - [ ] Inserimento immagine e overlay.
    - [ ] Rendering dei macro-nutrienti.
- **Step 4: Ingredient List**
    - [ ] Rendering dinamico degli ingredienti con ListTile.
- **Step 5: Action Bar & Polish**
    - [ ] Pulsante di completamento.
    - [ ] Rifinitura CSS.

### Checklist di Avanzamento
- [ ] Step 1: Scaffolding
- [ ] Step 2: Header & Root
- [ ] Step 3: Hero & Stats
- [ ] Step 4: Ingredient List
- [ ] Step 5: Action Bar & Polish
