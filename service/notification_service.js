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
     * Inizializza FCM: richiede permesso se necessario, ottiene il token corrente e lo aggiorna se variato.
     */
    async initFCM() {
        try {
            if (!window.fcmMessaging) {
                console.warn("FCM Messaging non inizializzato.");
                return;
            }

            // Controlla e gestisce lo stato dei permessi
            let permission = await this.checkPermission();
            if (permission === 'default') {
                console.log("Richiesta permesso notifiche al primo avvio...");
                permission = await this.requestPermission();
            }

            if (permission !== 'granted') {
                console.warn("Permesso notifiche non concesso. Stato:", permission);
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

                const currentData = await window.localDB.getUserData('fcm_token');
                const profile = await window.localDB.getUserData('profile');

                const tokenChanged = !currentData || currentData.token !== token;
                const profileMissingOrChanged = !profile || profile.fcmToken !== token;

                if (tokenChanged || profileMissingOrChanged) {
                    console.log("[FCM] Rilevato token FCM nuovo o modificato. Aggiornamento DB locale, profilo e Firestore...");

                    // 1. Salviamo il token in una entry dedicata per sicurezza
                    await window.localDB.saveUserData('fcm_token', { 
                        token, 
                        updatedAt: new Date().toISOString() 
                    });

                    // 2. Proviamo ad aggiornare il profilo se esiste già
                    if (profile) {
                        profile.fcmToken = token;
                        profile.fcmUpdatedAt = new Date().toISOString();
                        await window.localDB.saveUserData('profile', profile);

                        // Sincronizza con Firestore
                        if (window.dataService) {
                            await window.dataService.syncUserProfile();
                        }
                    }
                } else {
                    console.log("[FCM] Il token FCM è già allineato nel database locale e nel profilo.");
                }
            } else {
                console.warn("Nessun token FCM ricevuto. Controlla i permessi o la configurazione.");
            }
        } catch (error) {
            console.error("Errore durante l'ottenimento del token FCM:", error);
        }
    },


};

// Esponiamo il servizio globalmente
window.notificationService = NotificationService;
