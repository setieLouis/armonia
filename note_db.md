 await window.localDB.getUserData('fcm_token').then(data => {
        if (data) {
            console.log("FCM Token trovato:", data.token);
            console.log("Ultimo aggiornamento:", new Date(data.updatedAt).toLocaleString());
        } else {
            console.warn("Nessun token salvato nel database locale.");
        }
    });


 eANxV3ig9yFaQEMyY-1He0:APA91bH7GeHueofiOUNGCdWmCzV9xDnBL-GwrgpTn9nd4OulQz3vQ7Zf2_sVYhGP_eT_aSKQ3sQkkQ36HpQtwdt-ZTSyjmWE8mX73jhARpftbH54-QvKSMU