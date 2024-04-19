<script setup lang="ts">
const {
  label,
  name,
  placeholder,
  valueAttribute = 'id',
  optionAttribute = 'name',
  multiple = false,
  endpoint,
  searchable = true,
  options,
  selectClass,
  disabled = false,
  size,
} = defineProps<{
  label?: string
  name?: string
  placeholder?: string
  endpoint?: string
  valueAttribute?: string
  optionAttribute?: string
  multiple?: boolean
  searchable?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: Record<string, any>[] | string[]
  selectClass?: string
  size?: string
  disabled?: boolean
}>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const modelValue = defineModel<any>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchedOptions = ref<Record<string, any>[] | string[] | null>(null)

watch(() => fetchedOptions.value, (value) => {
  if (value && modelValue.value && multiple) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredValue = modelValue.value.filter((modelValueItem: any) => {
      // @ts-expect-error fix this later
      return value.some(option => option[valueAttribute] === modelValueItem)
    })
    if (modelValue.value.length !== filteredValue.length) modelValue.value = filteredValue
  }
})

watchEffect(() => {
  if (endpoint) {
    fetch(endpoint)
      .then(response => response.json())
      .then((data) => {
        fetchedOptions.value = data
      })
  }
})

watchEffect(() => {
  if (options)
    fetchedOptions.value = options
})
</script>

<template>
  <UFormGroup
    :label="label"
    :name="name"
  >
    <!-- @vue-expect-error -->
    <USelectMenu
      v-model="modelValue"
      :searchable="searchable"
      :options="fetchedOptions || []"
      :placeholder="placeholder"
      :multiple="multiple"
      :value-attribute="valueAttribute"
      :option-attribute="optionAttribute"
      :select-class="selectClass"
      :size="size"
      :disabled="disabled"
    >
      <template #label>
        <div class="h-full w-full overflow-hidden text-ellipsis">
          {{
            modelValue
              && (multiple ? (optionAttribute ? fetchedOptions?.filter((option) =>
                // @ts-expect-error fix this later
                modelValue.includes(option[valueAttribute]),
              // @ts-expect-error fix this later
              ).map((option) => option[optionAttribute]).join(', ')
                : fetchedOptions?.filter((option) =>
                  modelValue.includes(option),
                ).join(', ')
                // @ts-expect-error fix this later
              ) : (optionAttribute ? fetchedOptions?.find((option) => option[valueAttribute]
                === modelValue)?.[optionAttribute] : fetchedOptions?.find((option) => option === modelValue)))
              || placeholder
          }}
        </div>
      </template>
    </USelectMenu>
  </UFormGroup>
</template>
