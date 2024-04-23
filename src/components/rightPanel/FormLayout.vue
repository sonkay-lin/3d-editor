<template>
  <div class="table-panel">
    <div class="title">{{ props.title }}</div>
    <div class="form-content">
      <el-form size="small" label-width="75px" v-bind="$attrs" v-on="$attrs">
        <template v-if="props.isShow">
          <slot v-if="isShow"></slot>
        </template>
        <template v-else>
          <el-empty :description="props.emptyDescription" />
        </template>
      </el-form>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  isShow: {
    type: Boolean,
    default: false
  },
  emptyDescription: {
    type: String,
    default: ''
  }
});
</script>

<style scoped lang="scss">
.table-panel {
  flex: 1;
  padding: 50px 10px 10px;
  overflow: hidden;
  position: relative;
  .title {
    position: absolute;
    top: 10px;
    left: 10px;
    width: calc(100% - 20px);
  }
  .form-content {
    height: 100%;
    overflow: scroll;
  scrollbar-width: none;
  }
}
</style>
