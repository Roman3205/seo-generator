<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import { loginSchema } from '~~/types/seo-prompt'
const {signIn} = useAuth()

const toast = useToast()
const fields: AuthFormField[] = [{
  name: 'email',
  type: 'email',
  label: 'Email',
  placeholder: 'Enter your email',
  required: true
}, {
  name: 'password',
  label: 'Password',
  type: 'password',
  placeholder: 'Enter your password',
  required: true
}]

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
})

const providers = [{
  label: 'GitHub',
  icon: 'i-simple-icons-github',
  onClick: () => {
    signIn('github', {callbackUrl: '/'})
    toast.add({ title: 'GitHub', description: 'Login with GitHub' })
  }
}]

type Schema = z.output<typeof loginSchema>
const blockButton = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    blockButton.value = true;
    const { error } = await signIn("credentials", {
      email: event.data.email,
      password: event.data.password,
      redirect: false,
    });
    if (error) {
      return useToast().add({
        title: "Error!",
        color: 'error',
        description: error || "Bad auth",
        timeout: 2000,
      });
    }

    useToast().add({
      title: "Success",
      description: "You have entered in your account",
      timeout: 2000,
    });

    // await navigateTo('/')
    return navigateTo('/')
  } catch (e) {
    return useToast().add({
      title: "Error",
      color: 'error',
      description: e.message || "Something went wrong",
      timeout: 2000,
    });
  } finally {
    blockButton.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4 w-full">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="loginSchema"
        :submit="{color: 'info', label: 'Continue', variant: 'subtle', size: 'xl', block: true, disabled: blockButton}"
        title="Welcome!"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields="fields"
        :providers="providers"
        @submit="onSubmit"
      />
    </UPageCard>
  </div>
</template>

