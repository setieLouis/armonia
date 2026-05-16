/**
 * calendar.js: Componente Calendario dinamico che usa ListTile per l'header
 */

async function initCalendar(container) {
    // 1. Assicuriamoci che ListTile sia caricato
    if (typeof window.renderListTile !== 'function') {
        await loadScript('components/list-tile/list-tile.js');
    }
    window.injectListTileStyles();

    // 2. Dati (Mockup)
    const dateData = {
        dayName: 'Lunedì',
        dateFull: '12 Maggio'
    };

    const days = [
        { label: 'Dom', number: 11, active: false },
        { label: 'Lun', number: 12, active: true },
        { label: 'Mar', number: 13, active: false },
        { label: 'Mer', number: 14, active: false },
        { label: 'Gio', number: 15, active: false },
        { label: 'Ven', number: 16, active: false },
        { label: 'Sab', number: 17, active: false },
    ];

    // 3. Helper per renderizzare il singolo giorno (atomo simile a ListTile)
    function renderCalendarDay(day) {
        return `
            <div class="calendar-day ${day.active ? 'active' : ''}">
                <span class="day-label">${day.label}</span>
                <span class="day-number">${day.number}</span>
            </div>
        `;
    }

    // 4. Render principale
    const headerRoot = container.querySelector('#calendar-header-root');
    const daysRoot = container.querySelector('#calendar-days-root');

    if (headerRoot) {
        headerRoot.innerHTML = window.renderListTile({
            title: dateData.dayName,
            subtitle: dateData.dateFull,
            variant: 'header',
            trailing: `
                <div class="calendar-icon-box" style="padding-bottom: 5px;">
                    <svg class="icon-calendar" width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#333" stroke-width="2"/>
                        <path d="M16 2V6M8 2V6M3 10H21" stroke="#333" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
            `
        });
    }

    if (daysRoot) {
        daysRoot.innerHTML = days.map(day => renderCalendarDay(day)).join('');
    }
}

window.initCalendar = initCalendar;
