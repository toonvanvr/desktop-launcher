<template>
  <div class="launcher">
    <input type="text" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({})
export default class Launcher extends Vue {}
</script>

<style scoped lang="stylus">

.launcher
  margin: 25px
  width: 100px
  height: 100px

  background-color: #ffffff40
  border: 4px solid #ffffff80

  border-radius: 50%

  &:hover
    background-color: #00000040
</style>
