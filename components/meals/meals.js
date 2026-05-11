function initMeals(container) {
    const listElement = container.querySelector('#meals-list');
    
    const meals = [
        { name: 'Colazione', count: '3 / 3 completati', icon: '☀️', bgClass: 'bg-sun', status: 'checked' },
        { name: 'Spuntino', count: '2 / 2 completati', icon: '🍎', bgClass: 'bg-apple', status: 'checked' },
        { name: 'Pranzo', count: '3 / 4 completati', icon: '🥗', bgClass: 'bg-bowl', status: 'partial' },
        { name: 'Cena', count: '0 / 4 completati', icon: '🌙', bgClass: 'bg-moon', status: 'empty' }
    ];

    const statusIcons = {
        checked: `<svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary-green)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
        partial: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" stroke-width="3"><circle cx="12" cy="12" r="9" stroke-dasharray="42 56" stroke-linecap="round"/></svg>`,
        empty: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`
    };

    listElement.innerHTML = meals.map(meal => `
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
