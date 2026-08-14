/**
 * service/notification_service.js
 * Gestisce le notifiche locali e i permessi del browser.
 */

const NotificationService = {
    /**
     * Controlla se le notifiche sono supportate e se il permesso è già concesso
     */
    async checkPermission() {
        if (!("Notification" in window)) {
            console.warn("Questo browser non supporta le notifiche desktop");
            return 'unsupported';
        }
        return Notification.permission;
    },

    /**
     * Richiede il permesso all'utente per inviare notifiche
     */
    async requestPermission() {
        if (!("Notification" in window)) return 'unsupported';
        
        const permission = await Notification.requestPermission();
        console.log("Stato permesso notifiche richiesto:", permission);
        
        return permission;
    },

    /**
     * Invia una notifica tramite il Service Worker (più affidabile per PWA)
     */
    async sendNotification(title, body, icon = '/leaf.png') {
        const permission = await this.checkPermission();
        
        if (permission !== 'granted') {
            console.warn("Permesso notifiche non concesso. Stato:", permission);
            return false;
        }

        // Se abbiamo un Service Worker attivo, usiamolo per la notifica
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            if (registration) {
                registration.showNotification(title, {
                    body: body,
                    icon: icon,
                    badge: icon,
                    vibrate: [200, 100, 200],
                    renotify: true,
                    data: {
                        url: window.location.origin + '?view=today'
                    }
                });
                return true;
            }
        }

        // Fallback alla notifica standard se il SW non è pronto
        new Notification(title, { body, icon });
        return true;
    },



};

// Esponiamo il servizio globalmente
window.notificationService = NotificationService;
