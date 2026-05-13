# Pianificazione Implementazione Mockup "Meal" (Dettaglio Pasto)

## Obiettivo
Implementare la vista di dettaglio di un singolo pasto partendo dal mockup `terza.png`. La vista deve permettere all'utente di visualizzare le informazioni nutrizionali e gli ingredienti del pasto selezionato.

## Analisi Visiva e Strutturale (terza.png)
In base alla struttura tipica di un'app di benessere (Wellness/Nutrition):
1. **Header**: 
   - Pulsante di ritorno (Back).
   - Titolo del pasto (es. "Salmone con Asparagi").
   - Icona per opzioni o condivisione.
2. **Hero Section (Immagine)**:
   - Grande immagine del pasto preparato.
   - Overlay o tag con le calorie totali (es. "450 kcal").
3. **Macro-nutrienti (Info)**:
   - Sezione con icone o grafici per Proteine, Carboidrati e Grassi.
4. **Ingredienti / Istruzioni**:
   - Lista degli ingredienti con quantità.
   - (Opzionale) Passaggi per la preparazione.
5. **Azione Principale**:
   - Bottone fisso in fondo per segnare il pasto come "Completato".

## Architettura dei Componenti (Regola 3+3)
- **Radice**: `components/meal/` -> Prefisso: `.mea`
- **Sotto-componenti**:
    - `meal-header` -> `.mea-hea`
    - `meal-info` (Macro/Calorie) -> `.mea-inf`
    - `meal-ingredients` -> `.mea-ing`

## Logica e Gestione Dati
- **Dinamismo**: Il componente dovrà ricevere dati dinamici (nome, macro, immagine) per poter essere riutilizzato per diversi pasti.
- **Inizializzatore**: `meal.js` gestirà l'iniezione dei dati nel template HTML.

## Roadmap di Implementazione

### Step 1: Struttura Base (Meal Root)
- Creazione di `meal.html` con il container principale `.mea`.
- Registrazione temporanea nel caricatore per visualizzare l'anteprima.

### Step 2: Header e Immagine Hero
- Implementazione del pulsante back e del layout per l'immagine.
- Applicazione del prefisso `.mea-hea`.

### Step 3: Sezione Macro-nutrienti
- Creazione del layout per le card dei nutrienti.
- Applicazione del prefisso `.mea-inf`.

### Step 4: Lista Ingredienti
- Implementazione della lista dinamica.
- Applicazione del prefisso `.mea-ing`.

### Step 5: Integrazione e Validazione
- Collegamento della logica JS per popolare i campi.
- Verifica finale dei margini e dei colori rispetto a `terza.png`.
