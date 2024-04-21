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
    key: 'venue',
    label: 'Venue',
  },
  {
    key: 'startTime',
    label: 'Start Time',
  },
  {
    key: 'endTime',
    label: 'End Time',
  },
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl">
        Game
      </h1>
      <UButton
        to="/admin/game/add"
        icon="i-mdi-plus"
        size="xl"
        :trailing="false"
      >
        Add game
      </UButton>
    </div>
    <ATable
      endpoint="/api/bo/game"
      :columns="columns"
      class="mt-4 w-full"
      :search="true"
    />
  </div>
</template>
