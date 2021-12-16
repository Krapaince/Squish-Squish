<template>
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
        <span>Search for an item:</span>
      </div>
      <div>
        <div>
          <input type='text' placeholder='Search' />
          <button id='search'></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import Region from './SearchBar/Region.vue'
import { ref, Ref } from 'vue'
import * as che_models from '../models/Cheese'

const filter: Ref<che_models.CheeseFilter> = ref({ country: 'All' })

const emit = defineEmits(['filterRegion'])

function setCountryFilters(country: String) {
  emit('filterRegion', country)
}
</script>