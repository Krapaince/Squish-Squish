<template>
  <li>
    <a :href="getUrl">{{ getUrl }}</a>
  </li>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    link: {
      type: String,
      default: '',
    },
  },
  name: 'fetch-cheeses',
  data() {
    return {

    };
  },
  computed: {
    getUrl(): string {
      return this.link;
    },
  },
});
</script>
