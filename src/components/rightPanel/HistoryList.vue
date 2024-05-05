<template>
  <div class="history">
    <div class="title">操作历史</div>
    <div class="command" ref="commandListRef">
      <div class="undo list" v-for="item in undoList" :key="item.id" @click="history.goToState(item.id)">
        <span>{{ item.name }}</span>
      </div>
      <div class="redo list" v-for="item in redoList" :key="item.id" @click="history.goToState(item.id)">
        <span>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getEditor } from '@/hooks/useEditor';
import { ref, onMounted, nextTick } from 'vue';

let history = null;

const commandListRef = ref();

const undoList = ref([]);
const redoList = ref([]);

onMounted(() => {
  const editor = getEditor();
  history = editor.history;
  editor.event.historyChanged.add((cmd) => {
    undoList.value = [...editor.history.undos];
    const redos = [...editor.history.redos];
    redoList.value = redos.reverse();
    nextTick(() => {
      commandListRef.value.scrollTop = commandListRef.value.scrollHeight;
    });
  });
});
</script>

<style scoped lang="scss">
.history {
  border-radius: 8px;
  width: 100%;
  height: 100%;
  padding: 10px;
  background-color: rgba(24, 24, 24, 0.8);
  overflow: hidden;
  box-sizing: border-box;
  .title {
    margin-bottom: 10px;
    width: 100% ;
    left: 10px;
    top: 10px;
  }
  .command {
    height: calc(100% - 30px);
    overflow: scroll;
    scrollbar-width: none;
  }
  .list {
    width: 100%;
    padding-left: 8px;
    line-height: 28px;
    margin-bottom: 8px;
    cursor: pointer;
    color: #eee;
    box-sizing: border-box;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .list:hover {
    background-color: rgba(233, 233, 233, 0.1);
  }
  .redo {
    color: #aaaaaa;
  }
}
</style>
