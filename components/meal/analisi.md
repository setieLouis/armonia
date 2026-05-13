# Analisi Tecnica Vista "Meal"

## Logica di Caricamento
La vista `meal` segue il pattern di orchestrazione definito in `script.js`. 
Viene caricata dinamicamente e può ricevere un oggetto `data` per popolare i campi (titolo, calorie, ingredienti).

## Isolamento CSS
- **Namespace Radice**: `.mea`
- Tutti i sotto-componenti useranno prefissi derivati: `.mea-hea`, `.mea-inf`, `.mea-ing`.

## Componenti Identificati
- **Header**: Navigazione e azioni rapide.
- **Hero**: Impatto visivo e info caloriche primarie.
- **Info**: Dettaglio macro-nutrienti.
- **Ingredients**: Lista dinamica basata sui dati ricevuti.
