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
        console.log("Stato permesso notifiche:", permission);
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
                    tag: 'water-reminder', // Previene duplicati
                    renotify: true,
                    actions: [
                        { action: 'drink', title: 'Ho bevuto 💧' },
                        { action: 'snooze', title: 'Tra 15 min ⏳' }
                    ],
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

    /**
     * Avvia il monitoraggio per l'acqua
     */
    async startWaterReminder() {
        console.log("Servizio Water Reminder avviato...");
        
        // Controlla ogni minuto
        setInterval(async () => {
            await this.checkAndNotifyWater();
        }, 60000);

        // Primo controllo immediato
        this.checkAndNotifyWater();
    },

    /**
     * Controlla se è ora di bere
     */
    async checkAndNotifyWater() {
        if (!window.localDB) return;

        const settings = await window.localDB.getUserData('water_settings') || { 
            enabled: true, 
            frequency: 120, // minuti (2 ore)
            startTime: "08:00",
            endTime: "22:00"
        };

        if (!settings.enabled) return;

        // Controlla se c'è uno snooze attivo
        if (settings.snoozeUntil && Date.now() < settings.snoozeUntil) {
            return;
        }

        // Controlla la finestra temporale
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        if (currentTime < settings.startTime || currentTime > settings.endTime) {
            return;
        }

        const today = now.toISOString().split('T')[0];
        const data = await window.localDB.getWaterIntake(today);

        // Se ha già raggiunto l'obiettivo, non disturbare più
        if (data.amount >= data.goal) return;

        // Se non ha mai bevuto oggi, o l'ultima volta era più di 'frequency' minuti fa
        const lastTime = data.lastUpdated || 0;
        const diffMinutes = Math.floor((Date.now() - lastTime) / 60000);

        if (diffMinutes >= settings.frequency) {
            this.sendNotification(
                "Promemoria Acqua 💧",
                "È ora di bere un sorso d'acqua per restare idratata!"
            );
        }
    }
};

// Esponiamo il servizio globalmente
window.notificationService = NotificationService;
