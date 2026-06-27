# Analisi Tecnica: Vista Account

## 1. Obiettivo & Analisi Visiva
- **Obiettivo**: Visualizzare le informazioni tecniche e personali dell'utente (Nome, UID, Token FCM).
- **Componenti**:
    - Header con tasto "Back" (freccia) e titolo "Profilo".
    - Sezione "Informazioni Personali" (Nome).
    - Sezione "Dati Tecnici" (UID, FCM Token).
- **Design Tokens**: 
    - Sfondo: `#FBFBFB` (coerente con Today).
    - Card: Bianco con ombra leggera.
    - Testi: Marrone (`#9C744D`) per titoli, Nero/Grigio per i valori.

## 2. Architettura dei Componenti (Regola 3+3)
- **Prefisso**: `.acc` (Account)
- **File**:
    - `components/account/account.html`
    - `components/account/account.js`
    - `components/account/account.css`
    - `components/account/analisi.md`

## 3. Logica e Gestione Dati
- **Sorgente**: `localDB.getUserData('profile')`.
- **Dati**:
    - `profile.name`
    - `profile.uid`
    - `profile.fcmToken`
- **Azioni**:
    - Copia UID/Token negli appunti (opzionale, ma utile).

## 4. Roadmap di Implementazione
- **Step 1**: Registrazione della rotta in `script.js`.
- **Step 2**: Creazione HTML con placeholder per Header e Contenuto.
- **Step 3**: Implementazione logica JS per recupero dati e render.
- **Step 4**: Styling CSS coerente con il brand.
- **Step 5**: Test di navigazione da/verso la vista Today.
