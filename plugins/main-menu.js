import fs from 'fs'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
import { promises } from 'fs'
import { join } from 'path'

let handler = async (m, { conn, usedPrefix, usedPrefix: _p, __dirname, text, command }) => {
  try {        
    // Variables que usas para el contexto del canal
    const dev = 'Félix Manuel'
    const redes = 'https://github.com/Andresv27728/2.0'
    const channelRD = { id: "120363400360651198@newsletter", name: "MAKIMA - FRASES" }
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let perfil = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://files.catbox.moe/mqtxvp.jpg')

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
    }, { quoted: null })

    // 2. Datos usuario y menú
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
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let taguser = '@' + m.sender.split("@s.whatsapp.net")[0]
    const vid = ['https://files.catbox.moe/falp8a.mp4']
    const emojis = '🩵'
    const error = '❌'

    let menu = `¡Hola! ${taguser} soy Makima 2.0 ${(conn.user.jid == global.conn.user.jid ? '(OficialBot)' : '(Prem-Bot)')} 

╭━━I N F O-B O T━━
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


.       ╭ֹ┈ ⵿❀⵿ ┈╮ ㅤ
 ╭ֹ┈ ⵿❀⵿ ┈╮PRINCIPALES
┃┈➤ #estado
┃┈➤ #botreglas
┃┈➤ #menu
┃┈➤ #menu2
┃┈➤ #uptime
┃┈➤ #menulista
╰━━━━━━━━━━━━━

.       ╭ֹ┈ ⵿❀⵿ ┈╮ ㅤ
 ╭ֹ┈ ⵿❀⵿ ┈╮NUEVOS
┃┈➤ #artista [nombre]
┃┈➤ #dalle2
╰━━━━━━━━━━━━━━━━━━

.       ╭ֹ┈ ⵿❀⵿ ┈╮ ㅤ
 ╭ֹ┈ ⵿❀⵿ ┈╮BUSCADORES
┃┈➤ #gitthubsearch
┃┈➤ #google [Búsqueda]
┃┈➤ #tiktoksearch
┃┈➤ #pinterest
┃┈➤ #imagen [querry]
╰━━━━━━━━━━━━━━━━━━

.       ╭ֹ┈ ⵿❀⵿ ┈╮ ㅤ
 ╭ֹ┈ ⵿❀⵿ ┈╮JUEGOS
┃┈➤ #abrazar
┃┈➤ #acertijo
┃┈➤ #agarrar
┃┈➤ #ahorcado
┃┈➤ #besar
┃┈➤ #acariciar
┃┈➤ #golpear
┃┈➤ #pregunta
┃┈➤ #reto
┃┈➤ #triste
┃┈➤ #reto
┃┈➤ #bot
┃┈➤ #love
┃┈➤ #consejo
┃┈➤ #dance
┃┈➤ #nombreninja
┃┈➤ #meme
┃┈➤ #dormir 
┃┈➤ #rata
┃┈➤ #enamorada
┃┈➤ #gay
┃┈➤ #manco
┃┈➤ #apostar
┃┈➤ #piropo
┃┈➤ #sonrojarse
┃┈➤ #agarrar
╰━━━━━━━━━━━━━━━━━━


.       ╭ֹ┈ ⵿❀⵿ ┈╮ ㅤ
 ╭ֹ┈ ⵿❀⵿ ┈╮WAIFU
┃┈➤ #robarpersonaje
┃┈➤ #obtenidos
┃┈➤ #sacar
┃┈➤ #guardar
┃┈➤ #carrw
┃┈➤ #confirmar
┃┈➤ #character
┃┈➤ #roll
┃┈➤ #top
╰━━━━━━━━━━━━━━━━━━


.       ╭ֹ┈ ⵿❀⵿ ┈╮ ㅤ
 ╭ֹ┈ ⵿❀⵿ ┈╮REGISTROS
┃┈➤ #reg
┃┈➤ #unreg
┃┈➤ #profile
┃┈➤ #usuarios
╰━━━━━━━━━━━━━━━━━━

.       ╭ֹ┈ ⵿❀⵿ ┈╮ ㅤ
 ╭ֹ┈ ⵿❀⵿ ┈╮ECONOMIA
┃┈➤ #daily
┃┈➤ #bank
┃┈➤ #robar
┃┈➤ #robarxp
┃┈➤ #rob2
┃┈➤ #levelup
┃┈➤ #lb
┃┈➤ #mine
┃┈➤ #retirar
┃┈➤ #trabajar
┃┈➤ #transferir
╰━━━━━━━━━━━━━━━━━━

.       ╭ֹ┈ ⵿❀⵿ ┈╮ ㅤ
 ╭ֹ┈ ⵿❀⵿ ┈╮DESCARGAS
┃┈➤ #fb
┃┈➤ #play
┃┈➤ #playvid
┃┈➤ #mediafire
┃┈➤ #apkmod
┃┈➤ #ytmp3doc
┃┈➤ #ytmp4doc
┃┈➤ #ig
┃┈➤ #gitclone
┃┈➤ #tiktok
┃┈➤ #spotify
┃┈➤ #tw
┃┈➤ #ytmp4 
┃┈➤ #imagen [querry]
╰━━━━━━━━━━━━━━━━━━

.       ╭ֹ┈ ⵿❀⵿ ┈╮ ㅤ
 ╭ֹ┈ ⵿❀⵿ ┈╮GRUPOS
┃┈➤ #group abrir 
┃┈➤ #group cerrar 
┃┈➤ #delete
┃┈➤ #setppgroup
┃┈➤ #encuesta
┃┈➤ #rentar
┃┈➤ #kick
┃┈➤ #promote
┃┈➤ #demote
┃┈➤ #tagall 
┃┈➤ #tag
┃┈➤ #invite 
╰━━━━━━━━━━━━━━━━━━

.       ╭ֹ┈ ⵿❀⵿ ┈╮ ㅤ
 ╭ֹ┈ ⵿❀⵿ ┈╮STICKERS
┃┈➤ #wm [autor]
┃┈➤ #s
┃┈➤ #qc
┃┈➤ #toimg
╰━━━━━━━━━━━━━━━━━━

.       ╭ֹ┈ ⵿❀⵿ ┈╮ ㅤ
 ╭ֹ┈ ⵿❀⵿ ┈╮DATABASE
┃┈➤ #delvn
┃┈➤ #demsg
┃┈➤ #delimg
┃┈➤ #delsticker
┃┈➤ #infobot
╰━━━━━━━━━━━━━━━━━━

.       ╭ֹ┈ ⵿❀⵿ ┈╮ ㅤ
 ╭ֹ┈ ⵿❀⵿ ┈╮EXPERIENCIA
┃┈➤ #buy
┃┈➤ #buyall
╰━━━━━━━━━━━━━━━━━━

.       ╭ֹ┈ ⵿❀⵿ ┈╮ ㅤ
 ╭ֹ┈ ⵿❀⵿ ┈╮CONFIGURACIÓN
┃┈➤ #enable
┃┈➤ #disable
┃┈➤ #on
┃┈➤ #off
╰━━━━━━━━━━━━━━━━━

.       ╭ֹ┈ ⵿❀⵿ ┈╮ ㅤ
 ╭ֹ┈ ⵿❀⵿ ┈╮ANIME
┃┈➤ #toanime
┃┈➤ #tts
┃┈➤ #remini
┃┈➤ #enhance
┃┈➤ #hd
┃┈➤ #nuevafotochannel
┃┈➤ #nosilenciarcanal
┃┈➤ #silenciarcanal
┃┈➤ #seguircanal
┃┈➤ #inspect
┃┈➤ #infobot
┃┈➤ #readvo
╰━━━━━━━━━━━━━━━━━━

.       ╭ֹ┈ ⵿❀⵿ ┈╮ ㅤ
 ╭ֹ┈ ⵿❀⵿ ┈╮INFORMACIÓN
┃┈➤ #creador
┃┈➤ #owner
┃┈➤ #reportar
┃┈➤ #ping
┃┈➤ #links
╰━━━━━━━━━━━━━━━━━━

.       ╭ֹ┈ ⵿❀⵿ ┈╮ ㅤ
 ╭ֹ┈ ⵿❀⵿ ┈╮CREADOR
┃┈➤ #addprem
┃┈➤ #copia
┃┈➤ #broadcastgroup
┃┈➤ #bcgb
┃┈➤ #bcgb2
┃┈➤ #broadcast
┃┈➤ #bc
┃┈➤ #cheat
┃┈➤ #delprem
┃┈➤ #dsowner
┃┈➤ #fixmsgespera
┃┈➤ #get
┃┈➤ #prefix
┃┈➤ #reiniciar 
┃┈➤ #saveplugin 
┃┈➤ #update
┃┈➤ #resetpersonajes
╰━━━━━━━━━━━━━━━━━━

.       ╭ֹ┈ ⵿❀⵿ ┈╮ ㅤ
 ╭ֹ┈ ⵿❀⵿ ┈╮DESARROLLADORES
┃┈➤ #autoadmin
┃┈➤ #banuser
┃┈➤ #unbanuser
┃┈➤ #banchat
┃┈➤ #unbanchat
┃┈➤ #ip
┃┈➤ #join
╰━━━━━━━━━━━━━━━━━━

.       ╭ֹ┈ ⵿❀⵿ ┈╮ ㅤ
 ╭ֹ┈ ⵿❀⵿ ┈╮A - I
┃┈➤ #dalle
┃┈➤ #simi
┃┈➤ #ai
┃┈➤ #tovideo
┃┈➤ #togifaud
╰━━━━━━━━━━━━━━━━━━


> © ⍴᥆ᥕᥱrᥱძ ᑲᥡ Félix Manuel`.trim()

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

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['comand', 'menu', 'help', 'menú', 'asistenciabot', 'comandosbot', 'listadecomandos', 'menucompleto']
handler.register = true
export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}