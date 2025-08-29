<script setup lang="ts">
import { ref, onMounted, computed, watch, defineComponent } from "vue";
import { formRef, useEditForm, RestaurantItem } from "../hook";
import { getProductDetail, ProductType, updateProduct } from "@/api/productApi";
import {
  getProductTagDetail,
  ProductTagType,
  createProductTag,
  updateProductTag,
  getProductTagList
} from "@/api/productTagApi";
import Edit from "@iconify-icons/ep/edit";

import { HandleResponseCode, baseResponse } from "@/api/utils";

import ProductSalesForm from "./productSalesForm.vue";

const productSalesForm = defineComponent({
  ProductSalesForm
});
const { initTagSelectList, initCurrencySelectList, initMeasureUnitList } =
  useEditForm();
const talkPops = defineProps({
  //存储数据的变量名，自定义
  productId: { type: Number, required: true }
  // cancelEdit: { type: Boolean, required: false }
});
const inputValue = ref<{ productId: number }>({ productId: 0 });
watch(
  () => talkPops.productId,
  newVal => {
    inputValue.value.productId = newVal ? Number(newVal) : 0;
    freshData();
  }
);
const activePannel = ref("baseInformation");
const formData = ref<{
  detail: ProductType;
  tagChidrenList: Array<ProductTagType>;
  selectedChidrenList: Array<ProductTagType>;
}>({
  detail: {
    id: 0,
    name: "",
    key: "",
    desc: "",
    content: "",
    status: 1,
    productType: 1,
    mTagId: 0,
    mTagName: "",
    defaultCurrencyId: 0,
    webView: "",
    createdAt: "",
    updatedAt: ""
  },
  tagChidrenList: [],
  selectedChidrenList: []
});

onMounted(async () => {
  inputValue.value.productId = Number(talkPops.productId);
  formData.value.detail.id = inputValue.value.productId;
  freshData();
});

async function freshData() {
  const res = await getProductDetail({ id: inputValue.value.productId });
  if (HandleResponseCode(res as baseResponse)) {
    formData.value.detail = res.data;
    mTagState.value = res.data.mTagName;
    formData.value.selectedChidrenList = res.data.tags;
  }
  if (formData.value.tagChidrenList === null) {
    formData.value.tagChidrenList.push({
      name: "",
      key: "",
      parentId: 0
    });
  }
  if (formData.value.detail.mTagId !== 0) {
    const result = await getProductTagList({
      parentId: formData.value.detail.mTagId,
      page: 1,
      pageSize: -1
    });
    if (HandleResponseCode(result as baseResponse, true)) {
      formData.value.tagChidrenList = result.list;
    }
  }
  initTagSelectList();
  initCurrencySelectList();
  initMeasureUnitList();
}
// ----------------------------------------------------------标签选择器函数----------------------------------------------------------
const mTagState = ref("");
const isEmptyName = computed(() => formData.value.detail.name === "");
const mTagQuerySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? formRef.value.tagSelectList.filter(createFilter(queryString))
    : formRef.value.tagSelectList;
  cb(results);
};
const createFilter = (queryString: string) => {
  return (restaurant: RestaurantItem) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    );
  };
};
const mTagHandleSelect = async (item: RestaurantItem) => {
  console.log("mTagState ", mTagState);
  formData.value.detail.mTagId = item.link;
  //查询子标签
  const result = await getProductTagDetail({
    id: item.link
  });
  if (HandleResponseCode(result as baseResponse, true)) {
    formData.value.tagChidrenList = result.data.children;
  }
};
const mTagHandleClear = () => {
  console.log("clear");
  formData.value.detail.mTagId = 0;
  formData.value.detail.mTagName = "";
};
const childrenTagHandleSelect = val => {
  console.log("val ", val);
  formData.value.detail.tags = [];
  val.forEach(item => {
    formData.value.detail.tags.push({
      id: item.id,
      name: item.name,
      parentId: item.parentId,
      key: item.key
    });
  });
};
const childrenTagHandleClear = () => {
  console.log("clear");
  formData.value.detail.tags = [];
  formData.value.selectedChidrenList = [];
};
//会话框
const onOpenMTagInputDialog = async () => {
  console.log("formData.value.detail.mTagId", formData.value.detail.mTagId);
  let ok = false;
  if (formData.value.detail.mTagId != 0) {
    const result = await getProductTagDetail({
      id: formData.value.detail.mTagId
    });
    if (HandleResponseCode(result as baseResponse)) {
      console.log("data", result.data);
      dialogForm.value.mTagDetail = result.data;
      ok = true;
    }
  }
  if (!ok) {
    dialogForm.value.mTagDetail = {
      id: 0,
      name: "",
      key: "",
      parentId: 0
    };
  }
  dialogForm.value.dialogVisible = true;
};
async function onSaveFormData() {
  const result = await updateProduct(formData.value.detail);
  if (HandleResponseCode(result as baseResponse)) {
    freshData();
  }
}
async function onCreateTagData() {
  dialogForm.value.mTagDetail.id = 0;
  const result = await createProductTag(dialogForm.value.mTagDetail);
  if (HandleResponseCode(result as baseResponse)) {
    console.log("result", result);
    formData.value.detail.mTagId = result.data?.id;
    const updateResult = await updateProduct(formData.value.detail);
    if (HandleResponseCode(updateResult as baseResponse)) {
      initTagSelectList();
      mTagState.value = dialogForm.value.mTagDetail.name;
      onCloseDialog();
    }
  }
}
async function onUpdateTagData() {
  const result = await updateProductTag(dialogForm.value.mTagDetail);
  if (HandleResponseCode(result as baseResponse)) {
    initTagSelectList();
    formRef.value.formData.mTagName = dialogForm.value.mTagDetail.name;
    mTagHandleSelect({
      value: dialogForm.value.mTagDetail.name,
      link: dialogForm.value.mTagDetail.id
    });
    mTagState.value = dialogForm.value.mTagDetail.name;
    onCloseDialog();
  }
}
const onCloseDialog = () => {
  dialogForm.value.dialogVisible = false;
};
const dialogForm = ref<{
  dialogVisible: boolean;
  disableParentSelect: boolean;
  mTagDetail: ProductTagType;
}>({
  dialogVisible: false,
  disableParentSelect: true,
  mTagDetail: {
    name: "",
    key: "",
    parentId: 0
  }
});
// 给**套餐**标签的父组件传递取消编辑的事件
const cancelEdit = ref(false);
function cancelEditHandle() {
  cancelEdit.value = true;
  setTimeout(() => {
    cancelEdit.value = false;
  }, 100);
}
</script>

<template>
  <div class="detail">
    <div class="preview">
      <el-row class="greyFont">
        <text>商品名称</text>
      </el-row>
      <el-row>
        <el-col :span="12">
          <!-- <el-input v-model="formData.name" placeholder="请输入商品名" /> -->
          <input
            type="text"
            :class="{ 'custom-input': true, flashWheninputEmpty: isEmptyName }"
            placeholder="请输入商品名称"
            v-model="formData.detail.name"
          />
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="onSaveFormData"> 保存 </el-button>
          <el-button type="primary" @click="freshData"> 刷新 </el-button>
        </el-col>
      </el-row>
      <el-row class="greyFont row">
        <el-col>
          <div>创建时间: {{ formData.detail.createdAt }}</div>
        </el-col>
        <el-col>
          <div>更新时间: {{ formData.detail.updatedAt }}</div>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-form-item label="商品状态" prop="status">
          <el-select v-model="formData.detail.status" style="width: 100%">
            <el-option :key="1" label="预发布" :value="1" />
            <el-option :key="2" label="上架" :value="2" />
            <el-option :key="3" label="下架" :value="3" />
          </el-select>
        </el-form-item>
      </el-row> -->
    </div>
    <!-- 基本信息、定价、库存 三个标签页框架-->
    <el-tabs
      v-model="activePannel"
      @click="cancelEditHandle"
      style="min-height: 300px"
    >
      <!-- v-model="activeName" @tab-click="handleClick" -->
      <el-tab-pane label="基本信息" name="baseInformation">
        <el-form
          ref="ruleFormRef"
          :model="formData"
          :rules="formRef.rules"
          label-width="80px"
          :disabled="formRef.operation === 'detail'"
        >
          <div class="columnContainer">
            <div class="column1">
              <el-form-item label="商品类型" prop="productType">
                <el-select
                  v-model="formData.detail.productType"
                  style="width: 100%"
                >
                  <el-option :key="1" label="独立商品" :value="1" />
                  <el-option :key="2" label="套餐商品" :value="2" />
                  <el-option :key="3" label="套餐商品子项" :value="3" />
                </el-select>
              </el-form-item>
              <el-form-item label="Key" prop="key">
                <el-input
                  v-model="formData.detail.key"
                  autocomplete="off"
                  placeholder="服务端唯一键，用于绑定业务逻辑"
                />
              </el-form-item>

              <el-form-item label="webView" prop="webView">
                <el-input
                  v-model="formData.detail.webView"
                  autocomplete="off"
                  placeholder="web端唯一键，用于web端逻辑处理"
                />
              </el-form-item>
              <el-form-item label="主标签" prop="mTagName">
                <el-row>
                  <el-autocomplete
                    v-model="mTagState"
                    :fetch-suggestions="mTagQuerySearch"
                    clearable
                    class="inline-input w-50"
                    placeholder="请输入主标签名"
                    @select="mTagHandleSelect"
                    @clear="mTagHandleClear"
                    style="width: 200px"
                  />
                  <div @click="onOpenMTagInputDialog">
                    <IconifyIconOffline
                      :icon="Edit"
                      style="
                        padding-top: 2px;
                        margin: 5px;
                        font-size: 20px;
                        color: #1a5;
                      "
                    />
                  </div>
                </el-row>
              </el-form-item>

              <el-form-item label="子标签">
                <el-select
                  v-model="formData.selectedChidrenList"
                  multiple
                  filterable
                  clearable
                  placeholder="请输入标签名"
                  @change="childrenTagHandleSelect"
                  @clear="childrenTagHandleClear"
                  style="width: 200px"
                >
                  <el-option
                    v-for="item in formData.tagChidrenList"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  />
                </el-select>
                <div @click="onOpenMTagInputDialog">
                  <IconifyIconOffline
                    :icon="Edit"
                    style="
                      padding-top: 2px;
                      margin: 5px;
                      font-size: 20px;
                      color: #1a5;
                    "
                  />
                </div>
              </el-form-item>
            </div>
          </div>

          <el-form-item label="商品描述" prop="desc">
            <el-input
              v-model="formData.detail.desc"
              autocomplete="off"
              placeholder="请输入商品描述"
            />
          </el-form-item>
          <el-form-item label="详细说明" prop="content">
            <el-input
              v-model="formData.detail.content"
              autocomplete="off"
              placeholder="请输入详细说明"
              type="textarea"
            />
          </el-form-item>
          <el-form-item label="排序" prop="packSort">
            <el-input-number v-model="formData.detail.packSort" :min="0" />
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="定价" name="second">
        <productSalesForm :productId="inputValue.productId" :productType="3" />
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="dialogForm.dialogVisible" :before-close="onCloseDialog">
      <template v-slot:header>编辑标签</template>
      <div>
        <el-form
          :model="dialogForm.mTagDetail"
          label-width="80px"
          :disabled="formRef.operation === 'detail'"
        >
          <el-form-item label="标签名" prop="name">
            <el-input
              v-model="dialogForm.mTagDetail.name"
              autocomplete="off"
              placeholder="请输入标签名"
            />
          </el-form-item>
          <el-form-item label="标签key" prop="key">
            <el-input
              v-model="dialogForm.mTagDetail.key"
              autocomplete="off"
              placeholder="请输入标签key"
            />
          </el-form-item>
        </el-form>
      </div>

      <template v-slot:footer>
        <el-button
          type="primary"
          @click="onUpdateTagData"
          v-if="dialogForm.mTagId !== 0"
          >更 新</el-button
        >
        <el-button type="success" @click="onCreateTagData">新 建</el-button>
        <el-button @click="dialogForm.dialogVisible = false">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
//当输入框为空时，添加闪烁动画
@keyframes flash-border {
  0%,
  100% {
    border-bottom-color: #add8e6;
  } /* 淡蓝色 */
  50% {
    border-bottom-color: transparent;
  } /* 透明 */
}

.detail {
  min-height: 750px;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.preview {
  // display: flex;
  // justify-content: center;
  // align-items: center;
  height: 200px;
}

.horizontal-line {
  display: flex;
  align-items: center; /* 垂直居中 */
  //margin: 10px 0; /* 整体间距 */
}

.line {
  flex: 1; /* 占据剩余空间 */
  height: 2px; /* 横线高度 */
  background-color: #ccc; /* 设置横线颜色为淡灰色 */
}

.content {
  margin: 0 10px; /* 文字间距 */
}

.columnContainer {
  display: flex;
}

.column1 {
  flex: 1; /* 均分宽度 */
  width: 50%; /* 宽度 */
  padding-right: 10px; /* 内边距 */
}

.column2 {
  flex: 1; /* 均分宽度 */
  width: 50%; /* 宽度 */
  padding-left: 10px; /* 内边距 */
}

.divider {
  width: 1px; /* 线条宽度 */
  margin: 10px 0;
  background-color: #ccc; /* 线条颜色 */
}

textarea {
  padding: 5px 10px;
  border: 1px solid #ccc; /* 设置边框样式、颜色和宽度 */
  border-radius: 5px; /* 设置边框圆角 */
  outline: none; /* 去除默认的轮廓样式 */
}

textarea:focus {
  border-color: #ccc; /* 设置获取焦点时的边框颜色 */
}

//标题名称输入框样式
.custom-input {
  // font-size: 24px;
  // background: none;
  // border: none;
  // border-bottom: 2px solid #87cefa;
  // outline: none;
  box-sizing: border-box; /* 确保边框和内边距不会增加输入框的总宽度 */
  width: 100%; /* 宽度 */
  padding: 0; /* 移除内边距 */
  margin: 10px 0; /* 外边距 */
  font-family: inherit; /* 继承字体族 */ /* 字体大小 */
  font-size: 24px; /* 设置字体大小为24号 */
  background-color: transparent; /* 确保没有背景色 */
  border: none; /* 移除所有边框 */
  border-bottom: 2px solid #add8e6; /* 设置底部边框为透明，这样默认状态下看起来像是没有边框 */
  outline: none; /* 移除聚焦时的默认外边框 */
  transition: border-bottom-color 0.3s; /* 平滑边框颜色的过渡效果 */
}

/* 可以添加更多样式来调整输入框的其他属性，如高度、内边距等 */
.custom-input:focus {
  border-bottom: 2px solid #007bff !important; /* 聚焦时显示蓝色边框 */
}

.flashWheninputEmpty {
  border-bottom: 2px solid transparent; /* 确保默认状态下没有边框 */
  animation: flash-border 1s infinite; /* 慢速闪烁动画 */
}

.greyFont {
  color: grey;
}

.row {
  margin: 10px 0;
}

.el-tabs__nav-scroll {
  display: flex;
}

.el-tabs__item {
  flex: 1;
  text-align: center;
}
</style>
