import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/*', cors())

app.get('/api/health', (context) => {
  return context.json({ status: 'ok' })
})

app.notFound((context) => {
  return context.json({ error: `Route not found: ${context.req.method} ${context.req.path}` }, 404)
})

app.onError((error, context) => {
  console.error(`[${context.req.method} ${context.req.path}]`, error.message, error.stack)
  return context.json({ error: error.message || 'Internal server error' }, 500)
})

export default app
