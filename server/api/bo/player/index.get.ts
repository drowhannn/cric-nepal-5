import { and, ilike } from 'drizzle-orm'
import { player } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const db = useDB()

  const query = getQuery(event)

  const search = query.search || ''

  const qs = []

  if (search) {
    qs.push(
      ilike(player.fullName, `%${search}%`),
    )
  }

  const results = await db.query.player.findMany(
    {
      orderBy: [player.id],
      where: and(...qs),
    },
  )

  return results
})
