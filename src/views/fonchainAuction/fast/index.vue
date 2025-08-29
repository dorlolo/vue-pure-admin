<script setup lang="ts">
import { ref } from "vue";
import { useFast } from "./hook";
defineOptions({
  name: "AuctionFast"
});
const { cardList, dialogForm, confirm } = useFast();
const env = ref(1);
const formRef = ref();
function handleCardClick(card) {
  console.log(card);
  dialogForm.value.formData = card;
  dialogForm.value.dialogFormVisible = true;
}
function closeDialogForm() {
  dialogForm.value.dialogFormVisible = false;
}
</script>

<template>
  <div>
    <div>
      <h2>选择环境</h2>
      <div>
        <el-select v-model="env" placeholder="选择环境" class="!w-[180px]">
          <el-option label="生产环境" :value="3" />
          <el-option label="测试" :value="2" />
          <el-option label="本地" :value="1" />
        </el-select>
      </div>
      <div class="card-container">
        <h2>快捷功能</h2>
        <div class="card-group">
          <div
            v-for="card in cardList"
            :key="card.value"
            class="card"
            :style="{ 'background-color': card.bg, color: card.color }"
            @click="handleCardClick(card)"
          >
            {{ card.label }}
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="dialogForm.dialogFormVisible"
      :before-close="closeDialogForm"
      :title="dialogForm.formData.label"
    >
      <el-form ref="formRef" :model="dialogForm.formData" label-width="80px">
        <el-form-item
          v-for="(item, index) in dialogForm.formData.form"
          :v-bind="item"
          :key="index"
          :label="item.label"
          :prop="item.key"
        >
          <el-input :placeholder="item.placeHolder" v-model="item.value" />
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button
          type="success"
          size="default"
          @click="confirm(dialogForm.formData, env)"
          >提交</el-button
        >
        <el-button size="default" @click="closeDialogForm">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 200px;
  background-color: #fff8e7;
}

.left-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
  height: 100%;
}

.right-column {
  flex: 1;
  width: 70%;
  height: 100%;
  padding: 5px 5px 5px 0;
}

.but-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.envBtn {
  width: 100%;
  height: 35px;
  margin: 5px 0 0 5px;
  color: black;
  text-align: center;
  cursor: pointer;
  background-color: #c8c9cc;
  border-radius: 0.4rem;
}

.db-info {
  width: 100%;
  height: 85%;
}

.card-container {
  display: block;
}

.card-group {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.card {
  width: 150px;
  padding: 10px;
  margin: 5px 10px 10px;
  font-weight: bold;
  color: white;
  text-align: center;
  cursor: pointer; /* 将鼠标变成手指 */
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}
</style>
