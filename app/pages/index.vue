<template>
  <div class="flex w-full flex-col gap-10 items-center justify-center p-8 pt-12">
    <UBadge variant="outline" color="neutral" size="lg" leading-icon="i-lucide-sparkle" class="p-2 bg-indigo-500/20 text-indigo-500 font-semibold">AI-Powered SEO Generator</UBadge>
    <h1 class="text-6xl font-bold w-2/3 text-center">🚀 SEO-Генератор: Умный контент для вашего сайта за 2 минут</h1>
    <h3 class="text-xl w-3/5 text-center">
      Создавайте мета-заголовки, описания, ключевые слова и даже контентные блоки — быстро и бесплатно!
    </h3>
    <UCard class="w-2/5 my-10">
      <UForm :schema="schema" :state="state" class="space-y-3 w-full" @submit="onSubmit">
    <UFormField label="Website Title" name="title" required size="xl">
      <UInput v-model="state.title" placeholder="Acme Digital Marketing Agency" class="w-full" />
    </UFormField>
    <UFormField label="Website URL" name="url" size="xl">
      <UInput v-model="state.url" placeholder="www.acme-agency.com" class="w-full" />
    </UFormField>
    <UFormField label="Industry / Theme" name="industry" size="xl" required>
      <USelect v-model="state.industry" selected-icon="i-lucide-check" :items="selectItems" placeholder="Digital Marketing Agency" class="w-full" />
    </UFormField>
    <UFormField label="Target Audience" name="audience" size="xl">
      <UInput v-model="state.audience" placeholder="Small business owners" class="w-full" />
    </UFormField>
    <UFormField label="Main keywords" name="keywords" size="xl">
      <UInput v-model="state.keywords" placeholder="SEO, digital marketing, content creation" class="w-full" />
    </UFormField>
    <UFormField label="Brief Description" name="description" size="xl">
      <UTextarea :autoresize="true" v-model="state.description" :rows="4" :maxrows="4" placeholder="Our agency helps small businesses grow their online presence through effective SEO strategies." class="w-full" />
    </UFormField>

    <UButton type="submit" :disabled="blockButton" size="xl" color="info" class="text-lg hov-item mt-3" block leading-icon="i-lucide-flame">
      Generate seo content
    </UButton>
  </UForm>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const selectItems = [
  'E-commerce / Online Store',
  'Technology / SaaS',
  'Healthcare / Medical',
  'Finance / Banking',
  'Education / E-learning',
  'Real Estate',
  'Travel / Tourism',
  'Food / Restaurant',
  'Fashion / Beauty',
  'Legal Services',
  'Marketing / Agency',
  'Non-profit',
  'Entertainment / Media',
  'Fitness / Wellness',
  'Other'
]
const schema = z.object({
  title: z.string().min(2, 'Must be at least 2 characters'),
  url: z.url().optional(),
  audience: z.string().min(5, 'Must be at least 5 characters').optional(),
  keywords: z.string().min(10, 'Must be at least 10 characters').optional(),
  description: z.string().min(20, 'Must be at least 20 characters').optional(),
  industry: z.string().min(2, 'Must be at least 2 characters')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  title: undefined,
  url: undefined,
  audience: undefined,
  keywords: undefined,
  description: undefined,
  industry: undefined
})

const toast = useToast()
const blockButton = ref(false)
const {status} = useAuth()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    blockButton.value = true;
    if (status.value !== 'authenticated') {
      return navigateTo('/login')
    }
    
    const response = await $fetch('/api/seo/generate', {
      method: 'POST',
      body: event.data
    })

    toast.add({
      title: "Success",
      description: "Seo metadata has been generated!",
      timeout: 2000,
    });
  } catch (e) {
    return toast.add({
      title: "Error",
      description: e.message || "Something went wrong",
      timeout: 2000,
      color: 'error'
    });
  } finally {
    blockButton.value = false;
  }
}
</script>

<style></style>
