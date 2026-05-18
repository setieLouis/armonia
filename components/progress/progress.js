/**
 * progress.js: Componente per la barra di progresso giornaliera
 */

function getProgressColors(percentage) {
    // Interpolazione lineare dell'Hue (Tonalità)
    // Da 45 (Giallo/Oro) a 115 (Verde Armonia)
    const hue = 45 + (percentage * (115 - 45) / 100);
    
    // Interpolazione saturazione (da vivace 60% a soft 25%)
    const sat = 60 - (percentage * (60 - 25) / 100);
    
    // Interpolazione luminosità (da 60% a 52%)
    const light = 60 - (percentage * (60 - 52) / 100);

    return {
        main: `hsl(${hue}, ${sat}%, ${light}%)`,
        light: `hsl(${hue}, ${sat}%, 95%)`,
        track: `hsl(${hue}, ${sat}%, 90%)`
    };
}

function renderProgress(container, data) {
    const { label, percentage, message } = data;
    const colors = getProgressColors(percentage);

    container.innerHTML = `
        <div class="tod-pro progress-card" style="background: ${colors.light};">
            <div class="progress-header">
                <span>${label}</span>
                <span class="percentage" style="color: ${colors.main};">${percentage}%</span>
            </div>
            <div class="progress-bar-container" style="background: ${colors.track};">
                <div class="progress-bar-fill" style="width: ${percentage}%; background: ${colors.main};"></div>
            </div>
            <p class="progress-message">${message}</p>
        </div>

        <style>
            .tod-pro.progress-card {
                margin: 24px;
                border-radius: 20px;
                padding: 20px;
                transition: background 0.5s ease;
            }

            .tod-pro .progress-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }

            .tod-pro .progress-header span {
                font-size: 14px;
                font-weight: 500;
                color: #555;
            }

            .tod-pro .progress-header .percentage {
                font-size: 24px;
                font-weight: 600;
                transition: color 0.5s ease;
            }

            .tod-pro .progress-bar-container {
                height: 10px;
                border-radius: 5px;
                margin-bottom: 12px;
                overflow: hidden;
                transition: background 0.5s ease;
            }

            .tod-pro .progress-bar-fill {
                height: 100%;
                border-radius: 5px;
                transition: width 0.5s ease-out, background 0.5s ease;
            }

            .tod-pro .progress-message {
                margin: 0;
                font-size: 13px;
                font-weight: 500;
                color: #444;
            }
        </style>
    `;
}

window.initProgress = function(container, data) {
    renderProgress(container, data);
    
    // Esponiamo una funzione di aggiornamento globale
    window.updateProgress = function(newData) {
        renderProgress(container, newData);
    };
};
