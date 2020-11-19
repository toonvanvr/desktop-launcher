<!-- I have no idea what I'm doing -->
<template>
  <div id="icon">
    <p v-if="icon.legnth > 0"><img v-bind:src="icon" /></p>
    <button @click="showIcon()">Show the SVG!</button>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
new Vue({
  el: '#icon',
  data: function() {
    return {
      icon: ''
    }
  },
  methods: {
    showFunction: function() {
      this.icon(
        'https://raw.githubusercontent.com/toonvanvr/desktop-launcher/sandbox/icon/src/assets/utilities-terminal.svg'
      )
    }
  }
})
</script>
