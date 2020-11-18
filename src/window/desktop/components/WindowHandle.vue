<!-- Temporary, it's easier to develop -->

<template>
  <div class="handle">⠿</div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'

export default class WindowHandle extends Vue {}
</script>

<style scoped lang="stylus">
.handle
  box-sizing: border-box
  -webkit-app-region: drag
  user-select: none
  writing-mode: vertical-rl;

  font-size: 1.25rem

  margin: 1em
  padding: .25em .5em
  align-self: center

  border-radius: .25em
  background-color: #3c93ff
  // border: 2px solid #3c93ff
  cursor: grab
  color: white
</style>
