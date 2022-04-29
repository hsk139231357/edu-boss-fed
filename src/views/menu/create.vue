<template>
  <div class="menu">
    <create-or-edit></create-or-edit>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrEdit from './components/createOrEdit.vue'

export default Vue.extend({
  name: 'createIndex',
  components: {
    CreateOrEdit
  },
  data () {
    return {}
  }
})
</script>

<style lang="scss" scoped></style>
