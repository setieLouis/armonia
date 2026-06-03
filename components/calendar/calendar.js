/**
 * calendar.js: Componente Calendario autonomo.
 * Riceve una data e genera automaticamente la settimana e i metadati.
 */

async function initCalendar(container, targetDateInput = null) {
    // 1. Elaborazione Date (Logica interna autonoma)
    const targetDate = targetDateInput ? new Date(targetDateInput) : new Date();
    
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

    // Generazione della riga settimanale
    const days = [];
    const dayOfWeek = targetDate.getDay();
    // Calcoliamo la differenza per arrivare al Lunedì (se è Domenica, torniamo indietro di 6 giorni)
    const diffToMonday = targetDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    
    const startOfWeek = new Date(targetDate);
    startOfWeek.setDate(diffToMonday);

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

    // 2. Helper per renderizzare il singolo giorno
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

    // 3. Render principale
    const daysRoot = container.querySelector('#calendar-days-root');

    if (daysRoot) {
        daysRoot.innerHTML = days.map(day => renderCalendarDay(day)).join('');
    }
}

window.initCalendar = initCalendar;
