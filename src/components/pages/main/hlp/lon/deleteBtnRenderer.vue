<template>
  <span>
    <div class="float-right" style="margin-right: 10px;">
        <q-btn class="btn" icon="remove" size="sm" @click="invokeParentMethod()"/>
    </div>
  </span>
</template>
<script setup>

const prop = defineProps({
  params: {
    type: Object,
    required: true
  }
})

const invokeParentMethod = () => {
  prop.params.invokeParentMethod(prop.params.data)
}
</script>
