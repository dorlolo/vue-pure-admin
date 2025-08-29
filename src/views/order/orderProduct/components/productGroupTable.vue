<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import {
  ProductPackageGroupType,
  getProductPackageGroupList,
  createProductPackageGroup,
  updateProductPackageGroup,
  deleteProductPackageGroup
} from "@/api/productPackageGroupApi";
import {
  ProductType,
  createProduct,
  updateProduct,
  deleteProduct
} from "@/api/productApi";
import { getMeasureUnitList } from "@/api/productMeasureUnitApi";

import { HandleResponseCode } from "@/api/utils";
import { message } from "@/utils/message";
import subProductDetail from "./subProductDetail.vue";

const talkPops = defineProps({
  //存储数据的变量名，自定义
  productId: { type: Number, required: true },
  cancelEdit: { type: Boolean, required: false }
});
// const cancelEdit = ref(false);
const inputValue = ref({
  productId: talkPops.productId,
  candelEdit: false
});
watch(
  //监听父级数据变动
  () => talkPops.cancelEdit,
  (newVal, oldVal) => {
    console.log("cancelEdit new is", newVal, ", old is", oldVal);
    if (newVal) {
      console.log("取消编辑");
      cancelEditHandler();
    }
  }
);
watch(
  //监听父级数据变动
  () => talkPops.productId,
  newVal => {
    inputValue.value.productId = newVal;
    initMeasureUnitList();
    onSearch();
  }
);
onMounted(async () => {
  console.log("onMounted");
  inputValue.value.productId = talkPops.productId;
  initMeasureUnitList();
  onSearch();
});
const formData = ref<{
  list: ProductPackageGroupType &
    {
      editable?: boolean;
      originData?: ProductPackageGroupType;
    }[];
  expandRowKeys: any[];
}>({
  list: [],
  expandRowKeys: []
});
async function onSearch() {
  const res = await getProductPackageGroupList({
    productId: inputValue.value.productId,
    page: 1,
    pageSize: -1
  });
  if (!HandleResponseCode(res)) {
    return;
  }
  formData.value.list = [];
  res.list.forEach(item => {
    formData.value.list.push({
      ...item,
      editable: false,
      originData: item
    });
  });
}
async function onUpateGroup(row: ProductPackageGroupType) {
  if (row.id === 0 || row.id === undefined) {
    row.productId = inputValue.value.productId;
    const res = await createProductPackageGroup(row);
    if (HandleResponseCode(res)) {
      onSearch();
    }
  } else {
    const res = await updateProductPackageGroup(row);
    if (!HandleResponseCode(res)) {
      return;
    }
    if (row.items.length > 0) {
      row.items.forEach(async (item: ProductType) => {
        if (item.id === 0) {
          item.packGroupId = row.id;
          item.packParentId = inputValue.value.productId;
          const res = await createProduct(item);
          if (HandleResponseCode(res)) {
            onSearch();
          }
        } else {
          const res = await updateProduct(item);
          if (HandleResponseCode(res)) {
            onSearch();
          }
        }
      });
    }
    onSearch();
  }
  // const res = await updateProductPackageGroup(row);
  // if (HandleResponseCode(res)) {
  //   onSearch();
  // }
}
async function onDeletedGroup(row: ProductPackageGroupType) {
  const res = await deleteProductPackageGroup(row);
  if (HandleResponseCode(res)) {
    onSearch();
  }
}

function onAddGroup() {
  formData.value.list.push({
    editable: true,
    productId: inputValue.value.productId
  });
}
function onAddSubItem(row: ProductPackageGroupType) {
  console.log("items", row.items);
  if (row.id === 0) {
    message("请先保存分组信息", { type: "error" });
    return;
  }
  formData.value.list.forEach(group => {
    if (group.id === row.id) {
      const randomString = Math.random().toString(36).substring(2, 6);
      const thisSort = group.items.length + 1;
      group.items.push({
        id: 0,
        productType: 3,
        packParentId: row.productId,
        packGroupId: row.id,
        key: randomString,
        webView: randomString,
        packSort: thisSort,
        sales: null
      });
    }
  });
  formData.value.expandRowKeys.push(row.id);
}
function onEditGroup(row: any) {
  row.editable = true;
}
function cancelEditHandler() {
  formData.value.list.forEach(item => {
    item.editable = false;
  });
}
async function onDeleteSubItem(row: ProductType) {
  if (row.id > 0) {
    const res = await deleteProduct({ id: row.id });
    if (HandleResponseCode(res)) {
      onSearch();
    }
  } else {
    formData.value.list.forEach(group => {
      if (group.id === row.packGroupId) {
        group.items = group.items.filter(
          (item: ProductType) => item.key !== row.key
        );
      }
    });
  }
}
async function onCreateSubItem(row: ProductType) {
  const res = await createProduct(row);
  if (!HandleResponseCode(res)) {
    return;
  }
  onSearch();
}
function onEditSubItem(row: ProductType) {
  console.log("onEditSubItem", row);
  if (row.id === 0) {
    message("请先创建该商品", { type: "error" });
    return;
  }
  subProductDialog.value.visiable = true;
  subProductDialog.value.onEditSubProductId = row.id;
  //使子表保持打开状态
  formData.value.expandRowKeys.push(row.packGroupId);
}
//判断数据是否有变动
function equalOriginData(a: any, b: any) {
  if (a === b) {
    return true;
  } else if (
    typeof a == "object" &&
    a != null &&
    typeof b == "object" &&
    b != null
  ) {
    for (const prop in b) {
      if (!equalOriginData(a[prop], b[prop])) return false;
    }
  } else return false;
  return true;
}

//----------------------------子项编辑会话框
const subProductDialog = ref<{
  visiable: boolean;
  onEditSubProductId: number;
}>({
  visiable: false,
  onEditSubProductId: 1
});
const onCloseSubProductDialog = () => {
  subProductDialog.value.visiable = false;
  onSearch();
};
const measureUnitOriginData = ref([]);
async function initMeasureUnitList() {
  const res = await getMeasureUnitList({ page: 1, pageSize: -1 });
  if (HandleResponseCode(res)) {
    measureUnitOriginData.value = res.list;
  }
}
const numDesc = (row: ProductType) => {
  let str = "";
  let num = 0;
  if (row.sales !== null) {
    num = row.sales.num;
    console.log("row.sales.measureUnitList", row.sales.measureUnitList);
    if (
      row.sales.measureUnitList !== undefined &&
      row.sales.measureUnitList !== null &&
      row.sales.measureUnitList.length > 0
    ) {
      row.sales.measureUnitList.forEach(item => {
        const thisUnit = measureUnitOriginData.value.find(
          unit => unit.id === item.unitId
        );
        if (thisUnit === undefined) {
          return "";
        }
        let total = "";
        if (item.factor !== 0) {
          if (item.enableCalculate) {
            total = (item.factor * num).toFixed(item.precision).toString();
          } else {
            total = item.factor.toString();
          }
        }
        str += item.prefix + total + thisUnit.name + item.suffix;
      });
    }
  }
  return str;
};
const priceDesc = (row: ProductType) => {
  let decimalPlaces = 0;
  if (
    row.sales !== null &&
    row.sales.currency !== null &&
    row.sales.currency != undefined
  ) {
    decimalPlaces = row.sales.currency.decimalPlaces;
  }
  console.log("decimalPlaces", decimalPlaces);
  return row.sales !== null
    ? (row.sales.num * Number(row.sales.unitPrice)).toFixed(decimalPlaces) +
        row.sales.currencyUnit
    : "未设置";
};
</script>

<template>
  <div>
    <div @click.stop class="mainTableOpt">
      <el-button @click="onSearch" type="primary">刷新</el-button>
      <el-button @click="onAddGroup" type="primary">新增分组</el-button>
    </div>
    <el-table
      :data="formData.list"
      style="width: 100%"
      :expand-row-keys="formData.expandRowKeys"
      row-key="id"
    >
      <!-- 这里是子表 -->
      <el-table-column type="expand">
        <template v-slot="{ row }">
          <div class="subTable">
            <el-table :data="row.items" @click.stop stripe>
              <el-table-column prop="name" label="名称">
                <template v-slot="{ row }">
                  <div>
                    <el-input
                      v-if="row.id === 0 || row.id === undefined"
                      v-model="row.name"
                      placeholder="请输入名称"
                    />
                    <span v-else>{{ row.name }}</span>
                  </div>
                </template>
              </el-table-column>
              <!-- <el-table-column label="计量">
                <template v-slot="{ row }">
                  <div>
                    <span>{{ row.desc }}</span>
                  </div>
                </template>
              </el-table-column> -->
              <el-table-column label="商品状态">
                <template v-slot="{ row }">
                  <div>
                    <span>{{
                      row.status === 1
                        ? "预发布"
                        : row.status === 2
                        ? "已上架"
                        : row.status === 3
                        ? "已下架"
                        : "未知"
                    }}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="排序" prop="packSort">
                <template v-slot="{ row }">
                  <el-input-number
                    v-model="row.packSort"
                    :min="0"
                    v-if="row.id === 0"
                  />
                  <span v-else>{{ row.packSort }}</span>
                </template>
              </el-table-column>
              <el-table-column label="数量单位">
                <template v-slot="{ row }">
                  <span>{{ numDesc(row) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="价格">
                <template v-slot="{ row }">
                  <span>
                    <span>{{ priceDesc(row) }}</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template v-slot="{ row }">
                  <div @click.stop>
                    <el-button
                      v-if="row.id === 0"
                      type="success"
                      size="small"
                      @click="onCreateSubItem(row)"
                      >创建</el-button
                    >
                    <el-button
                      type="info"
                      size="small"
                      @click="onEditSubItem(row)"
                      >编辑</el-button
                    >
                    <el-button
                      type="danger"
                      size="small"
                      @click="onDeleteSubItem(row)"
                      >删除</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <!-- 这里是主表 -->
      <el-table-column prop="name" label="分组名称" :style="{ width: '20%' }">
        <template v-slot="{ row }">
          <div @click.stop>
            <el-input
              v-if="row.editable"
              v-model="row.name"
              placeholder="请输入名称"
            />
            <span v-else @dblclick="onEditGroup(row)" class="editable-cell">{{
              row.name
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="key" label="key" :style="{ width: '20%' }">
        <template v-slot="{ row }">
          <div @click.stop>
            <el-input
              v-if="row.editable"
              v-model="row.key"
              placeholder="请输入键"
            />
            <span v-else @dblclick="onEditGroup(row)" class="editable-cell">{{
              row.key
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="描述" :style="{ width: '20%' }">
        <template v-slot="{ row }">
          <div @click.stop>
            <el-input
              v-if="row.editable"
              v-model="row.desc"
              placeholder="请输入描述"
            />
            <span v-else @dblclick="onEditGroup(row)" class="editable-cell">{{
              row.desc
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <div @click.stop>
            <el-button
              type="primary"
              size="small"
              v-if="!equalOriginData(row, row.originData)"
              @click="onUpateGroup(row)"
              >保存</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="onDeletedGroup(row.id)"
              >删除</el-button
            >
            <el-button type="warning" size="small" @click="onAddSubItem(row)"
              >增加子项</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="subProductDialog.visiable"
      :before-close="onCloseSubProductDialog"
      width="1400px"
      @click.stop
    >
      <subProductDetail
        :productId="subProductDialog.onEditSubProductId"
        @onSearch="onSearch"
      />
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.editable-cell {
  display: inline-block;
  width: 100%;
}

.editable-cell:empty::before {
  content: "\a0";
}

.mainTableOpt {
  width: 100%;
  text-align: right;
}

.subTable {
  padding-left: 2px;
  margin-left: 50px;
  background-color: #82d953 !important;
}
</style>
