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
const MAKIMA_ICON = "https://qu.ax/vXOTr.jpg"; // TU MINIATURA DE MAKIMA CUADRADA
const SOC_CLAIM_TIMEOUT = 9 * 60 * 1000; // 9 minutos

let soccerStorage = global.db.data.soccer || (global.db.data.soccer = {});

let handler = async (m, { conn, command, args }) => {
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
            title: '🩵 MAKIMA BOT MD 🩵',
            body: 'MAKIMA - CHANNEL',
            thumbnailUrl: MAKIMA_ICON,
            sourceUrl: "https://github.com/mantis-has",
            mediaType: 1,
            renderLargerThumbnail: false
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
          title: '🩵 MAKIMA BOT MD 🩵',
          body: 'MAKIMA BOT 🏆',
          thumbnailUrl: MAKIMA_ICON,
          sourceUrl: "https://github.com/mantis-has/makima",
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: m });

    soccerStorage[m.chat].msgId = (await msg).key.id;
    user.lastSoccer = +new Date;
    return;
  }

  // Comando #rcjugador (reclamar)
  if (command === "rcjugador") {
    if (!m.quoted || !m.quoted.id) return m.reply('Responde a la foto del jugador con #rcjugador para reclamarlo.');

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
            title: '🩵 MAKIMA BOT MD 🩵',
            body: 'Dev Félix',
            thumbnailUrl: MAKIMA_ICON,
            sourceUrl: "https://github.com/mantis-has/Makima",
            mediaType: 1,
            renderLargerThumbnail: false
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
            title: 'MAKIMA 🏆',
            body: '🩵 MAKIMA - CHANNEL 🩵',
            thumbnailUrl: MAKIMA_ICON,
            sourceUrl: "https://github.com/mantis-has/Makima",
            mediaType: 1,
            renderLargerThumbnail: false
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
          title: '🩵 MAKIMA 2.0 BOT 🩵',
          body: 'MAKIMA - FRASES',
          thumbnailUrl: MAKIMA_ICON,
          sourceUrl: "https://te.quieres.robar.mi.bot.com",
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: m });
    return;
  }

  // Comando #jugadores
  if (command === "jugadores") {
    let targetJid;
    if (m.mentionedJid && m.mentionedJid.length > 0) {
      targetJid = m.mentionedJid[0];
    } else {
      targetJid = m.sender;
    }
    let user = global.db.data.users[targetJid];
    let nombre = await conn.getName(targetJid);

    let lista = (user && user.soccerPlayers) ? user.soccerPlayers : [];
    let total = lista.length;

    let jugadoresText = lista.length > 0 ? lista.map(j => `• ${j}`).join('\n') : "No tiene jugadores reclamados.";

    let texto = `✰ 𝖩𝖴𝖦𝖠𝖣𝖮𝖱𝖤𝖲 ✰

Usuario: ${nombre}

Total: ${total}

${jugadoresText}`;

    await conn.sendMessage(m.chat, {
      text: texto,
      mentions: [targetJid],
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,
          newsletterName: channelRD.name,
          serverMessageId: -1,
        },
        forwardingScore: 999,
        externalAdReply: {
          title: '🩵 MAKIMA BOT MD 🩵',
          body: 'MAKIMA - FRASES',
          thumbnailUrl: MAKIMA_ICON,
          sourceUrl: "https://github.com/Andresv27728/2.0",
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: m });
    return;
  }
};

handler.help = ['soccer', 'rcjugador', 'jugadores'];
handler.tags = ['games'];
handler.command = ['soccer', 'rcjugador', 'jugadores'];
handler.register = true;
export default handler;

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}