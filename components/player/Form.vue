<script setup lang="ts">
import type { z } from 'zod'
import { createPlayerSchema } from '~/db/zod'

type CreatePlayerSchema = z.infer<typeof createPlayerSchema>

const { fields, submitForm, closeForm, isFormSubmitting, editingId } = await useForm<CreatePlayerSchema>('/api/bo/player')
</script>

<template>
  <UForm
    :schema="createPlayerSchema"
    :state="fields"
    class="flex flex-col gap-3 md:gap-5"
    @submit="submitForm"
  >
    <UFormGroup
      label="Full Name"
      name="fullName"
    >
      <UInput
        v-model="fields.fullName"
        @change="() => {
          if (!editingId) {
            fields.slug = slugifyString(fields.fullName)
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
          { label: 'Batsman', value: 'batsman' },
          { label: 'Bowler', value: 'bowler' },
          { label: 'All Rounder', value: 'allrounder' },
          { label: 'Wicket Keeper', value: 'wicketkeeper' },
        ]"
      />
    </UFormGroup>
    <UFormGroup
      label="Jersey Number"
      name="jerseyNumber"
    >
      <UInput v-model="fields.jerseyNumber" />
    </UFormGroup>
    <UFormGroup
      label="Date of Birth"
      name="dateOfBirth"
    >
      <UInput v-model="fields.dateOfBirth" />
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
