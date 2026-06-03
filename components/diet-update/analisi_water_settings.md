# Analisi Tecnica: Configurazione Idratazione (Settings)

## 1. Obiettivo & Analisi Visiva
- **Riferimento**: Estensione della vista `diet-update` o nuova vista dedicata.
- **Componenti**:
    - Toggle per attivare/disattivare le notifiche.
    - Input numerico per l'obiettivo giornaliero (ml).
    - Slider o select per la frequenza (minuti).
    - Time pickers per la finestra temporale (Inizio/Fine).
- **Design Tokens**: Coerenza con `style.css` (marrone per testi, azzurro per acqua).

## 2. Architettura dei Componenti (Regola 3+3)
- **Prefisso**: `.wset` (Water Settings)
- **File**:
    - `components/diet-update/diet-update.html` (Aggiornamento esistente)
    - `components/diet-update/diet-update.js` (Aggiornamento esistente)

## 3. Logica e Gestione Dati
- **Stato Iniziale**: Recupero `water_settings` da `local_db.js`.
- **Salvataggio**: `window.localDB.saveWaterSettings(newSettings)`.
- **Reattività**: Al salvataggio, il `notificationService` rileverà automaticamente i nuovi parametri al prossimo controllo.

## 4. Roadmap di Implementazione
- **Step 1**: Modifica HTML per includere la sezione "Idratazione".
- **Step 2**: Implementazione logica di caricamento/salvataggio in JS.
- **Step 3**: Feedback visivo (Toast o Alert) al salvataggio riuscito.
- **Step 4**: Test di integrazione con il servizio di notifica.
