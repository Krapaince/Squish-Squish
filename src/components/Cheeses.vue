<template>
  <div>
    <div class="flex flex-row flex-wrap flex-auto gap-4 justify-between content-center">
      <Cheese v-for="(cheese, index) in cheeses"
        :key="index"
        :link="cheese.link"
        :label="cheese.label"
        :country="cheese.country"
        :source="cheese.source"
        :thumbnail="cheese.thumbnail"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, onBeforeMount } from 'vue';
import { getCheeses } from '../services/Cheese';
import * as types from '../types/cheese';
import Cheese from './Cheese.vue';

const cheeses: Ref<Array<types.Cheese>> = ref([]);

onBeforeMount(async () => {
  cheeses.value = await getCheeses();
  console.log(cheeses.value);
});

</script>
