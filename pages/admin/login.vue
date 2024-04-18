<script setup lang="ts">
import type { z } from 'zod'
import { signInSchema } from '~/db/zod'

definePageMeta({
  layout: false,
})

type SignInSchema = z.infer<typeof signInSchema>

const body: SignInSchema = {
  email: '',
  password: '',
}

const isFormSubmitting = ref(false)

const { fetch } = useUserSession()

const router = useRouter()
const toast = useToast()

async function login() {
  isFormSubmitting.value = true
  const { data: response } = await useFetch('/auth/signin', {
    method: 'POST',
    body,
  })
  if (response.value?.success) {
    toast.add({
      title: 'Logged in successfully',
      color: 'green',
      ui: {
        background: 'bg-green-500',
      },
    })
    await fetch()
    router.push('/admin')
  }
  else {
    toast.add({
      title: 'Invalid credentials',
      color: 'red',
      ui: {
        background: 'bg-red-500',
      },
    })
  }
  isFormSubmitting.value = false
}
</script>

<template>
  <div class="grid min-h-[100vh] w-full  place-content-center bg-gray-200 dark:bg-gray-800">
    <UForm
      :schema="signInSchema"
      :state="body"
      class="flex flex-col gap-4 min-w-96 border bg-gray-100 dark:bg-gray-900 p-16"
      @submit="login"
    >
      <UFormGroup
        label="Email"
        name="email"
        class="grid-cols-3"
      >
        <UInput v-model="body.email" />
      </UFormGroup>
      <UFormGroup
        label="Password"
        name="password"
        class="grid-cols-3"
      >
        <UInput
          v-model="body.password"
          type="password"
        />
      </UFormGroup>
      <UButton
        :disabled="isFormSubmitting"
        type="submit"
      >
        <p class="w-full text-center">
          <span>{{ isFormSubmitting ? '...' : 'Login' }}</span>
        </p>
      </UButton>
    </UForm>
  </div>
</template>
