<template>
  <div class="flex items-center gap-4 w-full p-8 flex-col">
    <UCard class="h-fit gap-2 lg:w-2/3">
            <UUser
                :ui="{name: 'text-xl font-semibold'}"
                name="Search Preview"
                description="How your page may appear in search results"
                :avatar="{
                icon: 'i-lucide-search'
                }"
            />
        <div class="p-3 rounded-md bg-slate-50 mt-5">
            <UUser
            :ui="{avatar: 'bg-slate-300'}"
                :name="siteUrl(data?.title)"
                :description="`https://${siteUrl(data?.title)} > page`"
                :avatar="{
                icon: 'i-lucide-globe'
                }"
            />
            <div class="flex flex-col gap-1 mt-2">
                <h2 class="text-blue-500 text-xl">{{ data?.metaTitle }}</h2>
                <p class="text-sm font-medium">{{ data?.metaDescription }}</p>
            </div>
            <div class="flex gap-3 mt-3 text-xs">
                <p>Title: <span class="text-green-500 font-bold">{{ data?.metaTitle.length }}</span> chars</p>
                <p>Description <span class="text-green-500 font-bold">{{ data?.metaDescription.length }}</span> chars</p>
            </div>
        </div>
    </UCard>
    <div class="mx-auto flex flex-col lg:flex-row w-full justify-between lg:w-2/3 gap-4">
        <UCard class="h-auto gap-2 lg:w-1/2">
            <UUser
                :ui="{name: 'text-xl font-semibold', avatar: 'bg-purple-300'}"
                name="Meta Title"
                :description="`${data?.metaTitle?.length || 0} characters (ideal: 50-60)`"
                :avatar="{
                icon: 'i-lucide-file'
                }"
            />
            <div class="p-3 rounded-md bg-slate-50 mt-5">
                <p>
                    {{ data?.metaTitle }}
                </p>
            </div>
            <MDC :value="`
                \`\`\`html
                <title>${data?.metaTitle}</title>
            `" />
        </UCard>
        <UCard class="h-auto gap-2 lg:w-1/2">
                <UUser
                :ui="{name: 'text-xl font-semibold' , avatar: 'bg-purple-300'}"
                    name="Meta Description"
                    :description="`${data?.metaDescription?.length || 0} characters (ideal: 150-160)`"
                    :avatar="{
                    icon: 'i-lucide-file'
                    }"
                />
            <div class="p-3 rounded-md bg-slate-50 mt-5">
                <p>
                    {{ data?.metaDescription }}
                </p>
            </div>
            <MDC :value="`
                \`\`\`html
                <description>${data?.metaDescription}</description>
                `" />
        </UCard>
    </div>
    <div class="flex justify-between mx-auto flex-col lg:flex-row w-full lg:w-2/3 gap-4">
        <UCard class="h-auto gap-2 lg:w-1/2">
            <UUser
                :ui="{name: 'text-xl font-semibold', avatar: 'bg-indigo-300'}"
                name="Primary Keywords"
                :avatar="{
                icon: 'i-lucide-square-percent'
                }"
            />
            <div class="flex flex-wrap mt-4 gap-2">
                <UBadge v-for="keyword in data?.primaryKeywords" :key="keyword" variant="outline" color="neutral" size="lg" class="p-2 bg-indigo-500/20 text-indigo-500 w-fit font-semibold">{{ keyword }}</UBadge>
                <MDC
                    :value="`
                    \`\`\`html
            ${(`<meta name='keywords' content='${(data?.primaryKeywords ?? []).join(', ')}' />`)}
                    `"
                />
            </div>
        </UCard>
        <UCard class="h-auto gap-2 lg:w-1/2">
                <UUser
                :ui="{name: 'text-xl font-semibold', avatar: 'bg-teal-300'}"
                    name="Secondary Keywords"
                    :avatar="{
                    icon: 'i-lucide-square-percent'
                    }"
                />
            <div class="flex flex-wrap gap-2 mt-4">
                <UBadge v-for="keyword in data?.secondaryKeywords" :key="keyword" variant="outline" color="neutral" size="lg" class="p-2 bg-teal-500/20 w-fit text-teal-500 font-semibold">{{ keyword }}</UBadge>
                <MDC
                    :value="`
                    \`\`\`html
            ${(`<meta name='keywords' content='${(data?.secondaryKeywords ?? []).join(', ')}' />`)}
                    `"
                />
            </div>
        </UCard>
    </div>
    <UCard class="h-auto gap-2 lg:w-2/3">
            <UUser
                :ui="{name: 'text-xl font-semibold', avatar: 'bg-red-300'}"
                name="Social Media Tags"
                :avatar="{
                icon: 'i-lucide-share',
                }"
            />
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                <div class="p-2 bg-slate-50 rounded-md">
                    <span class="text-sm uppercase">Og title</span>
                    <p class="mt-1">{{ data?.ogTitle }}</p>
                </div>
                <div class="p-2 bg-slate-50 rounded-md">
                    <span class="text-sm uppercase">Og description</span>
                    <p class="mt-1">{{ data?.ogDescription }}</p>
                </div>
                <div class="p-2 bg-slate-50 rounded-md">
                    <span class="text-sm uppercase">Twitter Card</span>
                    <p class="mt-1">{{ data?.twitterDescription }}</p>
                </div>
            </div>
    </UCard>
    <UCard class="h-auto gap-2 lg:w-2/3">
            <UUser
                :ui="{name: 'text-xl font-semibold', avatar: 'bg-blue-300'}"
                name="Heading Suggestions"
                :avatar="{
                icon: 'i-lucide-a-large-small',
                }"
            />
            <div class="flex flex-wrap my-4 gap-2 bg-blue-100 flex-col  p-3 rounded-md">
                <p class="uppercase font-semibold text-blue-400">H1 heading</p>
                <p class="font-semibold">{{ data?.h1Suggestion }}</p>
            </div>
            <div class="flex gap-4 flex-col lg:flex-row">
                <div v-for="(h2, index) in data?.h2Suggestions" :key="h2" class="p-2 bg-slate-50 rounded-md">
                    <span class="text-sm">h2 #{{ index+1 }}</span>
                    <p class="mt-1">{{ h2 }}</p>
                </div>
            </div>
    </UCard>
    <div class="flex justify-between flex-col lg:flex-row lg:w-2/3 gap-4">
        <UCard class="h-auto gap-2 lg:w-1/2">
            <UUser
                :ui="{name: 'text-xl font-semibold' , avatar: 'bg-yellow-300'}"
                name="Schema.org"
                :avatar="{
                icon: 'i-lucide-code'
                }"
            />
            <div class="flex flex-wrap mt-4 gap-2 bg-amber-100 flex-col  p-3 rounded-md">
                <p class="uppercase font-semibold text-amber-400">Recommended type</p>
                <p class="font-semibold">{{ data?.schemaType }}</p>
            </div>
        </UCard>
        <UCard class="h-auto gap-2 lg:w-1/2">
                <UUser
                :ui="{name: 'text-xl font-semibold', avatar: 'bg-green-300'}"
                    name="Seo Tips"
                    :avatar="{
                    icon: 'i-lucide-lightbulb'
                    }"
                />
            <div class="flex flex-wrap gap-2 mt-4">
                <p v-for="tip,index in data?.seoTips" :key="tip" class="p-3 rounded-md bg-green-100 text-green-700">{{index+1}}. {{ tip }}</p>
            </div>
        </UCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()

const {data} = await useFetch(`/api/seo/result/${route.params.id}`, {method: 'get'})

if (!data.value) {
    throw createError({
        status: 404,
        message: "Result not found",
    });
}

const siteUrl = (title) => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '') + '.com';
}
</script>

<style>

</style>