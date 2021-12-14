<template>
  <div>
    <div class="flex flex-row flex-wrap flex-auto gap-1 justify-around content-center">
      <Cheese
        v-for="(cheese, index) in cheeses"
        :key="index"
        :link="cheese.link"
        :label="cheese.label"
        :country_name="cheese.country.name"
        :country_link="cheese.country.link"
        :country_thumbnail="cheese.country.thumbnail"
        :source="cheese.source"
        :thumbnail="cheese.thumbnail"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, onBeforeMount } from 'vue'
import { fetchCheesesInformation, toCheese } from '../services/Cheese'
import { fetchCountriesName } from '../services/Country'
import * as models from '../models/Cheese'
import Cheese from './Cheese.vue'

const cheeses: Ref<Array<models.Cheese>> = ref([])

onBeforeMount(async () => {
  let fetched_cheeses = await fetchCheesesInformation()
  let countries = await fetchCountriesName(fetched_cheeses.map((value) => value.country))

  cheeses.value = toCheese(fetched_cheeses, countries)
})
</script>
