const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    // Genera el código QR para escanear
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('¡Bot listo para usar! 🚀');
});

client.on('message', message => {
    if (message.body === '!hola') {
        message.reply('¡Hola! ¿Cómo estás?');
    } else if (message.body === '!adios') {
        message.reply('¡Adiós! Que tengas un buen día. 😊');
    } else if (message.body === '#infobot' || message.body === '#botinfo') {
        const creatorName = 'Ado (Wirk)'; // Cambia esto por el nombre del creador
        const botName = 'Mi Bot de WhatsApp'; // Cambia esto por el nombre de tu bot
        message.reply(`🤖 Información del Bot:\nNombre del Bot: ${botName}\nCreador: ${creatorName}`);
    }
});

client.initialize();