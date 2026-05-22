# Analisi Tecnica: Componente Calendario (calendar)

## 1. Obiettivo & Analisi Visiva
L'obiettivo è implementare un selettore di date settimanale interattivo, basato sul mockup `seconda.png`. Il componente deve permettere all'utente di visualizzare la data corrente e di navigare tra i diversi giorni della settimana per consultare i rispettivi piani alimentari.

### Componenti Logici
- **Calendar Header**: Visualizza il nome del giorno (es. "Lunedì") e la data estesa (es. "12 Maggio"). Include un'icona calendario decorativa.
- **Weekly Row**: Una riga orizzontale di 7 elementi (tessere del giorno).
- **Day Tile**: Elemento atomico che mostra l'abbreviazione del giorno (Lun, Mar...) e il numero del mese.

### Design Tokens (Stato Attivo)
- **Background**: `var(--primary-green)` (#719b6e)
- **Text Color**: `var(--white)`
- **Shadow**: Ombra morbida verde per dare profondità.

---

## 2. Stato Attuale e Lacune
Il componente `components/calendar/calendar.js` è attualmente limitato:

1. **Mancanza di Interattività**: Le tessere dei giorni non sono cliccabili. Non è possibile cambiare data dall'interfaccia.
2. **Logica Esterna**: Il calcolo dei giorni della settimana è delegato a `today.js`, rendendo il componente meno autonomo e più difficile da riutilizzare.
3. **Disallineamento Design**: Il colore "active" attuale è cablato (`#8da67d`) anziché usare i token globali, creando una leggera differenza cromatica con il resto dell'app.

---

## 3. Architettura e Gestione Dati
- **Prefisso Radice**: `.tod-cal`
- **Dati Dinamici**: 
    - `dateData`: Titolo e sottotitolo dell'header.
    - `days`: Array di oggetti `{ label, number, dateId, active }`.
- **Eventi**: Click sulla tessera del giorno -> `navigateTo('today', { dateId })`.

---

## 4. Roadmap di Implementazione

### Step 1: Interattività e Navigazione
- [ ] **1.1 Rendere le tessere dei giorni cliccabili**: Aggiungere l'evento `onclick` alle tessere in `renderCalendarDay`.
- [ ] **1.2 Gestione dello stato "attivo"**: Implementare la logica (JS) e gli stili (CSS) per evidenziare visivamente il giorno selezionato.
- [ ] **1.3 Recupero dati dal database**: Al click, utilizzare il `dateId` come chiave primaria per recuperare i pasti dal DB locale e aggiornare la vista.

### Step 2: Refactoring Design (CSS)
- [ ] Aggiornare gli stili in `calendar.html` per usare `--primary-green`.
- [ ] Migliorare il feedback visuale (active/hover) delle tessere.

### Step 3: Autonomia del Componente (JS)
- [ ] Spostare la logica di generazione della settimana da `today.js` a `calendar.js`.
- [ ] Permettere al componente di auto-generarsi partendo da una singola data di input.

---
## Checklist di Avanzamento
- [x] Analisi Tecnica e Visiva
- [ ] Step 1.1: Cliccabilità tessere
- [ ] Step 1.2: Stato attivo (JS/CSS)
- [ ] Step 1.3: Integrazione DB
- [ ] Step 2: Refactoring Design
- [ ] Step 3: Autonomia Logica
