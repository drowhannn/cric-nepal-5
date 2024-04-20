<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const columns = [
  {
    key: 'title',
    label: 'Title',
  },
  {
    key: 'type',
    label: 'Type',
  },
  {
    key: 'startDate',
    label: 'Start Date',
  },
  {
    key: 'endDate',
    label: 'End Date',
  },
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl">
        Tournament
      </h1>
      <UButton
        to="/admin/tournament/add"
        icon="i-mdi-plus"
        size="xl"
        :trailing="false"
      >
        Add tournament
      </UButton>
    </div>
    <ATable
      endpoint="/api/bo/tournament"
      :columns="columns"
      class="mt-4 w-full"
      :search="true"
    />
  </div>
</template>
