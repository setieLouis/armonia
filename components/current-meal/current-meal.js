/**
 * Current Meal Component Orchestrator
 */
class CurrentMeal {
    constructor(navData = null) {
        this.navData = navData;
        this.data = {
            mealName: 'Colazione',
            items: [],
            alternatives: 5,
            icon: '☀️',
            bgClass: 'bg-sun'
        };
        this.init();
    }

    getMealIcon(label) {
        switch(label.toLowerCase()){
            case "colazione":
                return {icon: '☀️', bgClass: 'bg-sun'}
            case "spuntino mattina":
            case "spuntino":
            case "merenda":
                return {icon: '🍎', bgClass: 'bg-apple'}
            case "pranzo":
                return {icon: '🥗', bgClass: 'bg-bowl'}
            case "cena":
                return {icon: '🌙' , bgClass: 'bg-moon'} 
            default:
                return {icon: '🥗', bgClass: 'bg-bowl'}
        }
    }

    async init() {
        console.log('CurrentMeal initializing with data:', this.navData);
        
        // Load dependencies
        const deps = [];
        if (typeof window.initHeader !== 'function') {
            deps.push(loadScript('components/header/header.js'));
        }
        if (typeof window.renderListTile !== 'function') {
            deps.push(loadScript('components/list-tile/list-tile.js'));
        }
        if (typeof window.getDishIcon !== 'function') {
            deps.push(loadScript('service/emoji_service.js'));
        }
        
        await Promise.all(deps);
        window.injectListTileStyles();

        // Load data using DataService
        try {
            await window.dataService.loadData();
            
            // Find selected meal by ID from navData, or default to first meal
            let selectedMeal;
            if (this.navData && this.navData.mealId) {
                selectedMeal = window.dataService.getMealById(this.navData.mealId);
                this.currentMealId = this.navData.mealId;
            }
            
            if (!selectedMeal) {
                selectedMeal = window.dataService.getMeals()[0];
                this.currentMealId = selectedMeal.id;
            }
            
            const iconInfo = this.getMealIcon(selectedMeal.label);
            
            this.data.mealName = selectedMeal.label;
            this.data.icon = iconInfo.icon;
            this.data.bgClass = iconInfo.bgClass;
            
            // Map dishes to our local data format
            this.updateLocalItems(selectedMeal);
            
        } catch (error) {
            console.error("Errore nel caricamento dei pasti:", error);
        }

        // Global reference for event handlers
        window.currentMealApp = this;

        this.render();
        this.setupLongPress();
    }

    updateLocalItems(selectedMeal) {
        this.data.items = selectedMeal.dishes.map((dish, index) => ({
            id: index, // Use index for toggling in the service
            name: dish.name,
            quantity: dish.quantity,
            completed: dish.use
        }));
    }

    setupLongPress() {
        const listRoot = document.getElementById('c-meal-list-root');
        if (!listRoot) return;

        let timer;
        this.isLongPressTriggered = false;

        const start = (e) => {
            const tile = e.target.closest('.list-tile.variant-default');
            if (!tile) return;

            this.isLongPressTriggered = false;
            timer = setTimeout(() => {
                this.isLongPressTriggered = true;
                tile.style.transform = 'scale(0.95)';
                tile.style.backgroundColor = '#f0f0f0';
                setTimeout(() => {
                    navigateTo('ingredient');
                }, 100);
            }, 600);
        };

        const cancel = (e) => {
            clearTimeout(timer);
            const tile = e.target.closest('.list-tile.variant-default');
            if (tile && !this.isLongPressTriggered) {
                tile.style.transform = '';
                tile.style.backgroundColor = '';
            }
        };

        listRoot.addEventListener('mousedown', start);
        listRoot.addEventListener('touchstart', start, { passive: true });
        listRoot.addEventListener('mouseup', cancel);
        listRoot.addEventListener('mouseleave', cancel);
        listRoot.addEventListener('touchend', cancel);

        // Capture phase to intercept the click if long press was triggered
        listRoot.addEventListener('click', (e) => {
            if (this.isLongPressTriggered) {
                e.stopImmediatePropagation();
                e.preventDefault();
                this.isLongPressTriggered = false;
                
                // Reset visual state
                const tile = e.target.closest('.list-tile.variant-default');
                if (tile) {
                    tile.style.transform = '';
                    tile.style.backgroundColor = '';
                }
            }
        }, true);
    }

    render() {
        this.renderStep2(); // Nav & Header
        this.renderStep3(); // Food List
    }

    getProgressText() {
        const completed = this.data.items.filter(i => i.completed).length;
        const total = this.data.items.length;
        return `${completed} / ${total} completati`;
    }

    renderStep2() {
        // 1. Top Navigation (Plugging Header)
        const navRoot = document.getElementById('c-meal-nav-root');
        if (navRoot) {
            const backIcon = `<div onclick="navigateTo('today')" style="cursor: pointer; display: flex; align-items: center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </div>`;
            const moreIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`;
            
            window.initHeader(navRoot, {
                left: backIcon,
                right: moreIcon
            });
        }

        // 2. Meal Header (Plugging ListTile)
        const headerRoot = document.getElementById('c-meal-header-root');
        if (headerRoot) {
            headerRoot.innerHTML = window.renderListTile({
                leading: this.data.icon,
                title: this.data.mealName,
                subtitle: this.getProgressText(),
                variant: 'header',
                bgClass: this.data.bgClass
            });
        }
    }

    toggleItem(index) {
        if (window.dataService.toggleDishStatus(this.currentMealId, index)) {
            const selectedMeal = window.dataService.getMealById(this.currentMealId);
            this.updateLocalItems(selectedMeal);
            this.render();
        }
    }

    renderStep3() {
        const listRoot = document.getElementById('c-meal-list-root');
        if (!listRoot) return;

        const checkIcon = `
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#8da67d"/>
                <path d="M8 12L11 15L16 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
        
        const emptyCircle = `
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#ddd" stroke-width="2"/>
            </svg>`;

        listRoot.innerHTML = this.data.items.map(item => {
            const iconData = window.getDishIcon(item.name);
            return window.renderListTile({
                leading: iconData.emoji,
                bgClass: iconData.bg,
                title: item.name,
                subtitle: item.quantity,
                trailing: item.completed ? checkIcon : emptyCircle,
                onClick: `currentMealApp.toggleItem(${item.id})`
            });
        }).join('');
    }
}

// Auto-initialize
if (document.getElementById('c-meal-nav-root')) {
    new CurrentMeal();
}
window.initCurrentMeal = (data) => new CurrentMeal(data);
