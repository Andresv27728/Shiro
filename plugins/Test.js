// PROHIBIDO EDITAR - SUBBOT PREMIUM (agrega solo control de token premium)
import { fetchLatestBaileysVersion, useMultiFileAuthState, makeCacheableSignalKeyStore } from "@whiskeysockets/baileys"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'

const channelRD = {
  id: "120363400360651198@newsletter",
  name: "MAKIMA - CHANNEL"
}
const thumbnailUrl = 'https://qu.ax/dXOUo.jpg'
// Lista de tokens válidos
const premiumTokens = [
  "MAK1", "MAK2", "MAK3", "MAK4", "MAK5",
  "MAK6", "MAK7", "MAK8", "MAK9", "MAK10"
]
const TOKENS_FILE = path.join(process.cwd(), 'premium_tokens.json')
const SESSIONS_FOLDER = path.join(process.cwd(), 'premium_sessions')
const __ try {
      return JSON.parse(fs.readFileSync(TOKENS_FILE))
    } catch {
      return {}
    }
  }
  return {}
}
function saveTokensState(state) {
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(state, null, 2))
}

let handler = async (m, { conn, args }) => {
  if (!args[0]) {
    await sendNewsletter(m, conn, '「🩵」Ingresa un token para conectarte con la bot.')
    return
  }
  const token = (args[0] || '').trim().toUpperCase()
  if (!premiumTokens.includes(token)) {
    await sendNewsletter(m, conn, '「🩵」El token ingresado es incorrecto, conectate con mi creador para que te regale un token premium.')
    return
  }

  let tokensState = loadTokensState()
  let senderId = m.sender.split('@')[0] // SOLO NÚMEROS
  let userSessionPath = path.join(SESSIONS_FOLDER, senderId)
  if (!fs.existsSync(userSessionPath)) fs.mkdirSync(userSessionPath, { recursive: true })

  if (tokensState[token] && tokensState[token] !== senderId) {
    await sendNewsletter(m, conn, '「🩵」Este token ya fue utilizado. Usa otro token o solicita uno nuevo al creador.')
    return
  }

  if (tokensState[token] === senderId) {
    let isSessionClosed = false
    try {
      const credsPath = path.join(userSessionPath, 'creds.json')
      if (!fs.existsSync(credsPath)) isSessionClosed = true
    } catch { isSessionClosed = true }
    if (isSessionClosed) {
      await sendNewsletter(m, conn, '🕑 Iniciando sesión, espere un momento...')
    } else {
      await sendNewsletter(m, conn, '「🩵」Ya estás conectado con este token.')
      return
    }
  } else {
    tokensState[token] = senderId
    saveTokensState(tokensState)
    await sendNewsletter(m, conn, '「🩵」Token correcto, enviando método de vinculación...')
  }

  try {
    // Exactamente igual que el subbot: usa la sesión del usuario en premium_sessions/<numero>
    const { state } = await useMultiFileAuthState(userSessionPath)
    let { version } = await fetchLatestBaileysVersion()
    const msgRetryCache = new NodeCache()
    const connectionOptions = {
      logger: pino({ level: "fatal" }),
      printQRInTerminal: false,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
      msgRetryCache,
      browser: ['Ubuntu', 'Chrome', '110.0.5585.95'],
      version,
      generateHighQualityLinkPreview: true
    }
    let sock = makeWASocket(connectionOptions)
    sock.ev.once('connection.update', async (update) => {
      if (update.connection === 'connecting' || update.connection === 'open') {
        let code = await sock.requestPairingCode(senderId)
        code = code.match(/.{1,4}/g)?.join("-")
        let pasos = `*︰꯭𞋭🩵 ̸̷᮫໊᷐͢᷍ᰍ⧽͓̽ CONEXIÓN PREMIUMBOT*\n\n━⧽ MODO CÓDIGO\n\n✰ Pasos de vinculación:\n\n➪ Ve a la esquina superior derecha en WhatsApp.\n➪ Toca en *Dispositivos vinculados*.\n➪ Selecciona *V de teléfono*.\n➪ Pega el código que te enviaré en el siguiente mensaje.\n\n★ Nota: Este código solo funciona en el número que lo solicitó.`
        await conn.sendMessage(m.chat, {
          text: pasos,
          contextInfo: newsletterContext()
        }, { quoted: m })
        await delay(1000)
        await conn.sendMessage(m.chat, {
          text: `*Código de vinculación:*\n${code}`,
          contextInfo: newsletterContext()
        }, { quoted: m })
      }
    })
    sock.ws.on("open", () => { }); // Forzar el arranque del socket
  } catch (e) {
    console.error("ERROR PAIRING CODE:", e)
    await sendNewsletter(m, conn, '「🩵」No se pudo generar el código de vinculación. Error: ' + (e?.message || e));
  }
}

handler.help = ['qrpremium <token>', 'codepremium <token>']
handler.tags = ['serbot']
handler.command = ['qrpremium', 'codepremium']
export default handler

function newsletterContext() {
  return {
    isForwarded: true,
    forwardingScore: 999,
    forwardedNewsletterMessageInfo: {
      newsletterJid: channelRD.id,
      newsletterName: channelRD.name,
      serverMessageId: -1
    },
    externalAdReply: {
      title: channelRD.name,
      body: 'MAKIMA 2.0 BOT',
      thumbnailUrl: thumbnailUrl,
      mediaType: 1,
      renderLargerThumbnail: false,
.com/channel/${channelRD.id.replace('@newsletter', '')}`
    }
  }
}
async function sendNewsletter(m, conn, text) {
  await conn.sendMessage(m.chat, { text, contextInfo: newsletterContext() }, { quoted: m })
}
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}