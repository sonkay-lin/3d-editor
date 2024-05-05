<template>
  <div class="asset">
    <!-- <div class="title">资产</div> -->
    <NavBar v-model="active" @change="changeNav"></NavBar>
    <div class="content">
      <div class="cards">
        <el-card
          v-for="item in assetList"
          v-loading="item.isLoading && item.isLoading.value"
          @click="addObject(item)"
          @dblclick="dbclick(item)"
          :key="item.key"
        >
          <template #header>{{ item.name }}</template>
          <img :src="item.img" />
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from './NavBar.vue';
import { AssetObject3D } from './AssetObject3D';
import { ref } from 'vue';
import { object3DList, cameraList, lightList, modelList } from './AssetList';
import { getViewport } from '@/hooks/useViewport';

let assetList = object3DList;
const objectMap = new AssetObject3D();

const active = ref('object3d'); // light camera

const addObject = async (obj) => {
  if (active.value === 'model') {
    if (obj.isLoading.value === true) return;
    let model;
    try {
      obj.isLoading.value = true;
      model = await objectMap.load(obj.path, (data) => {
        data.scene.name = obj.name;
      });
      getViewport().addStart(model);
    } finally {
      obj.isLoading.value = false;
    }
    return;
  } else if (active.value === 'light' || active.value === 'camera') {
    objectMap.init(obj.key, true);
    return;
  }
  objectMap.init(obj.key);
};

const dbclick = (obj) => {
  if (active.value === 'object3d') {
    assetList = object3DList;
    objectMap.init(obj.key, true);
    getViewport().cancelAdd();
  } 
}

const changeNav = () => {
  if (active.value === 'object3d') {
    assetList = object3DList;
  } else if (active.value === 'light') {
    assetList = lightList;
  } else if (active.value === 'camera') {
    assetList = cameraList;
  } else if (active.value === 'model') {
    assetList = modelList;
  }
};
</script>

<style scoped lang="scss">
.asset {
  height: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  .content {
    height: calc(100% - 30px);
    overflow: scroll;
    scrollbar-width: none;
  }
  .cards {
    padding: 10px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 10px 8px;
    overflow: hidden;
    box-sizing: border-box;
    // display: flex;
    // flex-wrap: wrap;
    // justify-content: space-around;
  }
  :deep(.el-card) {
    height: 112px;
    // margin: 0 5px 10px 5px;
    cursor: pointer;
    .el-card__header {
      line-height: 26px;
      padding: 0;
      text-align: center;
      font-size: 14px;
    }
    .el-card__body {
      position: relative;
      text-align: center;
      padding: 0;
      background-color: rgb(170, 170, 170);
      img {
        height: 85px;
        width: 100%;
        object-fit: contain;
      }
    }
    .el-progress {
      position: absolute;
      top: 0;
      left: 0;
      .el-progress-circle {
        width: 85px !important;
        height: 85px !important;
      }
    }
  }
}
</style>
