<template>
  <div class="nav-bar">
    <!-- <el-icon v-for="item in navList" :title="item.title" :key="item.id" @click="setActive(item)">
      <i :class="setClass(item)"></i>
    </el-icon> -->
    <ICon
      :class="setClass(item)"
      v-for="item in navList"
      :code="item.icon"
      placement="top"
      :content="item.title"
      :key="item.id"
      @click="setActive(item)"
    ></ICon>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const navList = [
  {
    title: '3D对象',
    icon: 'icon-baoguo_hezi_o',
    key: 'object3d'
  },
  {
    title: '灯光',
    icon: 'icon-guangxian',
    key: 'light'
  },
  {
    title: '相机',
    icon: 'icon-zhaoxiangji1',
    key: 'camera'
  },
  {
    title: '模型',
    icon: 'icon-moxing2',
    key: 'model'
  }
];

const props = defineProps({
  modelValue: String
});
const emits = defineEmits(['update:modelValue', 'change']);

const data = computed({
  get() {
    return props.modelValue;
  },
  set(newVal) {
    emits('update:modelValue', newVal);
  }
});

const setActive = (item) => {
  if (data.value === item.key) return;
  data.value = item.key;
  emits('change', item.key);
};
const setClass = (item) => {
  const { key, icon } = item;
  if (data.value === key) {
    return `active`;
  }
  return '';
};
</script>

<style scoped lang="scss">
.nav-bar {
  height: 29px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-around;
  :deep(.el-icon) {
    color: #fff;
    cursor: pointer;
    width: 40px;
    .iconfont {
      font-size: 20px;
    }
    &.active {
      color: #409eff !important;
    }
  }
}
</style>
