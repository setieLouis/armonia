# Piano Tecnico: Funzionalità Switch Day (Scambio Giornate)

Questo documento descrive la pianificazione e gli step di implementazione per permettere all'utente di scambiare il menu di un giorno con quello di un altro giorno della stessa settimana tramite una pressione prolungata (long press) sul calendario.

---

## 1. Obiettivo & Analisi Visiva

L'obiettivo è abilitare un'interazione intuitiva che permetta di riorganizzare la settimana alimentare. 

### Flusso di Interazione (UX)
1. **Pressione prolungata (Long Press)** su una tessera del calendario (`.calendar-day`) per circa 600ms.
2. **Feedback visivo**: La tessera si restringe leggermente (scale 0.96) con un leggero cambio di sfondo o ombra per segnalare l'attivazione. Se supportata dal dispositivo, viene attivata una leggera vibrazione (`navigator.vibrate(50)`).
3. **Apertura del Modal**: Compare un overlay elegante con un pannello (bottom sheet) contenente:
   - Titolo: "Scambia giornata"
   - Sottotitolo descrittivo: "Scegli con quale giorno scambiare il menu di [Giorno Selezionato]"
   - Lista delle opzioni (gli altri 6 giorni della stessa settimana).
4. **Selezione e Scambio**: Cliccando su un giorno di destinazione:
   - I pasti dei due giorni vengono scambiati nel database locale.
   - Il modal si chiude.
   - La vista corrente si aggiorna immediatamente per riflettere lo scambio.

### Design Tokens del Modal (Coerenza Visiva)
- **Overlay**: Background nero con opacità al 50% (`rgba(0,0,0,0.5)`), sfocatura opzionale dello sfondo (`backdrop-filter: blur(2px)`).
- **Contenitore Bottom Sheet**: 
  - Sfondo bianco (`var(--white)`).
  - Angoli superiori arrotondati (`border-radius: 24px 24px 0 0`).
  - Animazione di comparsa dal basso (`slide-up`).
- **Tessere Giorno nel Modal**:
  - Layout simile a righe pulite o card con bordi arrotondati (`border-radius: 12px`).
  - Colori allineati: testi primari in `var(--text-main)`, hover con `var(--primary-green-light)`.
  - Icona o indicatore visivo di scambio.

---

## 2. Architettura dei Componenti

- **Prefisso Radice**: `.cal-swap`
- **Sotto-componenti & Elementi HTML** (in [calendar.html](file:///workspace/components/calendar/calendar.html)):
  - `#calendar-swap-modal`: Il contenitore principale del modal.
  - `.cal-swap__overlay`: Lo sfondo scuro che chiude il modal se cliccato.
  - `.cal-swap__sheet`: Il pannello bianco che sale dal basso.
  - `#cal-swap-options`: Il contenitore dinamico delle tessere di destinazione.

---

## 3. Logica e Gestione Dati

### Gestione del Long Press
- Rilevamento tramite eventi `mousedown`/`touchstart` combinati con un `setTimeout` a 600ms su `.calendar-day`.
- Cancellazione del timer su `mouseup`/`touchend`/`touchmove`/`mouseleave`.
- Utilizzo di un flag `isLongPressTriggered` per bloccare l'evento di click standard (navigazione) se il long press è scattato.

### Operazione di Scambio (IndexedDB)
Lo scambio avviene leggendo ed invertendo i dati in Dexie:
1. Recupero record `mealA` per `dateIdA` (giorno sorgente).
2. Recupero record `mealB` per `dateIdB` (giorno destinazione).
3. Inversione dell'array `meals` tra i due record:
   - Se un record non esiste nel DB, viene creato un oggetto pasto vuoto con la chiave `day` corrispondente.
4. Salvataggio di entrambi i record tramite `window.localDB.saveMeal()`.
5. Notifica di aggiornamento:
   - Chiamata a `window.dataService.loadData(currentDay)` per ricaricare lo stato corrente.
   - Trigger di `window.dataService.notifyListeners()` per fare in modo che `today.js` e `meals.js` aggiornino la UI in tempo reale.

---

## 4. Roadmap di Implementazione

### Step 1: Scaffolding HTML & CSS in [calendar.html](file:///workspace/components/calendar/calendar.html)
- [x] 1.1 Aggiungere la struttura HTML del modal in coda al file.
- [x] 1.2 Scrivere le regole CSS per l'overlay, il bottom sheet, l'animazione di ingresso (`slide-up`) e le tessere opzione.

### Step 2: Implementazione Long Press in [calendar.js](file:///workspace/components/calendar/calendar.js)
- [x] 2.1 Rimuovere l'attributo `onclick` inline dalle tessere in `renderCalendarDay`.
- [x] 2.2 Aggiungere la delega degli eventi (event delegation) per `mousedown`, `touchstart`, `mouseup`, `touchend`, `touchmove`, `mouseleave` sul contenitore `daysRoot`.
- [x] 2.3 Gestire la distinzione tra click normale (navigazione temporale) e long press (apertura modal).

### Step 3: Generazione Dinamica delle Opzioni nel Modal
- [x] 3.1 All'attivazione del long press, calcolare i 7 giorni della settimana correntemente visualizzata.
- [x] 3.2 Generare l'HTML delle 6 opzioni rimanenti (escludendo il giorno sorgente) inserendo etichette leggibili (es. "Martedì 19").
- [x] 3.3 (Opzionale/Rifinitura) Recuperare asincronamente dal DB i piatti principali di Pranzo e Cena per ciascun giorno per mostrarli come anteprima.

### Step 4: Logica di Scambio nel Database e Aggiornamento UI
- [x] 4.1 Implementare la funzione asincrona `swapDays(dateIdA, dateIdB)`.
- [x] 4.2 Effettuare le operazioni di lettura/scrittura su `window.localDB`.
- [x] 4.3 Gestire l'aggiornamento dello stato dell'applicazione e il refresh dei pasti visualizzati a schermo senza ricaricare la pagina web intera.

### Step 5: Test di funzionamento ed Edge Cases
- [x] 5.1 Testare l'interazione su desktop (mouse) e mobile (touch).
- [x] 5.2 Testare lo scambio quando uno dei giorni è privo di dati (primo utilizzo).
- [x] 5.3 Verificare la persistenza delle modifiche dopo il ricaricamento della pagina.

---

## 5. Checklist di Riepilogo
- [x] Step 1: Struttura e Stile Modal (HTML/CSS)
- [x] Step 2: Rilevamento Long Press
- [x] Step 3: Popolamento Dinamico Modal
- [x] Step 4: Scambio Dati & Refresh UI
- [x] Step 5: Collaudo ed Edge Cases


