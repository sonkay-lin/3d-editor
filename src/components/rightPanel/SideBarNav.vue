<template>
  <div class="side-bar">
    <div class="top">
      <div :class="setClass(item.id)" v-for="item in navList" :key="item.id" @click="select(item.id)">
        <ICon class="icon" :content="item.title" :code="item.icon" placement="left"></ICon>
      </div>
    </div>
    <div class="bottom">
      <div class="nav-item" @click="setActives('history')">
        <ICon class="icon" content="历史" code="icon-lishijilu" placement="left"></ICon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
const navList = [
  {
    id: 'scene',
    title: '场景',
    icon: 'icon-sanweichangjing1'
  },
  {
    id: 'renderer',
    title: '渲染器',
    icon: 'icon-xuanranqi'
  },
  {
    id: 'object3d',
    title: '对象',
    icon: 'icon-huowutiji'
  },
  {
    id: 'material',
    title: '材质',
    icon: 'icon-caizhi'
  },
  {
    id: 'geometry',
    title: '几何',
    icon: 'icon-cube'
  }
];

const props = defineProps({
  modelValue: String
});
const emits = defineEmits(['update:modelValue', 'activeChange']);

const actives = ref([]);

const data = computed({
  get() {
    return props.modelValue;
  },
  set(newVal) {
    emits('update:modelValue', newVal);
  }
});

const setClass = (id) => {
  if (data.value === id) {
    return 'nav-item active';
  }
  return 'nav-item';
};

const setActives = (item) => {
  if (actives.value.includes(item)) {
    actives.value = actives.value.filter((i) => i !== item);
  } else {
    actives.value.push(item);
  }
  emits('activeChange', actives.value);
};

const select = (id) => {
  data.value = id;
};
</script>

<style scoped lang="scss">
.side-bar {
  width: 39px;
  height: 100%;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  box-sizing: border-box;
  .nav-item {
    width: 20px;
    height: 20px;
    margin-bottom: 10px;
    cursor: pointer;
  }
  :deep(.el-icon),
  :deep(.iconfont) {
    position: relative;
    z-index: 10;
    font-size: 18px;
    color: #fff;
  }
  :deep(.active .iconfont) {
    color: #409eff !important;
  }
  .active {
    position: relative;
    color: #409eff !important;
  }
  .active::after {
    content: '';
    position: absolute;
    width: 2px;
    height: 28px;
    background-color: rgb(64, 158, 255);
    border-radius: 4px;
    top: 50%;
    right: -10px;
    transform: translateY(-13px);
  }
}
</style>
