import fs from 'fs'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
import { promises } from 'fs'
import { join } from 'path'

// Creamos un objeto global para almacenar el banner por sesión
global.bannerUrls = {}; // Almacenará las URLs de los banners por sesión

let handler = async (m, { conn, usedPrefix, text, command }) => {
  try {
    // Inicializamos la URL del banner para esta sesión si no existe
    if (!global.bannerUrls[conn.user.jid]) {
      global.bannerUrls[conn.user.jid] = 'https://files.catbox.moe/5k9zhl.jpg'; // URL inicial de la imagen del menú
    }

    if (command === 'setbanner') {
      if (!text) {
        return await m.reply('✘ Por favor, proporciona un enlace válido para la nueva imagen del banner.');
      }
      global.bannerUrls[conn.user.jid] = text.trim(); // Actualiza el banner solo para esta sesión
      return await m.reply('✔ El banner del menú ha sido actualizado correctamente para este bot.');
    }

    // Variables que usas para el contexto del canal
    const dev = 'Félix Manuel';
    const redes = 'https://github.com/Andresv27728/2.0';
    const channelRD = { id: "120363400360651198@newsletter", name: "MAKIMA - FRASES" };
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let perfil = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://files.catbox.moe/mqtxvp.jpg');

    // 1. Mensaje de "CARGANDO COMANDOS..." con contexto de canal
    await conn.sendMessage(m.chat, {
      text: 'ꪹ͜🕑͡ 𝗖𝗔𝗥𝗚𝗔𝗡𝗗𝗢 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦...𓏲✧੭',
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,
          newsletterName: channelRD.name,
          serverMessageId: -1,
        },
        forwardingScore: 999,
        externalAdReply: {
          title: 'Animación de carga',
          body: dev,
          thumbnailUrl: perfil,
          sourceUrl: redes,
          mediaType: 1,
          renderLargerThumbnail: false,
        },
      }
    }, { quoted: null });

    // 2. Datos usuario y menú
    let { exp, chocolates, level, role } = global.db.data.users[m.sender];
    let { min, xp, max } = xpRange(level, global.multiplier);
    let nombre = await conn.getName(m.sender);
    let _uptime = process.uptime() * 1000;
    let _muptime;
    if (process.send) {
      process.send('uptime');
      _muptime = await new Promise(resolve => {
        process.once('message', resolve);
        setTimeout(resolve, 1000);
      }) * 1000;
    }
    let muptime = clockString(_muptime);
    let uptime = clockString(_uptime);
    let totalreg = Object.keys(global.db.data.users).length;
    let taguser = '@' + m.sender.split("@s.whatsapp.net")[0];
    const emojis = '🩵';
    const error = '❌';

    let menu = `¡Hola! ${taguser} soy ${botname} ${(conn.user.jid == global.conn.user.jid ? '(OficialBot)' : '(Prem-Bot)')} 

╭━━I N F O-B O-T━━
┃Creadora: ༘͜͡❃➳𓆩ޫ͢黒𓆪𑪖 𝐑o͟𝐬𝐥𝐲𝐧𔗂꯭⸙͎
┃Tiempo activo: ${uptime}
┃Baileys: Multi device.
┃Base: Oficial.
┃Registros: ${totalreg}
╰━━━━━━━━━━━━━

╭━━INFO USUARIO━╮
┃Nombre: ${nombre}
┃Rango: ${role}
┃Nivel: ${level}
╰━━━━━━━━━━━━━

➪ 𝗟𝗜𝗦𝗧𝗔 
       ➪  𝗗𝗘 
           ➪ 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦

...`.trim(); // El resto del menú permanece igual

    // Enviar el menú con el banner específico para esta sesión
    await conn.sendMessage(m.chat, {
      image: { url: global.bannerUrls[conn.user.jid] },
      caption: menu,
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
          title: '𝐌A͜͡𝑲𝑖𝐌ꪖ  𝐁o͟T͎ 𝙼𝙳',
          body: dev,
          thumbnailUrl: perfil,
          sourceUrl: redes,
          mediaType: 1,
          renderLargerThumbnail: false,
        },
      }
    }, { quoted: null });

    await m.react(emojis);

  } catch (e) {
    await m.reply(`✘ Ocurrió un error cuando la lista de comandos se iba a enviar.\n\n${e}`);
    await m.react(error);
  }
}

handler.help = ['menu', 'setbanner'];
handler.tags = ['main'];
handler.command = ['menu', 'help', 'menú', 'asistenciabot', 'comandosbot', 'listadecomandos', 'menucompleto', 'setbanner'];
handler.register = true;

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}

export default handler;