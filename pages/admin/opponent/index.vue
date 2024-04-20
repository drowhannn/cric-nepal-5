<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const columns = [
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'type',
    label: 'Type',
  },
  {
    key: 'logo',
    label: 'Logo',
  },
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl">
        Opponent
      </h1>
      <UButton
        to="/admin/opponent/add"
        icon="i-mdi-plus"
        size="xl"
        :trailing="false"
      >
        Add opponent
      </UButton>
    </div>
    <ATable
      endpoint="/api/bo/opponent"
      :columns="columns"
      class="mt-4 w-full"
      :search="true"
    />
  </div>
</template>
