<template>
  <div class="w-full flex flex-col p-8 gap-4 items-center">
    <UCard class="h-fit w-full lg:w-2/3" v-for="result in data" :key="result.id">
        <div class="flex flex-col lg:flex-row justify-between items-center">
            <h3 class="text-xl font-semibold">{{ result.title }}</h3>
            <NuxtTime class="bg-slate-50 p-2 rounded-md" :datetime="result.createdAt" year="numeric" month="long" day="numeric" hour="2-digit" minute="2-digit"></NuxtTime>
            <div class="gap-3 flex flex-row-reverse mt-4 lg:mt-0">
                <UButton :disabled="blockButton" color="error" class="hov-item" variant="subtle" size="xl" @click="deleteResult(result.id)"><UIcon name="i-lucide-trash" /></UButton>
                <UButton color="info" class="hov-item px-20" variant="subtle" size="xl" @click="navigateTo({name: 'seo-id', params: {id: result.id}})">View</UButton>
            </div>
        </div>
    </UCard>
    <p v-if="data?.length == 0" class="font-semibold text-xl">You have no seo result generated yet</p>
  </div>
</template>

<script lang="ts" setup>
const {data, refresh} = await useFetch(`/api/seo/result/all`, {method: 'get'})

if (!data.value) {
    throw createError({
        status: 400,
        message: "Result not found",
    });
}
const blockButton = ref(false)

const deleteResult = async (id: string) => {
    try {
        blockButton.value = true;

        await $fetch(`/api/seo/result/${id}`, {
            method: 'delete'
        })

        await refresh()

        return useToast().add({
            title: "Success",
            description: "You deleted the seo result",
            timeout: 2000,
        });
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

<style>

</style>