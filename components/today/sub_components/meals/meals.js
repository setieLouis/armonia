function initMeals(container) {
    const listElement = container.querySelector('#meals-list');
    
    const mealsData = [
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

    listElement.innerHTML = mealsData.map(meal => `
        <div class="meal-card">
            <div class="meal-icon-box ${meal.bgClass}">${meal.icon}</div>
            <div class="meal-details">
                <h4 class="meal-name">${meal.name}</h4>
                <p class="meal-count">${meal.count}</p>
            </div>
            <div class="status-indicator">
                ${statusIcons[meal.status]}
            </div>
        </div>
    `).join('');
}

window.initMeals = initMeals;
