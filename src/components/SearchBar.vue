<template>
  <div class='flex flex-row z-50 mt-5'>
    <div>
      <input type='text' placeholder='Search' />
      <button id='search'></button>
    </div>
    <div class='flex flex-row'>
      <div>
        <Region @filter-region='setCountryFilters'/>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import Region from './SearchBar/Region.vue'
import { ref, Ref } from 'vue'
import * as che_models from '../models/Cheese'

const filter: Ref<che_models.CheeseFilter> = ref({country: 'All'})

const emit = defineEmits(['filterRegion'])

function setCountryFilters(country: String) {
  emit('filterRegion', country)
}
</script>