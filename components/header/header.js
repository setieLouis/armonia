/**
 * header.js: Componente Header con approccio "Render" (stile React)
 */

const defaultImg = `<svg class="icon-menu" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H20" stroke="#719b6e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`

function initHeader(container,input = {left:undefined, center: undefined, right : defaultImg, onRightClick: null, onLeftClick: null  }) {
    // 1. Lo "Stato" del componente
    let state = {
        left: input.left !== undefined ? input.left : "",
        center: input.center !== undefined ? input.center : "",
        right: input.right !== undefined ? input.right : defaultImg,
        onRightClick: input.onRightClick || null,
        onLeftClick: input.onLeftClick || null
    };

    // 2. La funzione Render (Template Literals)
    function render() {
        container.innerHTML = `
            <div class="tod-hea header-container">
                <div class="status-bar-spacer"></div>
                <div class="header-row">
                    <div class="header-slot header-slot--left" id="header-left-slot">
                        <span class="greeting-text">${state.left}</span>
                    </div>
                    <div class="header-slot header-slot--center">
                        <span class="header-title">${state.center}</span>
                    </div>
                    <div class="header-slot header-slot--right" id="header-right-slot">
                        <div class="icon-container" style="cursor: pointer;">
                            ${state.right}
                        </div>
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
                .tod-hea .header-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .tod-hea .header-slot {
                    display: flex;
                    align-items: center;
                    min-height: 24px;
                }
                .tod-hea .header-slot--left { flex: 1; justify-content: flex-start; }
                .tod-hea .header-slot--center { flex: 2; justify-content: center; }
                .tod-hea .header-slot--right { flex: 1; justify-content: flex-end; }

                .tod-hea .greeting-text, .tod-hea .header-title {
                    font-size: 19px;
                    font-weight: 500;
                    color: #333;
                    white-space: nowrap;
                }
                .tod-hea .header-title {
                    font-family: "Cinzel", serif;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    font-size: 17px;
                }
            </style>
        `;

        // Aggiunta listener per il click destro
        const rightBtn = container.querySelector('#header-right-slot');
        if (rightBtn) {
            rightBtn.onclick = () => {
                if (state.onRightClick) {
                    state.onRightClick();
                } else if (window.openMenu) {
                    window.openMenu();
                }
            };
        }

        // Aggiunta listener per il click sinistro (opzionale)
        const leftBtn = container.querySelector('#header-left-slot');
        if (leftBtn && state.onLeftClick) {
            leftBtn.style.cursor = 'pointer';
            leftBtn.onclick = state.onLeftClick;
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
