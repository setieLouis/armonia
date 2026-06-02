# Armonia Flow

Benessere e Armonia nella tua alimentazione quotidiana.

Armonia Flow è un'applicazione web (PWA) progettata per aiutare gli utenti a gestire la propria alimentazione quotidiana in modo armonioso e consapevole. Offre una gestione dei pasti personalizzata, suggerimenti per alternative agli ingredienti e un'interfaccia utente curata e rilassante.

## 🚀 Caratteristiche Principali

- **Progressive Web App (PWA)**: Installabile su dispositivi mobile e desktop per un'esperienza simile a un'app nativa, con supporto offline.
- **Gestione Pasti**: Visualizzazione e gestione dei pasti giornalieri.
- **Database Locale**: Utilizzo di [Dexie.js](https://dexie.org/) per la persistenza dei dati sul dispositivo dell'utente.
- **Architettura a Componenti**: Interfaccia modulare costruita con componenti HTML/JS/CSS caricati dinamicamente.
- **Design Curato**: Estetica ispirata alla natura e al benessere, con font Cinzel e palette di colori rilassanti.

## 🛠️ Tecnologie Utilizzate

- **Frontend**: HTML5, Vanilla CSS, Vanilla JavaScript (ES6+).
- **Database**: Dexie.js (wrapper IndexedDB).
- **PWA**: Service Workers, Web App Manifest.
- **Utilities**: `pdf-parse` (per l'estrazione di dati da PDF).

## 📂 Struttura del Progetto

- `components/`: Componenti UI riutilizzabili (Header, ListTile, InfoBanner, ecc.).
- `service/`: Servizi per la gestione dei dati, emoji e database locale.
- `ui/`: Risorse grafiche, icone e mockup di design.
- `pwa/`: Asset specifici per la Progressive Web App.
- `parser.js`: Script per il parsing di dati (es. menu da file PDF).

## 🔧 Installazione e Sviluppo

Il progetto è una Single Page Application (SPA) statica. Può essere servito da qualsiasi server web.

1. Clona il repository:
   ```bash
   git clone <repository-url>
   ```
2. Installa le dipendenze (necessarie per il parsing PDF o strumenti CLI):
   ```bash
   npm install
   ```
3. Avvia un server locale (es. utilizzando l'estensione "Live Server" di VS Code o `npx serve .`).

## 📜 Linee Guida di Sviluppo

Per mantenere la coerenza del progetto, seguire le linee guida definite in `GEMINI.md`:
- Utilizzare i componenti "Plug-and-Play" (ListTile, Header, InfoBanner).
- Seguire il processo "Mockup-to-Plan" per la creazione di nuove viste.
- Mantenere lo stile CSS isolato all'interno delle cartelle dei componenti.

---

*Sviluppato con ❤️ per il benessere quotidiano.*
