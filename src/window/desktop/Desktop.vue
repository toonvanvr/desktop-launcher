<template>
  <WindowHandle />
  <Launcher />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Launcher from './components/Launcher.vue'
import Icon from './components/Icon.vue'
import WindowHandle from './components/WindowHandle.vue'

@Options({
  components: {
    Launcher,
    WindowHandle,
    Icon
  }
})
export default class Desktop extends Vue {}
</script>

<style lang="stylus">
// TODO: import modern-normalize through npm somehow


#app
  display: flex
  flex-direction: column

  width: 100vw
  height: 100vh

  background-color: #00000040
</style>
