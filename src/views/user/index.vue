<template>
  <div class="user">
    <user-list></user-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import userList from '@/views/user/components/userList.vue'

export default Vue.extend({
  name: 'userIndex',
  components: {
    userList
  }
})
</script>

<style lang="scss" scoped></style>
