<template>
  <div class="relative rounded-xl overflow-auto p-8">
    <div class="overflow-hidden relative max-w-sm mx-auto bg-white shadow-lg ring-1 ring-black/5 rounded-xl flex items-center gap-6">
      <img class="absolute -left-2 w-24 h-24 rounded-full shadow-lg" :src="`${thumbnail}`"/>
      <div class="flex flex-col py-5 pl-24">
          <a class="text-gray-900 text-sm text-lg" :href="`${link}`">{{ label }}</a>
          <span class="text-gray-500 text-sm text-sm">{{ source }}</span>
          <span class="text-gray-500 text-sm text-sm">{{ country }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps({
  link: String,
  label: String,
  country: String,
  source: String,
  thumbnail: String,
})
</script>
