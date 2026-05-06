import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { create_order, get_pending_orders, mark_order_done } from './db.js'

const VALID_BURGERS = ['the_alex', 'smoking', 'chillin', 'cheesy']

const app = new Hono()

app.use('/*', cors())

app.post('/api/orders', async (c) => {
  const { name, burger } = await c.req.json()

  if (!name?.trim() || !burger) {
    return c.json({ error: 'Name and burger are required' }, 400)
  }

  if (!VALID_BURGERS.includes(burger)) {
    return c.json({ error: 'Invalid burger selection' }, 400)
  }

  const order = await create_order(c.env.DB, { name: name.trim(), burger })
  return c.json(order, 201)
})

app.get('/api/orders', async (c) => {
  const orders = await get_pending_orders(c.env.DB)
  return c.json(orders)
})

app.patch('/api/orders/:id/done', async (c) => {
  const id = parseInt(c.req.param('id'), 10)

  if (isNaN(id)) {
    return c.json({ error: 'Invalid order ID' }, 400)
  }

  const order = await mark_order_done(c.env.DB, id)

  if (!order) {
    return c.json({ error: 'Order not found' }, 404)
  }

  return c.json(order)
})

app.notFound((c) => {
  return c.json({ error: `Route not found: ${c.req.method} ${c.req.path}` }, 404)
})

app.onError((error, c) => {
  console.error(`[${c.req.method} ${c.req.path}]`, error.message, error.stack)
  return c.json({ error: error.message || 'Internal server error' }, 500)
})

export default app
