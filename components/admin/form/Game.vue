<script setup lang="ts">
import type { z } from 'zod'
import { createGameSchema } from '~/db/zod'

type createGameSchema = z.infer<typeof createGameSchema>

const { fields, submitForm, closeForm, isFormSubmitting, editingId } = await useForm<createGameSchema>('/api/bo/game')
</script>

<template>
  <UForm
    :schema="createGameSchema"
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
      <UInput
        v-model="fields.slug"
      />
    </UFormGroup>
    <UFormGroup
      label="Start Date Time"
      name="startTime"
    >
      <UInput
        v-model="fields.startTime"
        type="date"
      />
    </UFormGroup>
    <UFormGroup
      label="End Date Time"
      name="endTime"
    >
      <UInput
        v-model="fields.endTime"
        type="date"
      />
    </UFormGroup>
    <UFormGroup
      label="Venue"
      name="venue"
    >
      <UInput
        v-model="fields.venue"
      />
    </UFormGroup>
    <ASelectMenu
      v-model="fields.tournamentId"
      label="Tournament"
      name="tournamentId"
      option-attribute="title"
      value-attribute="id"
      placeholder="Tournament"
      endpoint="/api/bo/tournament/all"
    />
    <ASelectMenu
      v-model="fields.opponentId"
      label="Opponent"
      name="opponentId"
      placeholder="Opponent"
      value-attribute="id"
      option-attribute="name"
      endpoint="/api/bo/opponent/all"
    />
    <ASelectMenu
      v-model="fields.manOfTheMatchPlayerId"
      label="Man Of The Match Player"
      value-attribute="id"
      option-attribute="fullName"
      name="manOfTheMatchPlayerId"
      placeholder="Man Of The Match Player"
      endpoint="/api/bo/player/all"
    />
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
