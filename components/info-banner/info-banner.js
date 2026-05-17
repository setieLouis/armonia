/**
 * InfoBanner.js: Un componente riutilizzabile per messaggi informativi o alert
 */

function renderInfoBanner(props) {
    const {
        icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
        message = '',
        variant = 'info' // 'info', 'warning', 'success'
    } = props;

    return `
        <div class="info-banner info-banner--${variant}">
            <div class="info-banner__icon">
                ${icon}
            </div>
            <p class="info-banner__text">
                ${message}
            </p>
        </div>
    `;
}

const infoBannerStyles = `
    <style id="info-banner-styles">
        .info-banner {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 20px;
            border-radius: 24px;
            box-sizing: border-box;
            width: 100%;
        }

        /* Variante Info (Beige/Marrone) */
        .info-banner--info {
            background-color: #FBF3E9;
            color: #9C744D;
        }
        .info-banner--info .info-banner__icon {
            color: #9C744D;
            width: 24px;
            height: 24px;
            flex-shrink: 0;
        }
        .info-banner--info .info-banner__text {
            margin: 0;
            font-size: 14px;
            font-weight: 500;
            line-height: 1.4;
        }

        /* Altre varianti possono essere aggiunte qui */
    </style>
`;

function injectInfoBannerStyles() {
    if (!document.getElementById('info-banner-styles')) {
        document.head.insertAdjacentHTML('beforeend', infoBannerStyles);
    }
}

// Esposizione globale
window.renderInfoBanner = renderInfoBanner;
window.injectInfoBannerStyles = injectInfoBannerStyles;
