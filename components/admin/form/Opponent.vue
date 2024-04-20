<script setup lang="ts">
import type { z } from 'zod'
import { createOpponentSchema } from '~/db/zod'

type CreateOpponentSchema = z.infer<typeof createOpponentSchema>

const { fields, submitForm, closeForm, isFormSubmitting, editingId } = await useForm<CreateOpponentSchema>('/api/bo/opponent')
</script>

<template>
  <UForm
    :schema="createOpponentSchema"
    :state="fields"
    class="flex flex-col gap-3 md:gap-5"
    @submit="submitForm"
  >
    <UFormGroup
      label="Name"
      name="name"
    >
      <UInput
        v-model="fields.name"
        @change="() => {
          if (!editingId) {
            fields.slug = slugifyString(fields.name)
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
          { label: 'Country', value: 'country' },
          { label: 'Club', value: 'club' },
          { label: 'Team', value: 'team' },
          { label: 'Country A', value: 'country-a' },
          { label: 'Country B', value: 'country-b' },

        ]"
      />
    </UFormGroup>
    <UFormGroup
      label="Logo"
      name="logo"
    >
      <UInput v-model="fields.logo" />
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
