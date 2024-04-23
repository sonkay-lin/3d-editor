<template>
  <span
    :class="['slide-input', props.onlyNumber ? 'only-number' : '']"
    @mouseenter="isShowArrow(true)"
    @mouseleave="isShowArrow(false)"
  >
    <el-input-number
      v-model="number"
      :precision="props.precision"
      :step="step"
      @update:value="handlerChange"
      @change="handlerChange"
      @mousedown.stop="onMouseDown"
      v-bind="$attrs"
      v-on="$attrs"
    ></el-input-number>
    <el-icon class="left" v-show="isShowControl" @click="decrease()">
      <ArrowLeft />
    </el-icon>
    <el-icon class="right" v-show="isShowControl" @click="increase()">
      <ArrowRight />
    </el-icon>
  </span>
</template>

<script setup>
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
import { ref, watch, onMounted } from 'vue';
const props = defineProps({
  value: {
    type: Number,
    default: 0
  },
  min: {
    type: Number,
    default: -Infinity
  },
  max: {
    type: Number,
    default: Infinity
  },
  precision: {
    type: Number,
    default: 2
  },
  step: {
    type: Number,
    default: 0.1
  },
  onlyNumber: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(['update:value', 'change']);

const number = ref(0);
const step = ref(1);
const isShowControl = ref(false);
const isShowArrow = (isShow) => {
  if (props.onlyNumber) return;
  isShowControl.value = isShow;
};

let distance = 0;
let onMouseDownValue = 0;
const pointer = { x: 0, y: 0 };
const prevPointer = { x: 0, y: 0 };

const onMouseDown = (event) => {
  event.preventDefault();
  document.body.style.cursor = 'n-resize';
  // document.body.setAttribute('class', 'move-state');

  distance = 0;
  onMouseDownValue = number.value;
  prevPointer.x = event.clientX;
  prevPointer.y = event.clientY;

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

const onMouseMove = (event) => {
  event.stopPropagation();
  pointer.x = event.clientX;
  pointer.y = event.clientY;

  distance += pointer.x - prevPointer.x - (pointer.y - prevPointer.y);

  let value = onMouseDownValue + (distance / (event.shiftKey ? 5 : 23)) * step.value;
  value = Math.min(props.max, Math.max(props.min, value));

  // if (onMouseDownValue !== value && value !== null) {

  if (props.max >= value && value >= props.min) {
    value = parseFloat(value.toFixed(props.precision));
    number.value = value;
  
    handlerChange(value);
  }
  // }

  prevPointer.x = pointer.x;
  prevPointer.y = pointer.y;
};

const onMouseUp = (event) => {
  event.stopPropagation();
  document.body.style.cursor = 'default';
  // document.body.className = document.body.className.replace('move-state', '');

  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
};

const handlerChange = (value) => {
  if (value === null) {
    return;
  }
  value = parseFloat(value.toFixed(props.precision));
  emits('update:value', value);
  emits('change', value);
};

const increase = () => {
  if (number.value >= props.max) return;
  const newVal = number.value + props.step;
  handlerChange(newVal);
};
const decrease = () => {
  if (number.value <= props.min) return;
  const newVal = number.value - props.step;
  handlerChange(newVal);
};

onMounted(() => {
  number.value = props.value;

  if (props.precision !== 0) {
    // step.value = Number(`${Number(0).toFixed(props.precision - 1)}1`);
    // step.value = 0.1
    step.value = props.step;
    // console.log(step.value)
  }
});

watch(
  () => props.value,
  (newVal) => {
    number.value = newVal;
  }
);
</script>

<style scoped lang="scss">
.slide-input {
  position: relative;
  display: inline-flex;
  height: 100%;
  .left,
  .right {
    position: absolute;
    color: #666;
  }
  .left {
    left: 0;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .right {
    right: 0;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .left:hover,
  .right:hover {
    background-color: rgba(200, 200, 200, 0.8);
  }
  :deep(.el-icon) {
    font-size: 18px;
    top: 50%;
    transform: translateY(-50%);
    height: 100%;
    background-color: rgba(200, 200, 200, 0.3);
  }
  :deep(.el-input-number__decrease),
  :deep(.el-input-number__increase) {
    display: none;
  }
  :deep(.el-input__inner) {
    cursor: n-resize;
  }
  :deep(.el-input__wrapper) {
    padding: 0;
  }
}
.only-number {
  :deep(.el-input__wrapper) {
    background-color: unset;
    box-shadow: none;
  }
  :deep(.el-input-number) {
    width: 45px;
  }
  :deep(.el-input__wrapper) {
    padding: 0;
  }
}
</style>
