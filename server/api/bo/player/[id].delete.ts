import { player } from '~/db/schema'

export default defineEventHandler(async (event) => {
  return remove(
    event,
    {
      table: player,
    },
  )
})
