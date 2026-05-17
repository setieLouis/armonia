/**
 * meals.js: Componente Lista Pasti refactoring per usare ListTile
 */



async function initMeals(container, initialMeals) {
    // 1. Assicuriamoci che ListTile sia caricato
    if (typeof window.renderListTile !== 'function') {
        await loadScript('components/list-tile/list-tile.js');
    }
    window.injectListTileStyles();

    let meals = initialMeals;
   

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

    function getIcon(value){
        switch(value.toLowerCase()){
            case "colazione":
                return {icon: '☀️',bgClass: 'bg-sun'}
            case "spuntino":
                return {icon: '🍎',bgClass: 'bg-apple'}
             case "pranzo":
                return {icon: '🥗',bgClass: 'bg-bowl'}
            case "merenda":
                return {icon: '🍎',bgClass: 'bg-apple'}
            case "cena":
                return {icon: '🌙' ,bgClass: 'bg-moon'} 
            default:
                return {icon: '🥗',bgClass: 'bg-bowl'}
        }
    }

    function countUsed(dishes) {
        let res = 0;
        for (let i = 0; i < dishes.length; i++) {
            res += dishes[i].use === true ? 1 : 0;
        }
        return res
    }

    // 3. Funzione di Render principale
    function render() {
        container.innerHTML = `
            <div class="tod-mea meals-container">
                <h3 class="meals-title">Pasti della giornata</h3>
                <div class="meals-list">
                    ${meals.map(meal => {
                        const icon = getIcon(meal.label);
                        return window.renderListTile({
                            leading: icon.icon,
                            title: meal.label,
                            subtitle: `${countUsed(meal.dishes)} / ${meal.dishes.length} completati`,
                            trailing: statusIcons['checked'],
                            bgClass: icon.bgClass,
                            onClick: meal.label === 'Colazione' ? `navigateTo('current-meal')` : `console.log('Clicked on ${meal.label}')`
                        })
                    }).join('')}
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
        meals = newData;
        render();
    };

    render();
}

window.initMeals = initMeals;
