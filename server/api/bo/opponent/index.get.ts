import { and, ilike } from 'drizzle-orm'
import { opponent } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const db = useDB()

  const query = getQuery(event)

  const search = query.search || ''

  const qs = []

  if (search) {
    qs.push(
      ilike(opponent.name, `%${search}%`),
    )
  }

  const results = await db.query.opponent.findMany(
    {
      orderBy: [opponent.id],
      where: and(...qs),
    },
  )

  return results
})
