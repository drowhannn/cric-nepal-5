<script setup lang="ts">
const {
  title,
  description,
  showButtons = true,
  confirmButtonLabel = 'Confirm',
  cacelButtonLabel = 'Cancel',
  modelValue = false,
  width = 'w-full max-w-[90vw] md:max-w-7xl',
} = defineProps<{
  title: string
  description?: string
  showButtons?: boolean
  confirmButtonLabel?: string
  cacelButtonLabel?: string
  modelValue?: boolean
  width?: string
}>()

const emit = defineEmits<{
  'confirm': []
  'cancel': []
  'update:modelValue': [value: boolean]
}>()

const isOpen = ref(modelValue)

watchEffect(() => {
  isOpen.value = modelValue
})

watch(isOpen, (value) => {
  emit('update:modelValue', value)
})

function close() {
  isOpen.value = false
  emit('cancel')
}

function confirm() {
  isOpen.value = false
  emit('confirm')
}
</script>

<template>
  <div>
    <UModal
      v-model="isOpen"
      prevent-close
      :ui="{
        width,
      }"
    >
      <UCard :ui="{ base: 'min-w-fit', ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              {{ title }}
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="close"
            />
          </div>
        </template>
        <div class="min-w-fit">
          <p v-if="description">
            {{ description }}
          </p>
          <slot />
          <div
            v-if="showButtons"
            class="mt-8 flex justify-between"
          >
            <UButton
              :label="confirmButtonLabel"
              @click="confirm"
            />
            <UButton
              variant="outline"
              color="gray"
              :label="cacelButtonLabel"
              @click="
                close
              "
            />
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>
