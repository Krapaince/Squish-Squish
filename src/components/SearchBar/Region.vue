<template>
  <div class='w-64'>
    <div class='flex justify-center'>
      <div class='mb-3 xl:w-96'>
        <select v-model='selectedElement'
                class='form-select form-select-sm appearance-none block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'>
          <option selected> All</option>
          <option v-for='(country, index) in elements'> {{ country.name }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { defineEmits, defineProps, inject, PropType, Ref, ref, watch } from 'vue'
import { Country } from '../../models/Country'

const elements: Ref<Array<Country>> = inject('countries')
const selectedElement = ref('All')

const props = defineProps({
  countries: Array as PropType<Array<Country>>,
})

const emit = defineEmits(['filterRegion'])

watch(selectedElement, () => {
  emit('filterRegion', selectedElement.value)
})

</script>