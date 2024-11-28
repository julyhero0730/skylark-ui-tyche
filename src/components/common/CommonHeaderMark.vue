<template>
    <div>{{ prop.params.displayName }} <span v-if="prop.params.isRequired" style="color: red;">*</span></div>
</template>

<script setup>
const prop = defineProps({
  params: {
    type: Object,
    required: true
  }

})

</script>
