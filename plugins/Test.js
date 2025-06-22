`.trim();

    // Mensaje de inicio de envío del menú
    await conn.reply(m.chat, '*ꪹ͜𓂃⌛͡𝗘𝗻𝘃𝗶𝗮𝗻𝗱𝗼 𝗠𝗲𝗻𝘂 𝗱𝗲𝗹 𝗕𝗼𝘁....𓏲੭*', fkontak, { 
        contextInfo: { 
            forwardingScore: 2022, 
            isForwarded: true, 
            externalAdReply: {
                title: packname,
                body: '¡explora la gran variedad de comandos!',
                sourceUrl: redes,
                thumbnail: icons 
            }
        }
    });

    await m.react('💖');

    // Enviar el video GIF con el texto en un solo mensaje
    await conn.sendMessage(m.chat, { 
        video: { url: randomGif },
        caption: txt,
        gifPlayback: true, // Hace que el video se vea como GIF
        contextInfo: {
            mentionedJid: [m.sender, userId],
            isForwarded: true,
            forwardingScore: 999,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363335626706839@newsletter',
                newsletterName: '⏤͟͞ू⃪፝͜⁞⟡『 𝐓͢ᴇ𝙖፝ᴍ⃨ 𝘾𝒉꯭𝐚𝑛𝑛𝒆𝑙: 𝑹ᴜ⃜ɓ𝑦-𝑯ᴏ𝒔𝑯𝙞꯭𝑛𝒐 』࿐⟡',
                serverMessageId: -1,
            },
            externalAdReply: {
                title: 'ׄ❀ׅᮢ໋۬۟   ׁ ᮫᩠𝗥ᥙ᜔᪲𝖻ֹ𝘺 𝐇֢ᩚᨵ̷̸ׁׅׅ𝗌𝗁𝗂ᮬ𝗇֟፝͡𝗈̷̸  ꫶֡ᰵ࡙🌸̵໋ׄᮬ͜✿֪',
                body: dev,
                thumbnail: icons,
                sourceUrl: redes,
                mediaType: 1,
                renderLargerThumbnail: false,
            }
        }
    }, { quoted: m });

};

handler.help = ['menu'];
handler.register = true;
handler.tags = ['main'];
handler.command = ['menubotmd', 'menú', 'help'];

export default handler;

function clockString(ms) {
    let seconds = Math.floor((ms / 1000) % 60);
    let minutes = Math.floor((ms / (1000 * 60)) % 60);
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return `${hours}h ${minutes}m ${seconds}s`;
}
