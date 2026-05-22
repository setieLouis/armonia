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
        let content = '';
        
        if (meals.length === 0) {
            content = `
                <div class="no-meals-state" style="padding: 30px 0; text-align: center; color: #888;">
                    <div style="font-size: 40px; margin-bottom: 10px; opacity: 0.5;">🥗</div>
                    <p style="font-size: 14px;">Nessun pasto pianificato per oggi.</p>
                </div>
            `;
        } else {
            content = `
                <div class="meals-list">
                    ${meals.map(meal => {
                        const icon = getIcon(meal.label);
                        const completedCount = countUsed(meal.dishes);
                        const totalCount = meal.dishes.length;
                        
                        let status = 'empty';
                        if (completedCount === totalCount) status = 'checked';
                        else if (completedCount > 0) status = 'partial';

                        return window.renderListTile({
                            leading: icon.icon,
                            title: meal.label,
                            subtitle: `${completedCount} / ${totalCount} completati`,
                            trailing: `<div onclick="toggleMealConsumption('${meal.id}', event)" class="status-toggle">${statusIcons[status]}</div>`,
                            bgClass: icon.bgClass,
                            onClick: `navigateTo('current-meal', { mealId: '${meal.id}', dateId: '${window.dataService.currentDay}' })`
                        })
                    }).join('')}
                </div>
            `;
        }

        container.innerHTML = `
            <div class="tod-mea meals-container">
                <h3 class="meals-title">Pasti della giornata</h3>
                ${content}
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
                .status-toggle {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }
                .status-toggle:active {
                    transform: scale(0.9);
                }
                .meal-icon-box {
                    width: 48px;
                    height: 48px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                }
                /* Icon Backgrounds */
                .tod-mea .bg-sun { background-color: #fff9ed; }
                .tod-mea .bg-apple { background-color: #fef1f0; }
                .tod-mea .bg-bowl { background-color: #fff3eb; }
                .tod-mea .bg-moon { background-color: #f3f7fb; }
            </style>
        `;
    }

    // Funzione globale per il toggle (esposta per l'onclick inline)
    window.toggleMealConsumption = function(mealId, event) {
        if (event) event.stopPropagation();
        window.dataService.toggleMealStatus(mealId);
    };

    // Esponiamo aggiornamento
    window.updateMeals = function(newData) {
        meals = newData;
        render();
    };

    render();
}

window.initMeals = initMeals;
