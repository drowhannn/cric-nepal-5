import { joinURL, withoutTrailingSlash } from 'ufo'
import z from 'zod'

import type { ComponentInternalInstance } from '@vue/runtime-dom'

interface UseFormConfig {
  redirect?: boolean
  successMessage?: string
  editingId?: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function useForm<T extends Record<string, any>>(endpoint: string, config: UseFormConfig = {
  redirect: true,
}) {
  const url = ref(endpoint)
  const router = useRouter()
  const route = useRoute()
  const toast = useToast()

  const root:
  | (ComponentInternalInstance & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setupContext?: { emit: (signal: string, ...rest: any) => void }
  })
  | null = getCurrentInstance()
  const formContext = root?.setupContext
  const emit = formContext?.emit

  const { id } = route.params as {
    id: string | undefined
  }

  const isFormSubmitting = ref(false)

  const expectedErrorSchema = z.object({
    url: z.string(),
    statusCode: z.number(),
    statusMessage: z.string(),
    message: z.string(),
    stack: z.string(),
  },
  )

  const editingId = config.editingId ?? (id && config.redirect && withoutTrailingSlash(route.fullPath).endsWith('/edit') ? id : null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function parseError(error: any) {
    if (error && typeof error === 'object' && error.data) {
      const errorValue = expectedErrorSchema.safeParse(error.data)
      if (errorValue.success && errorValue.data) {
        const message = errorValue.data.message
        const url = errorValue.data.url

        const match = message.match(/duplicate key value violates unique constraint "(.*?)"/)
        if (match && match[1]) {
          const _modelName = withoutTrailingSlash(url).split('/')
          let modelName = editingId ? _modelName[_modelName.length - 2] : _modelName[_modelName.length - 1]
          modelName = `${modelName.replace('-', '_')}s`
          const columnNameMatch = match[1].match(new RegExp(`${modelName}_(.*?)_unique`))

          if (columnNameMatch && columnNameMatch[1]) {
            const columnName = columnNameMatch[1]
            return `Duplicate ${columnName}.`
          }
          else {
            modelName = modelName.slice(0, -1)

            const columnNameMatch2 = match[1].match(new RegExp(`${modelName}_(.*?)_unique`))
            if (columnNameMatch2 && columnNameMatch2[1]) {
              const columnName = columnNameMatch2[1]
              return `Duplicate ${columnName}.`
            }
          }
        }
      }
    }

    return 'Something went wrong.'
  }

  if (editingId)
    url.value = joinURL(endpoint, editingId.toString())

  async function fetchInitialData() {
    const { data: response } = await useFetch(url.value)

    return response
  }

  const fields = (editingId ? await fetchInitialData() : ref({})) as Ref<T>

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function closeForm(data: any | undefined = undefined) {
    if (config.redirect) {
      const url = withoutTrailingSlash(route.fullPath)
      const parts = url.split('/')
      const poppedPart = parts.pop()
      if (poppedPart === 'edit')
        parts.pop()
      const strippedUrl = parts.join('/')
      await router.push(strippedUrl)
    }
    else {
      if (data && emit) {
        emit('success', data)
        emit('close')
      }
    }
  }

  async function submitForm() {
    if (isFormSubmitting.value) return
    isFormSubmitting.value = true
    const { data, error } = await useFetch(url.value, {
      method: editingId ? 'PATCH' : 'POST',
      body: { ...fields.value },
    })
    if (error.value) {
      toast.add({
        title: parseError(error.value),
        color: 'red',
        ui: {
          background: 'bg-red-500',
        },
      })
    }
    else {
      await closeForm(data.value)
      toast.add({
        title: config.successMessage ?? (editingId ? 'Updated successfully' : 'Created successfully'),
        color: 'green',
        ui: {
          background: 'bg-green-500',
        },
      })
    }
    isFormSubmitting.value = false
  }

  return {
    fields,
    submitForm,
    closeForm,
    isFormSubmitting,
    editingId,
  }
}
