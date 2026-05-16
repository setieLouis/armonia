/**
 * ListTile.js: Un componente riutilizzabile per righe di liste (stile Material/Flutter)
 * Basato sul design del meal-card.
 */

function renderListTile(props) {
    const {
        leading = '',    // Icona o elemento a sinistra
        title = '',      // Titolo principale
        subtitle = '',   // Sottotitolo o contatore
        trailing = '',   // Elemento a destra (es. status icon)
        bgClass = '',    // Classe per il background del leading
        onClick = ''     // Azione al click
    } = props;

    return `
        <div class="list-tile" ${onClick ? `onclick="${onClick}"` : ''}>
            <div class="list-tile-leading ${bgClass}">
                ${leading}
            </div>
            <div class="list-tile-content">
                <h4 class="list-tile-title">${title}</h4>
                <p class="list-tile-subtitle">${subtitle}</p>
            </div>
            <div class="list-tile-trailing">
                ${trailing}
            </div>
        </div>
    `;
}

// Stili condivisi per il ListTile (iniettati una sola volta o inclusi nel render)
const listTileStyles = `
    <style id="list-tile-styles">
        .list-tile {
            background: #fff;
            border-radius: 20px;
            padding: 18px;
            display: flex;
            align-items: center;
            margin-bottom: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.02);
            cursor: pointer;
            transition: transform 0.1s ease;
        }
        .list-tile:active {
            transform: scale(0.98);
        }
        .list-tile-leading {
            width: 48px;
            height: 48px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin-right: 16px;
        }
        .list-tile-content {
            flex: 1;
        }
        .list-tile-title {
            font-size: 17px;
            font-weight: 600;
            margin: 0;
            color: #111;
        }
        .list-tile-subtitle {
            font-size: 14px;
            color: #888;
            margin: 4px 0 0 0;
        }
        .list-tile-trailing {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 26px;
            height: 26px;
        }

        /* Backgrounds predifiniti per il leading */
        .bg-sun { background-color: #fff9ed; }
        .bg-apple { background-color: #fef1f0; }
        .bg-bowl { background-color: #fff3eb; }
        .bg-moon { background-color: #f3f7fb; }
    </style>
`;

// Funzione per assicurarsi che gli stili siano presenti nel DOM
function injectListTileStyles() {
    if (!document.getElementById('list-tile-styles')) {
        document.head.insertAdjacentHTML('beforeend', listTileStyles);
    }
}

// Esponiamo le funzioni
window.renderListTile = renderListTile;
window.injectListTileStyles = injectListTileStyles;
