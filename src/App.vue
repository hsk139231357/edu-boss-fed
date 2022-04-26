<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import request from '@/utils/request'

const foo = 'bar'

export default Vue.extend({
  name: 'App'
})
</script>

<!--<script lang="ts">-->
<!--import Vue from 'vue'-->
<!--import Component from 'vue-class-component'-->

<!--@Component-->
<!--export default class App extends Vue {-->
<!--  a = 1-->
<!--  b = '2'-->

<!--  test () {-->
<!--    console.log('a&#45;&#45;&#45;&#45;', this.a)-->
<!--  }-->
<!--}-->
<!--</script>-->

<style lang="scss" scoped>
//@import "~@/styles/variables.scss";

.show-color {
  color: $warning-color;
}
</style>
