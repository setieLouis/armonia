/**
 * header.js: Componente Header con approccio "Render" (stile React)
 */

const defaultImg = `<svg class="icon-menu" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H20" stroke="#719b6e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`

function initHeader(container,input = {left:undefined,right : defaultImg, onRightClick: null  }) {
    // 1. Lo "Stato" del componente
    let state = {
        left: input.left !== undefined ? input.left : "",
        right: input.right !== undefined ? input.right : defaultImg,
        onRightClick: input.onRightClick || null
    };

    // 2. La funzione Render (Template Literals)
    function render() {
        container.innerHTML = `
            <div class="tod-hea header-container">
                <div class="status-bar-spacer"></div>
                <div class="greeting-row">
                    <span class="greeting-text">${state.left}</span>
                    <div class="icon-container" id="header-right-icon" style="cursor: pointer;">
                        ${state.right}
                    </div>
                </div>
            </div>

            <style>
                .tod-hea .status-bar-spacer {
                    height: 20px;
                }
                .tod-hea.header-container {
                    padding: 20px 24px 10px;
                }
                .tod-hea .greeting-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .tod-hea .greeting-text {
                    font-size: 19px;
                    font-weight: 500;
                    color: #333;
                }
            </style>
        `;

        // Aggiunta listener per il click
        const iconBtn = container.querySelector('#header-right-icon');
        if (iconBtn) {
            iconBtn.onclick = () => {
                if (state.onRightClick) {
                    state.onRightClick();
                } else if (window.openMenu) {
                    window.openMenu();
                }
            };
        }
    }

    // 3. Funzione per aggiornare lo stato (simile a setState)
    window.updateHeader = function(newState) {
        state = { ...state, ...newState };
        render(); // Re-render automatico al cambio di stato
    };

    // Render iniziale
    render();
}

// Esponiamo la funzione di inizializzazione
window.initHeader = initHeader;
