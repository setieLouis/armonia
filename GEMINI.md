## Processo di Pianificazione Nuove Viste (Mockup-to-Plan)

Prima di iniziare l'implementazione di una nuova vista o pagina partendo da un mockup (es. un file immagine), è obbligatorio creare un file di pianificazione (es. `nome_vista.md`) seguendo questo schema standard:

### Struttura del Piano Tecnico
1.  **Obiettivo & Analisi Visiva**: 
    - Identificazione del file di riferimento (es. `quarta.png`).
    - Elenco dei componenti logici (Header, List, Card, ecc.).
    - Estrazione dei Design Tokens (Colori, Spaziature, Border-radius).
2.  **Architettura dei Componenti (Regola 3+3)**:
    - Definizione del prefisso radice e della mappa dei sotto-componenti.
3.  **Logica e Gestione Dati**:
    - Distinzione tra elementi statici e dinamici (che richiedono file `.js`).
4.  **Roadmap di Implementazione**:
    - **Step 1 (Scaffolding & Root)**: 
        - Creazione immediata della cartella e dei file core: `[nome].html`, `[nome].js`, e `analisi.md`.
        - Definizione del container radice nel file HTML con la classe del prefisso (es. `.mea`).
        - Registrazione dello script orchestratore.
    - **Step 2...N**: Implementazione dei sotto-componenti (HTML + CSS isolato + JS).
    - **Step Finale**: Inserire una checklist di riepilogo per monitorare l'avanzamento di tutti gli step definiti nella Roadmap.

---