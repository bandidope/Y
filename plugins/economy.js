const fs = require('fs');
const dbPath = './economy_db.json';

// Verifica si la base de datos existe, si no, la crea.
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({}));
}

// Funciones internas para leer y guardar datos
const leerDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const guardarDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// Función para obtener/crear el perfil de un usuario
function obtenerUsuario(userId) {
    const db = leerDB();
    if (!db[userId]) {
        db[userId] = { saldo: 0, ultimaChamba: 0, ultimoMinado: 0 };
        guardarDB(db);
    }
    return db[userId];
}

module.exports = {
    // 💰 COMANDO: #saldo
    verSaldo: (userId) => {
        const user = obtenerUsuario(userId);
        return `Tenes un saldo de ${user.saldo} coins.`;
    },

    // 💼 COMANDO: #chamba
    chamba: (userId) => {
        const db = leerDB();
        const user = obtenerUsuario(userId);
        const ahora = Date.now();
        const tiempoEspera = 60000; // 1 minuto de cooldown (en milisegundos)

        if (ahora - user.ultimaChamba < tiempoEspera) {
            const faltan = Math.ceil((tiempoEspera - (ahora - user.ultimaChamba)) / 1000);
            return `¡Tranquilo viejo! Tienes que esperar ${faltan} segundos para volver a chambear.`;
        }

        const ganancias = Math.floor(Math.random() * 300) + 50; // Gana entre 50 y 350
        
        // Frases random para la chamba
        const frases = [
            `Le lames el trasero a los admins y ganaste ${ganancias} coins.`,
            `Vendiste tamales en la esquina y la gente te dejó ${ganancias} coins de propina.`,
            `Te pusiste a programar en modo dios y cobraste ${ganancias} coins.`,
            `Fuiste el chalán del albañil y te pagaron ${ganancias} coins por cargar cemento.`
        ];
        const fraseRandom = frases[Math.floor(Math.random() * frases.length)];

        // Actualizar base de datos
        db[userId] = user; // Aseguramos que el usuario esté en la db en memoria
        db[userId].saldo += ganancias;
        db[userId].ultimaChamba = ahora;
        guardarDB(db);

        return fraseRandom;
    },

    // ⛏️ COMANDO: #minar
    minar: (userId) => {
        const db = leerDB();
        const user = obtenerUsuario(userId);
        const ahora = Date.now();
        const tiempoEspera = 120000; // 2 minutos de cooldown

        if (ahora - user.ultimoMinado < tiempoEspera) {
            const faltan = Math.ceil((tiempoEspera - (ahora - user.ultimoMinado)) / 1000);
            return `Tus tarjetas gráficas se están enfriando. Espera ${faltan} segundos para minar de nuevo.`;
        }

        const ganancias = Math.floor(Math.random() * 150) + 20; 
        
        db[userId] = user;
        db[userId].saldo += ganancias;
        db[userId].ultimoMinado = ahora;
        guardarDB(db);

        return `⛏️ Picaste piedra digital como un campeón y encontraste ${ganancias} coins.`;
    },

    // 🥷 COMANDO: #robar
    robar: (userId, targetId) => {
        if (userId === targetId) return "No puedes robarte a ti mismo, genio.";

        const db = leerDB();
        const user = obtenerUsuario(userId);
        const target = obtenerUsuario(targetId);

        if (target.saldo < 50) {
            return "Este wey es más pobre que tú, no tiene sentido robarle.";
        }

        // Probabilidad de éxito del 50%
        const exito = Math.random() > 0.5;

        if (exito) {
            // Roba entre el 10% y el 30% del saldo del objetivo
            const porcentajeRobo = (Math.random() * 0.2) + 0.1;
            const cantidadRobada = Math.floor(target.saldo * porcentajeRobo);

            db[userId].saldo += cantidadRobada;
            db[targetId].saldo -= cantidadRobada;
            guardarDB(db);

            return `🥷 ¡Éxito! Le metiste la mano al bolsillo y le robaste ${cantidadRobada} coins.`;
        } else {
            // Multa por fallar
            const multa = 50;
            db[userId].saldo -= multa;
            // Evitar saldos negativos
            if (db[userId].saldo < 0) db[userId].saldo = 0;
            guardarDB(db);

            return `🚓 ¡Te agarró la policía! Fallaste el robo y pagaste una multa de ${multa} coins.`;
        }
    }
};
