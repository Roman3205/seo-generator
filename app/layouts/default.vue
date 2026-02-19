<template>
  <div class="flex flex-col min-h-screen">
    <header v-if="!route.path.startsWith('/auth')" class="flex relative z-20 justify-between p-4 border-b-1 dark:border-slate-700 border-slate-200">
 <NuxtLink to="/">
  <div class="flex items-center">
    <NuxtImg src="/icon.png" format="webp" width="60" height="60" class="hov-item" />
   <h3 class="font-bold text-2xl">SeoGen</h3>
 </div>
 </NuxtLink>
 <div class="flex gap-4 items-center">
<UDropdownMenu
    arrow
    size="xl"
    :items="items"
    v-if="data?.user"
  >
  <template #profile>
<div class="text-left">
  <p>Signed in as</p>
    <p class="truncate font-medium text-gray-900 dark:text-white">
      {{ data?.user?.email }}
    </p>
</div>
</template>
<NuxtImg v-if="data?.user?.image" :src="data.user.image" width="40" class="hov-item rounded-full" />
<UIcon v-else name="i-lucide-user" class="size-6 hov-item rounded-full" />
  </UDropdownMenu>
  <UButton v-else color="info" variant="subtle" class="hov-item" size="xl" @click="navigateTo('/auth/login')">Sign in</UButton>
  <ColorSwitcher />
 </div>
    </header>
   <main class="flex-1 flex relative z-0">
      <AppBackground/>
     <slot />
   </main>
   <footer class="flex flex-row-reverse justify-center items-center gap-3 p-4 font-semibold">
   <NuxtLink to="https://github.com/Roman3205" external>
    <UIcon name="octicon:mark-github-16" size="25" class="hov-item hover:opacity-70" />
   </NuxtLink>

    <span>
      Made by Roman3205
    </span></footer>
  </div>
</template>

<script lang="ts" setup>
const {signOut, signIn, data, status} = useAuth()
const route = useRoute()

const items = ref([
  [
    {
      label: "Profile",
      slot: "profile",
      disabled: status.value === 'unauthenticated',
    },
  ],
  [
    {
      label: 'Sign Out',
      icon: "i-heroicons-arrow-left-on-rectangle",
      async onSelect() {
        await signOut()
      },
    },
  ],
]);
</script>

<style>

</style>