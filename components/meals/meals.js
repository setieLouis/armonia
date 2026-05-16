/**
 * meals.js: Componente Lista Pasti refactoring per usare ListTile
 */

async function initMeals(container) {
    // 1. Assicuriamoci che ListTile sia caricato
    if (typeof window.renderListTile !== 'function') {
        await loadScript('components/list-tile/list-tile.js');
    }
    window.injectListTileStyles();

    // 2. Stato/Dati (da passare poi esternamente)
    let mealsData = [
        { name: 'Colazione', count: '3 / 3 completati', icon: '☀️', bgClass: 'bg-sun', status: 'checked' },
        { name: 'Spuntino', count: '2 / 2 completati', icon: '🍎', bgClass: 'bg-apple', status: 'checked' },
        { name: 'Pranzo', count: '3 / 4 completati', icon: '🥗', bgClass: 'bg-bowl', status: 'partial' },
        { name: 'Cena', count: '0 / 4 completati', icon: '🌙', bgClass: 'bg-moon', status: 'empty' }
    ];

    const statusIcons = {
        checked: `
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#8da67d"/>
                <path d="M8 12L11 15L16 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
        partial: `
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#f29c54" stroke-width="2" stroke-dasharray="40 62" stroke-linecap="round"/>
            </svg>`,
        empty: `
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#ddd" stroke-width="2"/>
            </svg>`
    };

    // 3. Funzione di Render principale
    function render() {
        container.innerHTML = `
            <div class="tod-mea meals-container">
                <h3 class="meals-title">Pasti della giornata</h3>
                <div class="meals-list">
                    ${mealsData.map(meal => window.renderListTile({
                        leading: meal.icon,
                        title: meal.name,
                        subtitle: meal.count,
                        trailing: statusIcons[meal.status],
                        bgClass: meal.bgClass,
                        onClick: `console.log('Clicked on ${meal.name}')`
                    })).join('')}
                </div>
            </div>

            <style>
                .tod-mea.meals-container {
                    padding: 0 24px;
                    margin-top: 10px;
                }
                .tod-mea .meals-title {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 20px;
                    color: #333;
                }
            </style>
        `;
    }

    // Esponiamo aggiornamento
    window.updateMeals = function(newData) {
        mealsData = newData;
        render();
    };

    render();
}

window.initMeals = initMeals;
