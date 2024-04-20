import { and, eq, ilike } from 'drizzle-orm'
import type { PgColumn, PgTable } from 'drizzle-orm/pg-core'
import type { H3Event } from 'h3'
import { z, type ZodObject } from 'zod'

type ListConfig = {
  table: PgTable
  searchFields: PgColumn[]
  orderBy: PgColumn
}

export const list = async (event: H3Event, config: ListConfig) => {
  const db = useDB()

  const query = getQuery(event)

  const search = query.search || ''

  const qs = []

  if (search) {
    for (const field of config.searchFields) {
      qs.push(
        ilike(field, `%${search}%`),
      )
    }
  }

  const results = db.select().from(config.table).where(and(...qs)).orderBy(config.orderBy)

  return results
}

type CreateConfig = {
  table: PgTable
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createSchema: ZodObject<any>
}

export const create = async (event: H3Event, config: CreateConfig) => {
  const db = useDB()
  const body = await readValidatedBody(event, config.createSchema.parse)
  await db.insert(config.table).values(body)
  return {
    success: true,
  }
}

type RetrieveConfig = {
  table: PgTable
}

export const retrieve = async (event: H3Event, config: RetrieveConfig) => {
  const db = useDB()
  const { id } = await getValidatedRouterParams(event, z.object({ id: z.coerce.number() }).parse)
  //   @ts-expect-error - Assume id column exists
  const [result] = await db.select().from(config.table).where(eq(config.table.id, id))
  if (!result) throw new Error('Resource not found.')
  return result
}

type UpdateConfig = {
  table: PgTable
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateSchema: ZodObject<any>
}

export const update = async (event: H3Event, config: UpdateConfig) => {
  const db = useDB()
  const { id } = await getValidatedRouterParams(event, z.object({ id: z.coerce.number() }).parse)
  const body = await readValidatedBody(event, config.updateSchema.parse)
  //   @ts-expect-error - Assume id column exists
  await db.update(config.table).set(body).where(eq(config.table.id, id))
  return {
    success: true,
  }
}

type DeleteConfig = {
  table: PgTable
}

export const remove = async (event: H3Event, config: DeleteConfig) => {
  const db = useDB()
  const { id } = await getValidatedRouterParams(event, z.object({ id: z.coerce.number() }).parse)
  //   @ts-expect-error - Assume id column exists
  await db.delete(config.table).where(eq(config.table.id, id))
  return {
    success: true,
  }
}
