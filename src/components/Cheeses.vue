<template>
  <ul>
    <Cheese v-for="(cheese, index) in cheeses" :key="index" :link="cheese.value" />
  </ul>
</template>

<script setup lang="ts">
import { Ref, ref, onBeforeMount } from 'vue';
import { getCheeses } from '../services/Cheese';
import Cheese from './Cheese.vue';

const cheeses: Ref<string[]> = ref([]);

onBeforeMount(async () => {
  cheeses.value = await getCheeses();
});

</script>
