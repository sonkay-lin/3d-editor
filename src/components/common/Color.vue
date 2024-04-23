<template>
  <el-color-picker v-model="colorPicker" color-format="rgb" @change="change"/>
</template>

<script setup>
import * as THREE from 'three'
import { computed } from 'vue';
const props = defineProps({
  color: {
    type: Object,
    default: new THREE.Color(0xffffff)
  }
})
const emits = defineEmits(['update:color', 'change'])
const colorPicker = computed({
  get() {
    return colorToComponent(props.color)
  },
  set(newVal) {
    emits('update:color', newVal)
  }
})
const change = (e) => {
  const newColor = colorToObject(e)
  colorPicker.value = newColor
  emits('update:color', newColor)
  emits('change', newColor)
}
// 颜色转换到threejs对象上
const colorToObject = (color) => {
  return new THREE.Color(color)
}
// 颜色转换到组件上
const colorToComponent = (color) => {
  return `rgb(${color.r * 255},${color.g * 255},${color.b * 255})`
}
</script>