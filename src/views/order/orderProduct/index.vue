<script setup lang="ts">
import { onMounted } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "@iconify-icons/ep/delete";
import View from "@iconify-icons/ep/view";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import {
  searchFormRef,
  searchLoading,
  useSearchForm,
  searchFormData,
  tableDeleteRef,
  useDataTable,
  tableRef,
  tableRefRowKey,
  tableData,
  tablePagination,
  muiltSelectList,
  formRef,
  useEditForm,
  ruleFormRef,
  deleteViewContent,
  useDetail
} from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { PureTable } from "@pureadmin/table";
import { tableColumns } from "./menuListColumns";

defineOptions({
  name: "OrderProduct"
});

const { onSearch, resetSearchForm } = useSearchForm();
const { onDelete, onOpenDeleteDialog, onMultSelectionChange } = useDataTable();
const {
  initForm,
  onCreate,
  onSubmit,
  onClose,
  onOpen,
  initTagSelectList,
  initCurrencySelectList,
  initMeasureUnitList
} = useEditForm();

const { toDetail } = useDetail();
onMounted(() => {
  initForm();
  initTagSelectList();
  initCurrencySelectList();
  initMeasureUnitList();
  onSearch();
});
</script>

<template>
  <div>
    <el-form
      ref="searchFormRef"
      :inline="true"
      :model="searchFormData"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="商品标签" prop="categoryName">
        <el-input
          v-model="searchFormData.mTagName"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-form-item label="商品编号" prop="productNo">
        <el-input
          v-model="searchFormData.productNo"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-form-item label="商品名" prop="name">
        <el-input v-model="searchFormData.name" clearable class="!w-[200px]" />
      </el-form-item>

      <el-form-item label="Key值" prop="key">
        <el-input v-model="searchFormData.key" clearable class="!w-[200px]" />
      </el-form-item>

      <el-form-item label="商品描述" prop="desc">
        <el-input v-model="searchFormData.desc" clearable class="!w-[200px]" />
      </el-form-item>

      <el-form-item label="详细说明" prop="content">
        <el-input
          v-model="searchFormData.content"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-form-item label="web端展示" prop="webView">
        <el-input
          v-model="searchFormData.webView"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-form-item label="默认货币" prop="defaultCurrencyId">
        <!-- <el-input
          v-model="searchFormData.defaultCurrency"
          clearable
          class="!w-[200px]"
        /> -->
        <el-select
          v-model="searchFormData.defaultCurrencyId"
          class="!w-[180px]"
        >
          <el-option
            v-for="item in formRef.currencySelectList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="商品类型" prop="productTypeIn">
        <el-select
          v-model="searchFormData.productTypeIn"
          multiple
          clearable
          class="!w-[180px]"
        >
          <el-option label="无" :value="0" />
          <el-option label="独立商品" :value="1" />
          <el-option label="套餐商品" :value="2" />
          <el-option label="套餐商品子项" :value="3" />
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="父级id,套餐子商品使用" prop="parentId">
        <el-select v-model="searchFormData.parentId" class="!w-[180px]">
          <el-option label="待完成" :value="0" />
        </el-select>
      </el-form-item> -->

      <el-form-item label="商品状态" prop="status">
        <el-select v-model="searchFormData.status" class="!w-[180px]">
          <el-option label="无" :value="0" />
          <el-option label="预发布" :value="1" />
          <el-option label="已上架" :value="2" />
          <el-option label="已下架" :value="3" />
        </el-select>
      </el-form-item>

      <!-- 
      <el-form-item label="展示数量单位" prop="quantityUnit">
        <el-input
          v-model="searchFormData.quantityUnit"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-form-item label="展示时间单位" prop="timeUnit">
        <el-input
          v-model="searchFormData.timeUnit"
          clearable
          class="!w-[200px]"
        />
      </el-form-item> -->

      <el-form-item label="计算单位" prop="calculateUnit">
        <el-select v-model="searchFormData.calculateUnit" class="!w-[180px]">
          <el-option label="无" :value="0" />
          <el-option label="数量" :value="1" />
          <el-option label="时间" :value="2" />
          <el-option label="数量和时间" :value="3" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="searchLoading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button
          :icon="useRenderIcon(Refresh)"
          @click="resetSearchForm(searchFormRef)"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      title="商品列表"
      @refresh="onSearch"
      :columns="tableColumns"
      :tableRef="tableRef?.getTableRef()"
    >
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="onCreate"
        >
          新增商品
        </el-button>
        <el-button
          class="reset-margin"
          type="danger"
          :disabled="muiltSelectList.length === 0"
          :icon="useRenderIcon(Delete)"
          @click="onOpenDeleteDialog(null, 'mult')"
        >
          批量删除
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          :data="tableData"
          :row-key="tableRefRowKey"
          adaptive
          :adaptiveConfig="{ offsetBottom: 32 }"
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          default-expand-all
          :loading="searchLoading"
          :size="size"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
          :pagination="tablePagination"
          :paginationSmall="size === 'small' ? true : false"
          @selection-change="onMultSelectionChange"
          @page-size-change="onSearch"
          @page-current-change="onSearch"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="toDetail({ id: row.id, name: row.name })"
              :icon="useRenderIcon(View)"
            >
              详情
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(Delete)"
              @click="onOpenDeleteDialog(row, 'single')"
            >
              删除
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <div>
      <!-- form弹窗数据 -->
      <el-dialog v-model="formRef.dialogFormVisible" :before-close="onClose">
        <template #header="{ titleId, titleClass }">
          <div class="dialog-header">
            <h4 :id="titleId" :class="titleClass">
              {{ formRef.dialogTitle }}
            </h4>
            <span>{{
              formRef.formData.productNo
                ? "商品编号:" + formRef.formData.productNo
                : ""
            }}</span>
            <div class="button-group">
              <el-button
                :disabled="formRef.operation === 'detail'"
                type="success"
                @click="onOpen('detail')"
              >
                预览
              </el-button>
              <el-button
                :disabled="
                  formRef.operation === 'edit' || formRef.operation === 'create'
                "
                type="primary"
                @click="onOpen('edit')"
              >
                编辑
              </el-button>
            </div>
          </div>
        </template>
        <el-form
          ref="ruleFormRef"
          :model="formRef.formData"
          :rules="formRef.rules"
          label-width="80px"
          :disabled="formRef.operation === 'detail'"
        >
          <div class="columnContainer">
            <div class="column1">
              <div class="horizontal-line">
                <div class="line" />
                <div class="content">基本信息</div>
                <div class="line" />
              </div>
              <el-form-item label="商品名称" prop="name">
                <el-input
                  v-model="formRef.formData.name"
                  autocomplete="off"
                  placeholder="请输入商品名"
                />
              </el-form-item>

              <el-form-item label="商品类型" prop="productType">
                <el-select
                  v-model="formRef.formData.productType"
                  style="width: 100%"
                >
                  <el-option :key="0" label="无" :value="0" />
                  <el-option :key="1" label="独立商品" :value="1" />
                  <el-option :key="2" label="套餐商品" :value="2" />
                  <el-option :key="3" label="套餐商品子项" :value="3" />
                </el-select>
              </el-form-item>

              <el-form-item label="商品标签" prop="mTagId">
                <!-- <span>{{ formRef.formData.mTagId }}</span> -->
                <el-select
                  v-model="formRef.formData.mTagId"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in formRef.tagSelectList"
                    :key="item.link"
                    :value="item.link"
                    :label="item.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="商品描述" prop="desc">
                <el-input
                  v-model="formRef.formData.desc"
                  autocomplete="off"
                  placeholder="请输入商品描述"
                />
              </el-form-item>
            </div>
            <div class="divider" />
            <div class="column2">
              <div class="horizontal-line">
                <div class="line" />
                <div class="content">唯一键定义</div>
                <div class="line" />
              </div>
              <el-form-item label="Key" prop="key">
                <el-input
                  v-model="formRef.formData.key"
                  autocomplete="off"
                  placeholder="服务端唯一键，用于绑定业务逻辑"
                />
              </el-form-item>

              <el-form-item label="webView" prop="webView">
                <el-input
                  v-model="formRef.formData.webView"
                  autocomplete="off"
                  placeholder="web端唯一键，用于web端逻辑处理"
                />
              </el-form-item>
            </div>
          </div>
          <el-form-item label="详细说明" prop="content">
            <el-input
              v-model="formRef.formData.content"
              autocomplete="off"
              placeholder="请输入详细说明"
              type="textarea"
            />
            <!-- <textarea
              rows="3"
              cols="50"
              placeholder="请输入大文本内容"
              v-model="formRef.formData.content"
            /> -->
          </el-form-item>
          <!-- <div class="horizontal-line">
            <div class="line" />
            <div class="content">价格配置</div>
            <div class="line" />
          </div>
          <el-form-item label="默认货币" prop="defaultCurrency">
            <el-select
              v-model="formRef.formData.defaultCurrencyId"
              style="width: 100%"
            >
              <el-option
                v-for="item in formRef.currencySelectList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              /> </el-select
          ></el-form-item>

          <el-form-item label="数量单位" prop="quantityUnit">
            <el-input
              v-model="formRef.formData.quantityUnit"
              autocomplete="off"
              placeholder="请输入展示数量单位"
            />
          </el-form-item>

          <el-form-item label="时间单位" prop="timeUnit">
            <el-input
              v-model="formRef.formData.timeUnit"
              autocomplete="off"
              placeholder="请输入展示时间单位"
            />
          </el-form-item>

          <el-form-item label="计算单位" prop="calculateUnit">
            <el-select
              v-model="formRef.formData.calculateUnit"
              style="width: 100%"
            >
              <el-option :key="0" label="无" :value="0" />
              <el-option :key="1" label="数量" :value="1" />
              <el-option :key="2" label="时间" :value="2" />
              <el-option :key="3" label="数量和时间" :value="3" />
            </el-select>
          </el-form-item>

          <el-form-item label="商品状态" prop="status">
            <el-select v-model="formRef.formData.status" style="width: 100%">
              <el-option :key="0" label="无" :value="0" />
              <el-option :key="1" label="预发布" :value="1" />
              <el-option :key="2" label="已上架" :value="2" />
              <el-option :key="3" label="已下架" :value="3" />
            </el-select>
          </el-form-item> -->
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button size="large" @click="onClose">关闭</el-button>
            <el-button
              v-if="
                formRef.operation === 'create' || formRef.operation === 'edit'
              "
              size="large"
              type="primary"
              @click="onSubmit(ruleFormRef)"
              >提交</el-button
            >
          </div>
        </template>
      </el-dialog>
      <!-- 删除弹窗 -->
      <el-dialog
        v-model="tableDeleteRef.deleteDialogVisible"
        :title="deleteViewContent.title"
        width="20%"
        center
      >
        <span class="dialog-footer" />
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="tableDeleteRef.deleteDialogVisible = false"
              >取消</el-button
            >
            <el-button type="primary" @click="onDelete"> 确定 </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<css lang="scss" scoped>
.dialog-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.button-group {
  display: flex;
  justify-content: flex-start;
  margin-right: 15px;
}
.button-group .el-button {
  margin-right: 6px;
  margin-left: 0;
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
</css>
