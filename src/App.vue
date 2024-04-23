<template>
  <Editor />
</template>

<script>
import Editor from './views/Editor.vue';
export default {
  name: 'App',
  components: {
    Editor
  }
}
</script>

<style>
#app, body {
  padding: 0;
  margin: 0;
  overflow: hidden;
}
</style>
