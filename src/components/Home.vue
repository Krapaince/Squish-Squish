<template>
  <div class='mt-5'>
    <h1 class='text-amber-400 text-center text-7xl pb-2'>Squish Squish</h1>
    <span class='text-center text-orange-700 block text-4xl'>Your cheesy cheese!</span>
  </div>
  <div class='mx-5'>
    <SearchBar @filter-region='setCountryFilter' />
    <div class='z-0'>
      <div class='flex flex-row flex-wrap justify-between content-start'>
        <Cheese
          v-for='(cheese, index) in cheeses'
          :key='index'
          :class='{ hidden: !che_models.NCheeseFilter.isFilter(filter, cheese) }'
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
  </div>
</template>

<script setup lang='ts'>
import SearchBar from './SearchBar.vue'
import { Ref, ref, provide, onBeforeMount } from 'vue'
import { fetchCheesesInformation, mapCountryToCheese, fetchWikidataCheeses } from '../services/Cheese'
import { fetchCountriesWithUrl } from '../services/Country'
import * as che_models from '../models/Cheese'
import * as cnt_models from '../models/Country'
import Cheese from './Cheese.vue'

const dbpedia_cheeses: Ref<Array<che_models.Cheese>> = ref([])
const wikidata_cheeses: Ref<Array<che_models.Cheese>> = ref([])
var cheeses: Ref<Array<che_models.Cheese>> = ref([])
const countries: Ref<Array<cnt_models.Country>> = ref([])
const filter: Ref<che_models.CheeseFilter> = ref({ country: 'All' })

provide('countries', countries)

onBeforeMount(async () => {
  let fetched_cheeses = await fetchCheesesInformation()
  let unique_countries = await fetchCountriesWithUrl(fetched_cheeses.map((value) => value.country))

  countries.value = unique_countries
  dbpedia_cheeses.value = mapCountryToCheese(fetched_cheeses, unique_countries)

  wikidata_cheeses.value = await fetchWikidataCheeses()
  cheeses.value = dbpedia_cheeses.value.concat(wikidata_cheeses.value)

  cheeses.value.sort((a, b) => a.label < b.label ? -1 : (a.label > b.label ? 1 : 0))
})

function setCountryFilter(country: String) {
  filter.value.country = country
}

</script>