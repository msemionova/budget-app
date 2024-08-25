import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import next from 'next'

admin.initializeApp()

const isDev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev: isDev, conf: { distDir: '.next' } })
const handle = nextApp.getRequestHandler()

const server = express()

server.all('*', (req, res) => {
  return handle(req, res)
})

export const nextAppFunction = functions.https.onRequest(async (req, res) => {
  await nextApp.prepare()
  server(req, res)
})
