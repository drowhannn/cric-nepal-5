import { and, ilike } from 'drizzle-orm'
import { tournament } from '~/db/schema'

export default defineEventHandler(async (event) => {
  const db = useDB()

  const query = getQuery(event)

  const search = query.search || ''

  const qs = []

  if (search) {
    qs.push(
      ilike(tournament.title, `%${search}%`),
    )
  }

  const results = await db.query.tournament.findMany(
    {
      orderBy: [tournament.id],
      where: and(...qs),
    },
  )

  return results
})
