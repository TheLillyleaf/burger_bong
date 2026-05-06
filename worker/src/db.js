export async function create_order(db, { name, burger }) {
  return db
    .prepare('INSERT INTO orders (name, burger) VALUES (?, ?) RETURNING *')
    .bind(name, burger)
    .first()
}

export async function get_pending_orders(db) {
  const { results } = await db
    .prepare("SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at ASC")
    .all()
  return results
}

export async function mark_order_done(db, id) {
  return db
    .prepare("UPDATE orders SET status = 'done' WHERE id = ? RETURNING *")
    .bind(id)
    .first()
}
