import { and, eq, ilike, sql } from 'drizzle-orm'
import type { PgColumn, PgTable } from 'drizzle-orm/pg-core'
import type { H3Event } from 'h3'
import { z, type ZodObject } from 'zod'

import { createRouter, defineEventHandler } from 'h3'

type ListConfig = {
  table: PgTable
  searchFields?: PgColumn[]
  orderBy?: PgColumn
  noPagination?: boolean
}

export const list = async (event: H3Event, config: ListConfig) => {
  const db = useDB()

  const { search, page, pageSize } = await getValidatedQuery(event, z.object({
    search: z.string().optional(),
    page: z.coerce.number().default(1),
    pageSize: z.coerce.number().default(10),
  }).parse)

  const qs = []

  if (search && config.searchFields) {
    for (const field of config.searchFields) {
      qs.push(
        ilike(field, `%${search}%`),
      )
    }
  }

  const query = db.select().from(config.table).where(and(...qs))

  if (config.orderBy)
    query.orderBy(config.orderBy)

  if (config.noPagination) {
    const results = await query
    return results
  }

  const results = await query.limit(pageSize).offset((page - 1) * pageSize)

  const totalCount = await db.select({ count: sql<number>`count(*)` }).from(config.table).where(and(...qs))

  return {
    pagination: {
      page,
      pages: Math.ceil(totalCount[0]!.count / pageSize),
      total: Number(totalCount[0]!.count),
      size: pageSize,
    },
    results,
  }
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

type ListAndCreateRouterConfig = {
  table: PgTable
  list: {
    searchFields: PgColumn[]
    orderBy: PgColumn
  }
  create: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createSchema: ZodObject<any>
  }
  includeNoPaginationListRoute?: boolean
}

export const listAndCreateRouter = (config: ListAndCreateRouterConfig) => {
  const router = createRouter()

  router.get('/', defineEventHandler(async (event: H3Event,
  ) => await list(event, {
    table: config.table,
    ...config.list,
  })),
  )

  if (config.includeNoPaginationListRoute) {
    router.get('/all', defineEventHandler(async (event: H3Event,
    ) => await list(event, {
      table: config.table,
      ...config.list,
      noPagination: true,
    })),
    )
  }

  router.post('/', defineEventHandler(async (event: H3Event,
  ) => await create(event, {
    table: config.table,
    ...config.create,
  })),
  )

  return router
}

type RetrieveUpdateRemoveRouterConfig = {
  table: PgTable
  update: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateSchema: ZodObject<any>
  }
}

export const retrieveUpdateRemoveRouter = (config: RetrieveUpdateRemoveRouterConfig) => {
  const router = createRouter()

  router.get('/:id', defineEventHandler(async (event: H3Event,
  ) => await retrieve(event, {
    table: config.table,
  })),
  )

  router.put('/:id', defineEventHandler(async (event: H3Event,
  ) => await update(event, {
    table: config.table,
    ...config.update,
  })),
  )

  router.delete('/:id', defineEventHandler(async (event: H3Event,
  ) => await remove(event, {
    table: config.table,
  })),
  )

  return router
}

type CrudConfig = {
  table: PgTable
  prefix?: string
  router?: ReturnType<typeof createRouter>
  list: {
    searchFields: PgColumn[]
    orderBy: PgColumn
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createSchema?: ZodObject<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateSchema?: ZodObject<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createAndUpdateSchema?: ZodObject<any>
  includeNoPaginationListRoute?: boolean
}

export const crudRouter = (config: CrudConfig) => {
  let router
  if (config.router) {
    router = config.router
  }
  else {
    router = createRouter()
  }

  if (!config.prefix)
    config.prefix = ''

  router.get(config.prefix + '/', defineEventHandler(async (event: H3Event,
  ) => await list(event, {
    table: config.table,
    ...config.list,
  })),
  )

  if (config.includeNoPaginationListRoute) {
    router.get(config.prefix + '/all', defineEventHandler(async (event: H3Event,
    ) => await list(event, {
      table: config.table,
      ...config.list,
      noPagination: true,
    })),
    )
  }

  router.post(config.prefix + '/', defineEventHandler(async (event: H3Event,
  ) => await create(event, {
    table: config.table,
    createSchema: config.createSchema || config.createAndUpdateSchema || z.object({}),
  })),
  )

  router.get(config.prefix + '/:id', defineEventHandler(async (event: H3Event,
  ) => await retrieve(event, {
    table: config.table,
  })),
  )

  router.patch(config.prefix + '/:id', defineEventHandler(async (event: H3Event,
  ) => await update(event, {
    table: config.table,
    updateSchema: config.updateSchema || config.createAndUpdateSchema || z.object({}),
  })),
  )

  router.delete(config.prefix + '/:id', defineEventHandler(async (event: H3Event,
  ) => await remove(event, {
    table: config.table,
  })),
  )
  return router
}

type CrudRoutersConfig = {
  table: PgTable
  prefix?: string
  list: {
    searchFields: PgColumn[]
    orderBy: PgColumn
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createSchema?: ZodObject<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateSchema?: ZodObject<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createAndUpdateSchema?: ZodObject<any>
  includeNoPaginationListRoute?: boolean
}

export const crudRouters = (configs: CrudRoutersConfig[]) => {
  let router = createRouter()
  for (const config of configs) {
    router = crudRouter({ ...config, router })
  }
  return router
}
