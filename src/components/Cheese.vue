<template>
  <div class="relative rounded-xl overflow-auto p-8">
    <div
      class="overflow-hidden relative max-w-sm mx-auto bg-white shadow-lg ring-1 ring-black/5 rounded-xl flex items-center gap-6"
    >
      <img class="absolute -left-2 w-24 h-24 rounded-full shadow-lg" :src="`${thumbnail}`" />
      <div class="flex flex-col py-5 pl-24 pr-8">
        <a class="text-gray-900 text-lg" :href="`${link}`">{{ label }}</a>
        <span class="text-gray-500 text-sm">{{ source }}</span>
        <div class="flex flex-row place-items-center gap-1">
          <div v-if="country_thumbnail != undefined">
            <img class="w-4 h-4" :src="`${country_thumbnail}`" />
          </div>
          <div>
            <a class="text-gray-500 text-sm" :href="`${country_link}`">{{ country_name }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps({
  link: String,
  label: String,
  country_name: String,
  country_link: String,
  country_thumbnail: String,
  source: String,
  thumbnail: String,
})
</script>
