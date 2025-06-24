import fs from 'fs'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
import { promises } from 'fs'
import { join } from 'path'

let handler = async (m, { conn, usedPrefix, usedPrefix: _p, __dirname, text, command }) => {
  try {        
    // 1. Mensaje de "CARGANDO COMANDOS..."
    await conn.sendMessage(m.chat, { text: '⏳ CARGANDO COMANDOS...' }, { quoted: m })

    // 2. Resto del código (como tu ejemplo)
    let { exp, chocolates, level, role } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let nombre = await conn.getName(m.sender)
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let user = global.db.data.users[m.sender]
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let perfil = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://files.catbox.moe/mqtxvp.jpg')
    let taguser = '@' + m.sender.split("@s.whatsapp.net")[0]
    const vid = ['https://files.catbox.moe/falp8a.mp4', 'https://files.catbox.moe/falp8a.mp4', 'https://files.catbox.moe/falp8a.mp4']
    const dev = 'Tu dev info aquí'
    const redes = 'https://github.com/Andresv27728/2.0' // Cambia a tu link
    const channelRD = { id: "newsletterid@newsletter", name: "MakimaBot News" } // Ajusta si tienes canal
    const emojis = '✅'
    const error = '❌'

    let menu = `¡Hola! ${taguser} soy Makima 2.0 ${(conn.user.jid == global.conn.user.jid ? '(OficialBot)' : '(Prem-Bot)')} 
 

Este Código está siendo editado, inténtalo más tarde.

> Powered by Félix`.trim()

    await conn.sendMessage(m.chat, {
      video: { url: vid.getRandom() },
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
      },
      gifPlayback: true,
      gifAttribution: 0
    }, { quoted: null })

    await m.react(emojis)

  } catch (e) {
    await m.reply(`✘ Ocurrió un error cuando la lista de comandos se iba a enviar.\n\n${e}`)
    await m.react(error)
  }
}

// Puedes añadir los comandos que quieras que activen este handler
handler.help = ['menu']
handler.tags = ['main']
handler.command = ['allmenu', 'help', 'menú', 'asistenciabot', 'comandos', 'listadecomandos', 'menucompleto']
handler.register = true
export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}