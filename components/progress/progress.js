/**
 * progress.js: Componente per la barra di progresso giornaliera
 */

function renderProgress(container, data) {
    const { label, percentage, message } = data;

    container.innerHTML = `
        <div class="tod-pro progress-card">
            <div class="progress-header">
                <span>${label}</span>
                <span class="percentage">${percentage}%</span>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${percentage}%;"></div>
            </div>
            <p class="progress-message">${message}</p>
        </div>

        <style>
            .tod-pro.progress-card {
                background: var(--primary-green-light);
                margin: 24px;
                border-radius: 20px;
                padding: 20px;
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
            }

            .tod-pro .progress-header .percentage {
                font-size: 24px;
                font-weight: 400;
            }

            .tod-pro .progress-bar-container {
                height: 8px;
                background: rgba(113, 155, 110, 0.2);
                border-radius: 4px;
                margin-bottom: 12px;
                overflow: hidden;
            }

            .tod-pro .progress-bar-fill {
                height: 100%;
                background: var(--primary-green);
                border-radius: 4px;
                transition: width 0.5s ease-out;
            }

            .tod-pro .progress-message {
                margin: 0;
                font-size: 13px;
                font-weight: 500;
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
