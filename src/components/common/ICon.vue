<template>
  <el-tooltip effect="dark" :content="props.content" :disabled="disabled" v-bind="$attrs" v-on="$attrs">
    <el-icon v-bind="$attrs" v-on="$attrs">
      <slot></slot>
      <i v-if="props.code" :class="['iconfont', props.code]"></i>
    </el-icon>
  </el-tooltip>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  code: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  }
});
const disabled = computed(() => (!props.content ? true : false));
</script>
