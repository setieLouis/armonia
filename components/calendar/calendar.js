/**
 * calendar.js: Componente Calendario autonomo.
 * Riceve una data e genera automaticamente la settimana e i metadati.
 */

async function initCalendar(container, targetDateInput = null) {
    // 1. Assicuriamoci che ListTile sia caricato
    if (typeof window.renderListTile !== 'function') {
        await loadScript('components/list-tile/list-tile.js');
    }
    window.injectListTileStyles();

    // 2. Elaborazione Date (Logica interna autonoma)
    const targetDate = targetDateInput ? new Date(targetDateInput) : new Date();
    
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    const fullDayNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

    // Dati per l'Header
    const dateData = {
        dayName: fullDayNames[targetDate.getDay()],
        dateFull: `${targetDate.getDate()} ${months[targetDate.getMonth()]}`
    };

    // Generazione della riga settimanale
    const days = [];
    const startOfWeek = new Date(targetDate);
    // Portiamo alla domenica precedente (inizio settimana)
    startOfWeek.setDate(targetDate.getDate() - targetDate.getDay());

    for (let i = 0; i < 7; i++) {
        const current = new Date(startOfWeek);
        current.setDate(startOfWeek.getDate() + i);
        
        days.push({
            label: dayNames[current.getDay()],
            number: current.getDate(),
            dateId: current.toISOString().split('T')[0],
            active: current.toDateString() === targetDate.toDateString()
        });
    }

    // 3. Helper per renderizzare il singolo giorno
    function renderCalendarDay(day) {
        return `
            <div class="calendar-day ${day.active ? 'active' : ''}" 
                 onclick="console.log('Day selected:', '${day.dateId}'); navigateTo('today', { dateId: '${day.dateId}' })"
                 style="cursor: pointer;">
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
