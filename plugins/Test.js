import { fetchLatestBaileysVersion, useMultiFileAuthState, makeCacheableSignalKeyStore } from "@whiskeysockets/baileys"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'

const premiumTokens = [
  "MAK1", "MAK2", "MAK3", "MAK4", "MAK5",
  "MAK6", "MAK7", "MAK8", "MAK9", "MAK10"
]
const TOKENS_FILE = path.join(process.cwd(), 'premium_tokens.json')
const SESSIONS_FOLDER = path.join(process.cwd(), 'MakiSessions')
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function(TOKENS_FILE)) {
    try {
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
  try {
    if (!args[0]) {
      await m.reply('「🩵」Ingresa un token para conectarte con la bot. Ejemplo: .qrpremium MAK1')
      return
    }
    const token = (args[0] || '').trim().toUpperCase()
    if (!premiumTokens.includes(token)) {
      await m.reply('「🩵」El token ingresado es incorrecto, solicita uno nuevo al creador.')
      return
    }
    let tokensState = loadTokensState()
    let senderId = m.sender.split('@')[0].replace(/\D/g, '')
    if (!/^\d{8,}$/.test(senderId)) {
      await m.reply('「🩵」El número de WhatsApp es inválido. Debe ser solo números y formato internacional (ej: 51999999999).')
      return
    }
    let userSessionPath = path.join(SESSIONS_FOLDER, senderId)
    if (!fs.existsSync(userSessionPath)) fs.mkdirSync(userSessionPath, { recursive: true })

    if (tokensState[token] && tokensState[token] !== senderId) {
      await m.reply('「🩵」Este token ya fue utilizado por otro usuario. Usa otro token o pide uno nuevo.')
      return
    }
    const credsPath = path.join(userSessionPath, 'creds.json')
    if (tokensState[token] === senderId && fs.existsSync(credsPath)) {
      await m.reply('「🩵」Ya estás conectado con este token. Si no ves la bot en línea intenta .qrpremium de nuevo.')
      return
    }
    tokensState[token] = senderId
    saveTokensState(tokensState)
    await m.reply('「🩵」Iniciando sesión, espera un momento...')

    try {
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

      let timeout = setTimeout(async () => {
        await m.reply('「🩵」Error: El socket tardó demasiado en conectar. Verifica tu número (debe ser internacional, ejemplo: 51999999999), tu conexión a internet y la carpeta MakiSessions.')
        try { sock.end(); } catch {}
      }, 20000) // 20 segundos máximo

      sock.ev.on('connection.update', async (update) => {
        if (update.connection === 'open') {
          clearTimeout(timeout)
          await m.reply('「🩵」Sesión conectada. Generando código de vinculación...')
          try {
            let code = await sock.requestPairingCode(senderId)
            code = code.match(/.{1,4}/g)?.join("-")
            let pasos = `*︰꯭𞋭🩵 CONEXIÓN PREMIUM*\n\n━⧽ MODO CÓDIGO\n\n✰ Pasos de vinculación:\n\n➪ Ve a la esquina superior derecha en WhatsApp.\n➪ Toca en *Dispositivos vinculados*.\n➪ Selecciona *Vincular con el número de teléfono*.\n➪ Pega el código que te enviaré en el siguiente mensaje.\n\n★ Nota: Este código solo funciona en el número que lo solicitó.`
            await m.reply(pasos)
            await delay(1000)
            await m.reply(`*Código de vinculación:*\n${code}`)
            await delay(1000)
            await m.reply('Te conectaste como Prem Bot con éxito...')
.end(); } catch {}
          } catch (err) {
            await m.reply('「🩵」Error generando pairing code: ' + (err?.message || err))
            try { sock.end(); } catch {}
          }
        } else if (update.connection === 'close') {
          clearTimeout(timeout)
        }
      })

      sock.ev.on('creds.update', (creds) => {
        // Puedes guardar info extra aquí si quieres
      })

    } catch (err) {
      await m.reply('「🩵」Error en la conexión: ' + (err?.message || err))
    }
  } catch (e) {
    console.error("ERROR PREMIUMSUBBOT:", e)
    await m.reply('「🩵」Ocurrió un error: ' + (e?.message || e))
  }
}

handler.help = ['qrpremium <token>', 'codepremium <token>']
handler.tags = ['serbot']
handler.command = ['qrpremium', 'codepremium']
export default handler

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}