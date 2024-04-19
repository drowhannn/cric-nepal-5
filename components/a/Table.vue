<script setup lang="ts" generic="F extends Record<string, any>">
import { joinURL } from 'ufo'

import { z } from 'zod'

const {
  endpoint,
  columns,
  search = true,
  filters = [],
  showEditButton = true,
  showDeleteButton = true,
  extraActions = [],
} = defineProps<{
  endpoint: string
  columns: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
    key: string
    sortable?: boolean | undefined
    direction?: 'desc' | 'asc' | undefined
    class?: string | undefined
  }[]
  search?: boolean | {
    placeholder: string
  }
  filters?: {
    data?: F[]
    endpoint?: string
    optionAttribute?: keyof F & string
    valueAttribute?: keyof F & string
    key: string
    placeholder: string
  }[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showEditButton?: boolean | ((...args: any) => boolean)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showDeleteButton?: boolean | ((...args: any) => boolean)
  extraActions?: {
    variant: 'outline' | 'solid'
    icon: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick: (...args: any) => void
  }[]
}>()

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any): void
}>()

const route = useRoute()
const router = useRouter()

const params = route.params as {
  page?: string
}

const page = ref(Number(params.page) || 1)

const triggerFilter = ref(true)

const tableColumns = computed(() => {
  const tColumns = [...columns]
  if (
    (typeof showEditButton === 'function') || showEditButton || (typeof showDeleteButton === 'function') || showDeleteButton || extraActions.length > 0
  ) {
    tColumns.push({
      key: 'actions',
      label: 'Actions',
      class: 'w-1/6',
    })
  }
  return tColumns
})

const filterFormSchema = z.object({
  search: z.string().optional(),
  ...Object.fromEntries(
    filters.map(filter => [
      filter.key,
      z.string().or(z.number()).optional(),
    ]),
  ),
})

const filterFormState: Ref<{
  search: string
  [key: typeof filters[number]['key']]: string
}> = ref({
  search: (route.query.search || '') as string,
  ...Object.fromEntries(
    filters.map(filter => [
      filter.key,
      (route.query[filter.key] || '') as string,
    ]),
  ),
})
const { data, refresh, pending } = useFetch<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  results: Record<string, any>[]
  pagination: {
    total: number
    page: number
    size: number
    pages: number
  }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} | Record<string, any>[]>(`${endpoint}`, {
  query: {
    page,
  },
  watch: [triggerFilter],
  onRequest({ options }) {
    options.query = {
      ...options.query,
      ...filterFormState.value,
    }
    router.replace({
      path: route.fullPath,
      query: {
        page: page.value === 1 ? undefined : page.value,
        ...Object.fromEntries(
          Object.entries(filterFormState.value).filter(([, value]) => value),
        ),
      },
    })
  },
})

async function filterData() {
  page.value = 1
  triggerFilter.value = !triggerFilter.value
}

async function reset() {
  filterFormState.value = {
    search: '',
  }
  filterData()
}
</script>

<template>
  <div class="w-fit">
    <UForm
      v-if="search"
      :schema="filterFormSchema"
      :state="filterFormState"
      class="flex gap-2 items-center flex-wrap md:flex-nowrap"
      @submit="filterData"
      @reset="reset"
    >
      <div class="flex flex-col flex-1 gap-4 md:flex-row">
        <UInput
          v-if="search"
          v-model="filterFormState.search"
          class="min-w-[150px] flex-1"
          :placeholder="search === true ? 'Search...' : search.placeholder"
          size="xl"
        />
        <ASelectMenu
          v-for="filter in filters"
          :key="filter.key"
          v-model="(filterFormState[filter.key])"
          class="min-w-[200px]"
          size="xl"
          :name="filter.key"
          :placeholder="filter.placeholder"
          :options="filter.data"
          :endpoint="filter.endpoint"
          :value-attribute="filter.valueAttribute"
          :option-attribute="filter.optionAttribute"
        />
      </div>
      <div class="flex justify-end gap-2">
        <UButton
          type="submit"
          size="xl"
        >
          Filter
        </UButton>
        <UButton
          type="reset"
          variant="outline"
          size="xl"
        >
          Reset
        </UButton>
      </div>
    </UForm>
    <UTable
      :rows="Array.isArray(data) ? data : data?.results"
      class="mt-2"
      :columns="tableColumns"
      :loading="pending"
    >
      <template
        v-for="slotName in Object.keys($slots)"
        #[slotName]="{ row }"
      >
        <slot
          :name="slotName"
          :row="row"
        />
      </template>
      <template #actions-data="{ row }">
        <div class="flex gap-2">
          <UButton
            v-if="typeof showEditButton === 'function' ? showEditButton(row) : showEditButton"
            :to="joinURL(route.fullPath.split('?')[0], `/${row.id}/edit`)"
            icon="i-mdi-pencil"
          />

          <UButton
            v-if="typeof showDeleteButton === 'function' ? showDeleteButton(row) : showDeleteButton"
            variant="outline"
            icon="i-mdi-trash-can"
            @click="() => {
              useCustomModal().confirmAction(
                'Delete',
                'Are you sure you want to delete?',
              ).then(async () => {
                const { error } = await useFetch(joinURL(endpoint.split('?')[0], row.id.toString()), {
                  method: 'DELETE',
                })
                if (!error.value) {
                  useToast().add({
                    title: 'Deleted Successfully',
                    color: 'green',
                    ui: {
                      background: 'bg-green-500',
                    },
                  })
                  refresh()
                }
                else {
                  useToast().add({
                    title: error.value.data.message || 'Something went wrong',
                    color: 'red',
                    ui: {
                      background: 'bg-red-500',
                    },
                  })
                }
              })
            } "
          />

          <UButton
            v-for="action, index in extraActions"
            :key="`table-extra-action-${index}`"
            :variant="action.variant"
            :icon="action.icon"
            @click="action.onClick(row, refresh, emit)"
          />
        </div>
      </template>
    </UTable>
    <UPagination
      v-if="data && !Array.isArray(data) && data.pagination.total"
      v-model="page"
      class="mt-2 justify-end"
      :total="data?.pagination.total"
      :page-count="data.pagination.size"
    />
  </div>
</template>
