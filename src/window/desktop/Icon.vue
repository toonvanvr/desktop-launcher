<!-- I have no idea what I'm doing -->
<template>
  <div id="icon">
    <p v-if="image.legnth > 0"><img v-bind:src="icon" /></p>
    <button @click="showIcon()">Show the SVG!</button>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
// Declare tha variable
export default {
  data: function() {
    return {
      icon: ''
    }
  },
  methods: {
    showIcon: function() {
      this.icon = './' /* Stuck here, how do i do this? */
    }
  }
}
</script>
