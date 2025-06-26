const jugadores = [
  { nombre: "Cristiano Ronaldo", valor: 100, url: "https://files.catbox.moe/fl7ibk.jpg" },
  { nombre: "Luka Modric", valor: 100, url: "https://files.catbox.moe/606f25.jpg" },
  { nombre: "Kevin Benzema", valor: 100, url: "https://qu.ax/JlOOv.jpg" },
  { nombre: "Lamine Yamal", valor: 100, url: "https://qu.ax/KPZrj.jpg" },
  { nombre: "Lionel Messi", valor: 100, url: "https://qu.ax/ggRkD.jpg" },
  { nombre: "Keylan Mbappe", valor: 100, url: "https://qu.ax/XPEDZ.jpg" },
  { nombre: "Bellingang", valor: 100, url: "https://qu.ax/krNHY.jpg" },
  { nombre: "Vinicios JR", valor: 100, url: "https://qu.ax/QHNhz.jpg" },
  { nombre: "Ronaldo", valor: 100, url: "https://qu.ax/jDVGs.jpg" }
];

const channelRD = { id: "120363400360651198@newsletter", name: "MAKIMA - FRASES" };
const SOC_CLAIM_TIMEOUT = 9 * 60 * 1000; // 9 minutos

let soccerStorage = global.db.data.soccer || (global.db.data.soccer = {});

let handler = async (m, { conn, command }) => {
  // Comando #soccer
  if (command === "soccer") {
    let user = global.db.data.users[m.sender];
    if (!user) user = global.db.data.users[m.sender] = {};

    if (user.lastSoccer && new Date - user.lastSoccer < SOC_CLAIM_TIMEOUT) {
      return await conn.sendMessage(m.chat, {
        text: `「🩵」Debes esperar ${clockString(SOC_CLAIM_TIMEOUT - (new Date - user.lastSoccer))} para reclamar otro jugador de fútbol.`,
        contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: channelRD.id,
            newsletterName: channelRD.name,
            serverMessageId: -1,
          },
          forwardingScore: 999,
          externalAdReply: {
            title: '✅ Makima 2.0 VERIFICADO',
            body: 'MAKIMA - FRASES',
            thumbnailUrl: "https://telegra.ph/file/2e232d8e5b9e8c7b3e4a2.jpg", // Puedes poner tu propio logo o ícono del bot
            sourceUrl: "https://github.com/Andresv27728/2.0",
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });
    }

    let jugador = jugadores[Math.floor(Math.random() * jugadores.length)];

    soccerStorage[m.chat] = {
      nombre: jugador.nombre,
      url: jugador.url,
      valor: jugador.valor,
      owner: null,
      msgId: null
    };

    let msg = await conn.sendMessage(m.chat, {
      image: { url: jugador.url },
      caption: `✰ Jugador: ${jugador.nombre}\n✰ Valor: ${jugador.valor}\n✰ Fuente: Deymoon\n✰ Bot: Makima 2.0`,
      contextInfo: {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,
          newsletterName: channelRD.name,
          serverMessageId: -1,
        },
        forwardingScore: 999,
        externalAdReply: {
          title: '✅ Makima 2.0 VERIFICADO',
          body: 'MAKIMA - FRASES',
          thumbnailUrl: jugador.url,
          sourceUrl: "https://github.com/Andresv27728/2.0",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    soccerStorage[m.chat].msgId = (await msg).key.id;
    user.lastSoccer = +new Date;
    return;
  }

  // Comando #reclamar
  if (command === "reclamar") {
    if (!m.quoted || !m.quoted.id) return m.reply('Responde a la foto del jugador con #reclamar para reclamarlo.');

    let soccer = soccerStorage[m.chat];
    if (!soccer || soccer.msgId !== m.quoted.id)
      return m.reply('No hay jugador disponible para reclamar o ya expiró.');

    if (soccer.owner) {
      let ownerName = await conn.getName(soccer.owner);
      return await conn.sendMessage(m.chat, {
        text: `「🩵」Este jugador ya fue reclamado por ${ownerName}.`,
        contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: channelRD.id,
            newsletterName: channelRD.name,
            serverMessageId: -1,
          },
          forwardingScore: 999,
          externalAdReply: {
            title: '✅ Makima 2.0 VERIFICADO',
            body: 'MAKIMA - FRASES',
            thumbnailUrl: soccer.url,
            sourceUrl: "https://github.com/Andresv27728/2.0",
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });
    }

    let user = global.db.data.users[m.sender];
    if (!user || user.exp < soccer.valor)
      return await conn.sendMessage(m.chat, {
        text: `「🩵」No tienes suficiente XP para reclamar este jugador.`,
        contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: channelRD.id,
            newsletterName: channelRD.name,
            serverMessageId: -1,
          },
          forwardingScore: 999,
          externalAdReply: {
            title: '✅ Makima 2.0 VERIFICADO',
            body: 'MAKIMA - FRASES',
            thumbnailUrl: soccer.url,
            sourceUrl: "https://github.com/Andresv27728/2.0",
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });

    soccer.owner = m.sender;
    if (!user.soccerPlayers) user.soccerPlayers = [];
    user.soccerPlayers.push(soccer.nombre);

    await conn.sendMessage(m.chat, {
      text: `「🩵」¡Reclamaste a ${soccer.nombre}!`,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,
          newsletterName: channelRD.name,
          serverMessageId: -1,
        },
        forwardingScore: 999,
        externalAdReply: {
          title: '✅ Makima 2.0 VERIFICADO',
          body: 'MAKIMA - FRASES',
          thumbnailUrl: soccer.url,
          sourceUrl: "https://github.com/Andresv27728/2.0",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });
    return;
  }
};

handler.help = ['soccer', 'reclamar'];
handler.tags = ['games'];
handler.command = ['soccer', 'reclamar'];
handler.register = true;
export default handler;

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}