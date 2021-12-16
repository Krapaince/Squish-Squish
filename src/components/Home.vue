<template>
  <div class='z-0'>
    <div class='flex flex-row flex-wrap gap-1 justify-around content-center'>
      <Cheese
        v-for='(cheese, index) in cheeses'
        :key='index'
        :link='cheese.link'
        :label='cheese.label'
        :country_name='cheese.country.name'
        :country_link='cheese.country.link'
        :country_thumbnail='cheese.country.thumbnail'
        :source='cheese.source'
        :thumbnail='cheese.thumbnail'
      />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { Ref, ref, onBeforeMount, provide } from 'vue'
import { fetchCheesesInformation, mapCountryToCheese } from '../services/Cheese'
import { fetchCountriesWithUrl } from '../services/Country'
import * as che_models from '../models/Cheese'
import * as cnt_models from '../models/Country'
import Cheese from './Cheese.vue'

const cheeses: Ref<Array<che_models.Cheese>> = ref([])
const countries: Ref<Array<cnt_models.Country>> = ref([])
const filter: Ref<che_models.CheeseFilter> = ref({country: 'All'})

onBeforeMount(async () => {
  let fetched_cheeses = await fetchCheesesInformation()
  let unique_countries = await fetchCountriesWithUrl(fetched_cheeses.map((value) => value.country))

  countries.value = unique_countries
  cheeses.value = mapCountryToCheese(fetched_cheeses, unique_countries)
})

function setCountryFilter(country: String) {
  filter.value.country = country
}
</script>
