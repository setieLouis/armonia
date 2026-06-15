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
        
        if (permission === 'granted') {
            // Se il permesso è stato appena concesso, proviamo a recuperare subito il token
            await this.initFCM();
        }
        
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
        
        // Inizializza anche FCM se disponibile
        this.initFCM();

        // Controlla ogni minuto
        setInterval(async () => {
            await this.checkAndNotifyWater();
        }, 60000);

        // Primo controllo immediato
        this.checkAndNotifyWater();
    },

    /**
     * Inizializza FCM: richiede permesso se necessario e ottiene il token
     */
    async initFCM() {
        try {
            if (!window.fcmMessaging) {
                console.warn("FCM Messaging non inizializzato.");
                return;
            }

            // Verifica se abbiamo già un token nel DB locale
            const currentData = await window.localDB.getUserData('fcm_token');
            if (currentData && currentData.token) {
                console.log("FCM Token già presente nel database locale.");
                return;
            }

            // Se il permesso è 'default', lo chiediamo
            const permission = await this.checkPermission();
            if (permission === 'default') {
                console.log("Richiesta permesso notifiche al primo avvio...");
                const newPermission = await this.requestPermission();
                if (newPermission !== 'granted') return;
            } else if (permission !== 'granted') {
                return;
            }

            // Otteniamo il token
            // Attendiamo che il Service Worker sia pronto e attivo
            let registration;
            if ('serviceWorker' in navigator) {
                console.log("[FCM] Attesa Service Worker ready...");
                registration = await navigator.serviceWorker.ready;
            }

            if (!registration) {
                console.error("[FCM] Service Worker non trovato o non pronto.");
                return;
            }

            console.log("[FCM] Richiesta token con VAPID Key...");
            // Otteniamo il token specificando la registrazione del SW e la VAPID Key
            const token = await window.fcmMessaging.getToken({
                serviceWorkerRegistration: registration,
                vapidKey: "BAG2jbrQz8Qj8GiDPGg5CGcLGZDf2K1xEqq6nOY-uOrpirsI8v8WNoZVG_qHh9tKW33M_myPjEZWY2tBsROXLHU"
            });

            if (token) {
                console.log("[FCM] Token ottenuto:", token);

                // 1. Salviamo il token in una entry dedicata per sicurezza
                await window.localDB.saveUserData('fcm_token', { 
                    token, 
                    updatedAt: new Date().toISOString() 
                });

                // 2. Proviamo ad aggiornare il profilo se esiste già
                const profile = await window.localDB.getUserData('profile');
                if (profile) {
                    profile.fcmToken = token;
                    profile.fcmUpdatedAt = new Date().toISOString();
                    await window.localDB.saveUserData('profile', profile);

                    // Sincronizza con Firestore
                    if (window.dataService) {
                        await window.dataService.syncUserProfile();
                    }
                }
            }
 else {
                console.warn("Nessun token FCM ricevuto. Controlla i permessi o la configurazione.");
            }
        } catch (error) {
            console.error("Errore durante l'ottenimento del token FCM:", error);
        }
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
