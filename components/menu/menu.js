/**
 * menu.js: Logic for the Hamburger Menu Drawer
 */

function initMenu(container) {
    const overlay = document.getElementById('menu-overlay');
    const closeBtn = document.getElementById('menu-close');
    const itemsContainer = document.getElementById('menu-items-container');

    const menuItems = [
        // { label: 'Home', action: () => window.navigateTo('today') },
        { label: 'Aggiorna Dieta', action: () => window.navigateTo('diet-update') },
        { label: 'Acqua', action: () => window.navigateTo('acqua') },
        { label: 'Novità', action: () => window.navigateTo('features-info') },
        // { label: 'Profilo', action: () => console.log('Profilo click') },
    ];

    function renderItems() {
        if (!itemsContainer) return;
        itemsContainer.innerHTML = menuItems.map(item => `
            <div class="men-item" style="padding: 15px 0; border-bottom: 1px solid var(--gray-light); cursor: pointer; font-weight: 500;">
                ${item.label}
            </div>
        `).join('');

        // Aggiungiamo i listener
        const nodes = itemsContainer.querySelectorAll('.men-item');
        nodes.forEach((node, index) => {
            node.onclick = () => {
                menuItems[index].action();
                closeMenu();
            };
        });
    }

    function openMenu() {
        overlay.classList.remove('hidden');
        // Usiamo un piccolo timeout per permettere alla transizione CSS di attivarsi
        setTimeout(() => overlay.classList.add('active'), 10);
    }

    function closeMenu() {
        overlay.classList.remove('active');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }

    // Listeners
    if (closeBtn) closeBtn.onclick = closeMenu;
    if (overlay) {
        overlay.onclick = (e) => {
            if (e.target === overlay) closeMenu();
        };
    }

    // Esposizione globale per trigger dall'header
    window.openMenu = openMenu;
    window.closeMenu = closeMenu;

    renderItems();
}

window.initMenu = initMenu;
