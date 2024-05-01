import type { SQL } from 'drizzle-orm'
import { and, eq, getTableColumns, ilike, sql } from 'drizzle-orm'
import { getTableConfig, type PgColumn, type PgTable } from 'drizzle-orm/pg-core'
import type { H3Event } from 'h3'
import { z, type ZodObject } from 'zod'

import { createRouter, defineEventHandler } from 'h3'

export type UpdateWhereClause = (whereClause: SQL<unknown>[], routeQuery: Record<string, unknown>) => void

type ListConfig = {
  table: PgTable
  searchFields?: PgColumn[]
  orderBy?: PgColumn
  excludeFields?: PgColumn[]
  noPagination?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routeQuerySchema?: z.ZodObject<any>
  updateWhereClause?: UpdateWhereClause
}

const listBaseQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(10),
})

export const list = async (event: H3Event, config: ListConfig) => {
  const db = useDB()

  const routeQuery = await getValidatedQuery(event, z.object(
    {
      ...listBaseQuerySchema.shape,
      ...(config.routeQuerySchema ? config.routeQuerySchema.shape : {}),
    },
  ).parse)

  const whereClause: SQL<unknown>[] = []

  if (routeQuery.search && config.searchFields) {
    for (const field of config.searchFields) {
      whereClause.push(
        ilike(field, `%${routeQuery.search}%`),
      )
    }
  }

  if (config.updateWhereClause) {
    config.updateWhereClause(whereClause, routeQuery)
  }

  let queryset
  if (config.excludeFields && config.excludeFields.length) {
    const columns = getTableColumns(config.table)
    const includedColumns = Object.fromEntries(
      // @ts-expect-error - what the heck
      Object.entries(columns).filter(([_, value]: [string, PgColumn]) => !(config.excludeFields.includes(value))),
    )
    queryset = db.select({ ...includedColumns }).from(config.table)
  }
  else {
    queryset = db.select().from(config.table)
  }
  queryset = queryset.where(and(...whereClause))

  if (config.orderBy)
    queryset = queryset.orderBy(config.orderBy)

  if (config.noPagination) {
    const results = await queryset
    return results
  }

  const results = await queryset.limit(routeQuery.pageSize).offset((routeQuery.page - 1) * routeQuery.pageSize)

  const totalCount = await db.select({ count: sql<number>`count(*)` }).from(config.table).where(and(...whereClause))

  return {
    pagination: {
      page: routeQuery.page,
      pages: Math.ceil(totalCount[0]!.count / routeQuery.pageSize),
      total: Number(totalCount[0]!.count),
      size: routeQuery.pageSize,
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
  excludeFields?: PgColumn[]
}

export const retrieve = async (event: H3Event, config: RetrieveConfig) => {
  const db = useDB()
  const { id } = await getValidatedRouterParams(event, z.object({ id: z.coerce.number() }).parse)
  let query
  if (config.excludeFields && config.excludeFields.length) {
    const columns = getTableColumns(config.table)
    const includedColumns = Object.fromEntries(
      // @ts-expect-error - what the heck
      Object.entries(columns).filter(([_, value]: [string, PgColumn]) => !(config.excludeFields.includes(value))),
    )
    query = db.select({ ...includedColumns }).from(config.table)
  }
  else {
    query = db.select().from(config.table)
  }
  //   @ts-expect-error - Assume id column exists
  query = query.where(eq(config.table.id, id))
  const [result] = await query
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

// type ListAndCreateRouterConfig = {
//   table: PgTable
//   list: {
//     searchFields: PgColumn[]
//     orderBy: PgColumn
//   }
//   create: {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     createSchema: ZodObject<any>
//   }
//   includeNoPaginationListRoute?: boolean
// }

// export const listAndCreateRouter = (config: ListAndCreateRouterConfig) => {
//   const router = createRouter()

//   router.get('/', defineEventHandler(async (event: H3Event,
//   ) => await list(event, {
//     table: config.table,
//     ...config.list,
//   })),
//   )

//   if (config.includeNoPaginationListRoute) {
//     router.get('/all', defineEventHandler(async (event: H3Event,
//     ) => await list(event, {
//       table: config.table,
//       ...config.list,
//       noPagination: true,
//     })),
//     )
//   }

//   router.post('/', defineEventHandler(async (event: H3Event,
//   ) => await create(event, {
//     table: config.table,
//     ...config.create,
//   })),
//   )

//   return router
// }

// type RetrieveUpdateRemoveRouterConfig = {
//   table: PgTable
//   update: {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     updateSchema: ZodObject<any>
//   }
// }

// export const retrieveUpdateRemoveRouter = (config: RetrieveUpdateRemoveRouterConfig) => {
//   const router = createRouter()

//   router.get('/:id', defineEventHandler(async (event: H3Event,
//   ) => await retrieve(event, {
//     table: config.table,
//   })),
//   )

//   router.put('/:id', defineEventHandler(async (event: H3Event,
//   ) => await update(event, {
//     table: config.table,
//     ...config.update,
//   })),
//   )

//   router.delete('/:id', defineEventHandler(async (event: H3Event,
//   ) => await remove(event, {
//     table: config.table,
//   })),
//   )

//   return router
// }

type CrudConfig = {
  table: PgTable
  prefix?: string
  router?: ReturnType<typeof createRouter>
  searchFields?: PgColumn[]
  orderBy?: PgColumn
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createSchema?: ZodObject<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateSchema?: ZodObject<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createAndUpdateSchema?: ZodObject<any>
  includeNoPaginationListRoute?: boolean
  noPaginationListConfig?: {
    searchFields?: PgColumn[]
    orderBy?: PgColumn
  }
  excludeFields?: PgColumn[]
  listExcludeFields?: PgColumn[]
  retrieveExcludeFields?: PgColumn[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listRouteQuerySchema?: z.ZodObject<any>
  updateWhereClause?: UpdateWhereClause
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
    searchFields: config.searchFields,
    orderBy: config.orderBy,
    excludeFields: config.listExcludeFields || config.excludeFields,
    routeQuerySchema: config.listRouteQuerySchema,
    updateWhereClause: config.updateWhereClause,
  })),
  )

  if (config.includeNoPaginationListRoute) {
    router.get(config.prefix + '/all', defineEventHandler(async (event: H3Event,
    ) => await list(event, {
      table: config.table,
      searchFields: config.noPaginationListConfig?.searchFields || config.searchFields,
      orderBy: config.noPaginationListConfig?.orderBy || config.orderBy,
      noPagination: true,
      excludeFields: config.listExcludeFields || config.excludeFields,
      routeQuerySchema: config.listRouteQuerySchema,
      updateWhereClause: config.updateWhereClause,
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
    excludeFields: config.retrieveExcludeFields || config.excludeFields,
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
  searchFields?: PgColumn[]
  orderBy?: PgColumn
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createSchema?: ZodObject<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateSchema?: ZodObject<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createAndUpdateSchema?: ZodObject<any>
  includeNoPaginationListRoute?: boolean
  noPaginationListConfig?: {
    searchFields?: PgColumn[]
    orderBy?: PgColumn
  }
  excludeFields?: PgColumn[]
  listExcludeFields?: PgColumn[]
  retrieveExcludeFields?: PgColumn[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listRouteQuerySchema?: z.ZodObject<any>
  updateWhereClause?: UpdateWhereClause
}

export const crudRouters = (configs: CrudRoutersConfig[]) => {
  let router = createRouter()
  for (const config of configs) {
    if (!config.prefix) {
      const { name } = getTableConfig(config.table)
      config.prefix = `/${name}`
    }
    console.log('config.prefix', config.prefix)
    router = crudRouter({ ...config, router })
  }
  return router
}
