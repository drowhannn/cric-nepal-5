<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const columns = [
  {
    key: 'fullName',
    label: 'Full Name',
  },
  {
    key: 'type',
    label: 'Type',
  },
  {
    key: 'jerseyNumber',
    label: 'Jersey Number',
  },
  {
    key: 'dateOfBirth',
    label: 'Date of Birth',
  },
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl">
        Player
      </h1>
      <UButton
        to="/admin/player/add"
        icon="i-mdi-plus"
        size="xl"
        :trailing="false"
      >
        Add player
      </UButton>
    </div>
    <ATable
      endpoint="/api/bo/player"
      :columns="columns"
      class="mt-4 w-full"
      :search="true"
    />
  </div>
</template>
