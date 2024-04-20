<script setup lang="ts">
import type { z } from 'zod'
import { createTournamentSchema } from '~/db/zod'

type CreateTournamentSchema = z.infer<typeof createTournamentSchema>

const { fields, submitForm, closeForm, isFormSubmitting, editingId } = await useForm<CreateTournamentSchema>('/api/bo/tournament')
</script>

<template>
  <UForm
    :schema="createTournamentSchema"
    :state="fields"
    class="flex flex-col gap-3 md:gap-5"
    @submit="submitForm"
  >
    <UFormGroup
      label="Title"
      name="title"
    >
      <UInput
        v-model="fields.title"
        @change="() => {
          if (!editingId) {
            fields.slug = slugifyString(fields.title)
          }
        }"
      />
    </UFormGroup>
    <UFormGroup
      label="Slug"
      name="slug"
    >
      <UInput v-model="fields.slug" />
    </UFormGroup>
    <UFormGroup
      label="Type"
      name="type"
    >
      <USelect
        v-model="fields.type"
        :options="[
          { label: 'ODI', value: 'odi' },
          { label: 'T20I', value: 't20i' },
          { label: 'OD', value: 'od' },
          { label: 'T20', value: 't20' },
        ]"
      />
    </UFormGroup>
    <UFormGroup
      label="Details"
      name="details"
    >
      <UTextarea v-model="fields.details" />
    </UFormGroup>
    <UFormGroup
      label="Start Date"
      name="startDate"
    >
      <UInput
        v-model="fields.startDate"
        type="date"
      />
    </UFormGroup>
    <UFormGroup
      label="End Date"
      name="endDate"
    >
      <UInput
        v-model="fields.endDate"
        type="date"
      />
    </UFormGroup>
    <div class="flex gap-2">
      <UButton
        type="submit"
        class="w-fit"
        :disabled="isFormSubmitting"
      >
        {{ isFormSubmitting ? '...' : 'Submit' }}
      </UButton>
      <UButton
        type="reset"
        variant="outline"
        class="w-fit"
        @click="closeForm"
      >
        Cancel
      </UButton>
    </div>
  </UForm>
</template>
