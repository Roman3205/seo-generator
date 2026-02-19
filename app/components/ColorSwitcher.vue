<template>
  <ClientOnly v-if="!colorMode?.forced">
    <div class="flex justify-center items-center hover:cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-700 rounded-md duration-300 p-2 transition">
    <UIcon class="size-6" :name="colorMode.value == 'light' ? 'i-heroicons-moon' : 'i-heroicons-sun'" @click="changeColor()" />
  </div>
  <template #fallback>
    <div class="size-10"></div>
  </template>
  </ClientOnly>
</template>

<script lang="ts" setup>
const colorMode = useColorMode()
const changeColor = () => {
    if (colorMode.value == 'light') colorMode.preference = 'dark'
    else colorMode.preference = 'light'
}
</script>

<style>

</style>