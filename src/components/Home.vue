<template>
  <div class='mt-5'>
    <h1 class='text-amber-400 text-center text-7xl pb-2'>Squish Squish</h1>
    <span class='text-center text-orange-700 block text-4xl'>Your cheesy cheese!</span>
  </div>
  <div class='mx-5'>
    <SearchBar @filter-region='setCountryFilter' @filter-query='setQueryFilter' :nb_results='nb_results' />
    <div class='z-0'>
      <div class='flex flex-row flex-wrap justify-between content-start'>
        <Cheese
          v-for='(cheese, index) in cheeses'
          :key='index'
          :class='{ hidden: !che_models.NCheeseFilter.isFilter(filter, cheese) }'
          :ontology='cheese.ontology'
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
import { Ref, ref, provide, onBeforeMount, watch } from 'vue'
import { fetchDBpediaCheeses, mapCountryToCheese, fetchWikidataCheeses } from '../services/Cheese'
import { fetchDBpedoaCountries, concatCountries } from '../services/Country'
import * as che_models from '../models/Cheese'
import * as cnt_models from '../models/Country'
import Cheese from './Cheese.vue'

const cheeses: Ref<Array<che_models.Cheese>> = ref([])
const countries: Ref<Array<cnt_models.Country>> = ref([])
const filter: Ref<che_models.CheeseFilter> = ref({ country: 'All', query: '' })
const nb_results: Ref<Number> = ref(0)

provide('countries', countries)

onBeforeMount(async () => {
  let dbpedia_fetched_cheeses = await fetchDBpediaCheeses()
  let unique_countries = await fetchDBpedoaCountries(dbpedia_fetched_cheeses.map((value) => value.country))

  cheeses.value = mapCountryToCheese(dbpedia_fetched_cheeses, unique_countries)

  let wikidata_cheeses = await fetchWikidataCheeses()
  let wikidata_countries = wikidata_cheeses.map((cheese) => cheese.country)
  cheeses.value = cheeses.value.concat(wikidata_cheeses)
  countries.value = concatCountries(unique_countries, wikidata_countries).sort(
    (a, b) => a.name.localeCompare(b.name)
  )

  cheeses.value.sort((a, b) => a.label.localeCompare(b.label))
  nb_results.value = cheeses.value.length
})

function setCountryFilter(country: String) {
  filter.value.country = country
}

function setQueryFilter(query: String) {
  filter.value.query = query
}

watch(filter.value, () => {
  nb_results.value = che_models.NCheeseFilter.computeNbResults(filter.value, cheeses.value)
})

</script>