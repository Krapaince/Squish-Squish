<template>
  <div class='flex flex-col content-center items-center'>
  <div class='flex flex-row justify-center space-x-8 z-50 mt-5'>
    <div>
      <div class='flex flex-col space-y-2'>
        <span>Region/Country:</span>
      </div>
      <div>
        <Region @filter-region='setCountryFilters' />
      </div>
    </div>
    <div>
      <div class='flex flex-col space-y-2'>
        <span>Search for a cheese:</span>
      </div>
      <div>
        <div>
          <input v-model='query' type='text' placeholder='Search' />
          <button id='search'></button>
        </div>
      </div>
    </div>
  </div>
    <div>
      <span :class='{hidden: nb_results <= 1}' >Number of results: {{ nb_results }}</span>
      <span :class='{hidden: nb_results >= 2}' >Number of result: {{ nb_results }}</span>
    </div>
  </div>
</template>

<script setup lang='ts'>
import Region from './SearchBar/Region.vue'
import { ref, Ref, watch } from 'vue'
import * as che_models from '../models/Cheese'

const filter: Ref<che_models.CheeseFilter> = ref({ country: 'All' })
const query = ref("")

defineProps({
  nb_results: Number,
})

const emit = defineEmits(['filterRegion', 'filterQuery'])

function setCountryFilters(country: String) {
  emit('filterRegion', country)
}

watch(query, () => {
  emit('filterQuery', query.value)
})

</script>