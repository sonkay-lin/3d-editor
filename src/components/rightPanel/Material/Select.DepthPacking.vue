<template>
  <el-select v-bind="$attrs" v-on="$attrs" placement="top-end">
    <el-option v-for="item in depthPackingList" :value="item.value" :label="item.label" :key="item.id"></el-option>
  </el-select>
</template>

<script setup>
import * as THREE from 'three'
const depthPackingList = [
	{
		label: 'Basic',
		value: THREE.BasicDepthPacking
	},
	{
		label: 'RGBA',
		value: THREE.RGBADepthPacking
	},
]
</script>