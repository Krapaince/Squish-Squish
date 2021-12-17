<template>
  <div class="relative rounded-xl overflow-auto p-8">
    <div
      class="overflow-hidden relative max-w-sm mx-auto bg-white shadow-lg ring-1 ring-black/5 rounded-xl flex items-center gap-6"
    >
      <div>
        <img v-if="isCheeseThumbnailDefined()" class="w-24 h-24 ml-2 rounded-full shadow-lg" :src="`${thumbnail.toString()}`" />
      </div>
      <div class="flex flex-col py-5 pr-8">
        <a class="text-gray-900 text-lg" :href="`${link.toString()}`">{{ label }}</a>
        <span class="text-gray-500 text-sm">{{ source }}</span>
        <div class="flex flex-row place-items-center gap-1">
          <div v-if="country_thumbnail != undefined"> <img class="w-5 h-3" :src="`${country_thumbnail.toString()}`" />
          </div>
          <div>
            <a v-if="isCountryLinkDefined()" class="text-gray-500 text-sm" :href="`${country_link.toString()}`">{{ country_name }}</a>
            <p v-if="!isCountryLinkDefined()" class="text-gray-500 text-sm">{{ country_name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'

const props = defineProps({
  link: Object as PropType<URL>,
  label: String,
  country_name: String,
  country_link: URL,
  country_thumbnail: URL,
  source: String,
  thumbnail: URL,
})

function isCheeseThumbnailDefined(): boolean {
  return props.thumbnail != undefined
}

function isCountryLinkDefined(): boolean {
  return props.country_link != undefined
}
</script>
