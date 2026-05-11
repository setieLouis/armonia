function initMeals(container, data) {
    const listContainer = container.querySelector('#meals-list-container');
    
    const mealsData = [
        { title: 'Colazione', count: '3 / 3 completati', icon: '☀️', iconClass: 'icon-sun', status: 'checked' },
        { title: 'Spuntino', count: '2 / 2 completati', icon: '🍎', iconClass: 'icon-apple', status: 'checked' },
        { title: 'Pranzo', count: '3 / 4 completati', icon: '🥗', iconClass: 'icon-bowl', status: 'partial' },
        { title: 'Cena', count: '0 / 4 completati', icon: '🌙', iconClass: 'icon-moon', status: 'empty' }
    ];

    const statusIcons = {
        checked: `<svg viewBox="0 0 24 24" fill="var(--primary-green)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
        partial: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" stroke-width="3"><circle cx="12" cy="12" r="9" stroke-dasharray="42 56" stroke-linecap="round"/></svg>`,
        empty: `<svg viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`
    };

    listContainer.innerHTML = mealsData.map(meal => `
        <div class="meal-card">
            <div class="meal-icon ${meal.iconClass}">${meal.icon}</div>
            <div class="meal-info">
                <h4>${meal.title}</h4>
                <p>${meal.count}</p>
            </div>
            <div class="status-icon">
                ${statusIcons[meal.status]}
            </div>
        </div>
    `).join('');
}

window.initMeals = initMeals;
