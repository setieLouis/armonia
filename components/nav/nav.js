/**
 * nav.js: Orchestratore per la Bottom Navigation (Simplified)
 */

function initNav(container, activeView = 'today') {
    // Selezioniamo tutti gli item
    const navItems = container.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        const view = item.getAttribute('data-view');

        // Impostiamo lo stato attivo
        if (view === activeView) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }

        // Gestione del click
        item.onclick = (e) => {
            e.preventDefault();
            
            if (view === 'today') {
                navigateTo('today', { dateId: window.dataService.currentDay });
            } else if (view === 'piano') {
                console.log("Piano view selected");
            }
        };
    });
}

// Esponiamo la funzione globalmente
window.initNav = initNav;
