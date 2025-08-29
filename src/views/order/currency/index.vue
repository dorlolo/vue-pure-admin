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
  multipleSelectList,
  formRef,
  useEditForm,
  ruleFormRef,
  deleteViewContent
} from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { PureTable } from "@pureadmin/table";
import { tableColumns } from "./menuListColumns";

defineOptions({
  name: "OrderCurrency"
});
const { onSearch, resetSearchForm } = useSearchForm();
const { onDelete, onOpenDeleteDialog, onMultipleSelectionChange } =
  useDataTable();
const { initForm, onCreate, onDetail, onSubmit, onClose, onOpen } =
  useEditForm();
onMounted(() => {
  initForm();
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
      <el-form-item label="货币代码" prop="code">
        <el-input v-model="searchFormData.code" clearable class="!w-[200px]" />
      </el-form-item>

      <el-form-item label="货币名称" prop="name">
        <el-input v-model="searchFormData.name" clearable class="!w-[200px]" />
      </el-form-item>

      <el-form-item label="小数位精度" prop="decimalPlaces">
        <el-select v-model="searchFormData.decimalPlaces" class="!w-[180px]">
          <el-option label="待完成" :value="0" />
        </el-select>
      </el-form-item>

      <el-form-item label="地区" prop="region">
        <el-input
          v-model="searchFormData.region"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-form-item label="是否为辅币" prop="subunit">
        <el-select v-model="searchFormData.subunit" class="!w-[180px]">
          <el-option label="无" :value="0" />
          <el-option label="是" :value="1" />
          <el-option label="否" :value="2" />
        </el-select>
      </el-form-item>

      <el-form-item label="辅币对主币的数量比" prop="ratio">
        <el-select v-model="searchFormData.ratio" class="!w-[180px]">
          <el-option label="待完成" :value="0" />
        </el-select>
      </el-form-item>

      <el-form-item label="单位" prop="unit">
        <el-input v-model="searchFormData.unit" clearable class="!w-[200px]" />
      </el-form-item>

      <el-form-item label="备注" prop="notes">
        <el-input v-model="searchFormData.notes" clearable class="!w-[200px]" />
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
      title="数据列表"
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
          新增数据
        </el-button>
        <el-button
          class="reset-margin"
          type="danger"
          :disabled="multipleSelectList.length === 0"
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
          @selection-change="onMultipleSelectionChange"
          @page-size-change="onSearch"
          @page-current-change="onSearch"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="onDetail(row)"
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

      <!-- :title="formRef.dialogTitle" -->
      <el-dialog v-model="formRef.dialogFormVisible" :before-close="onClose">
        <template #header="{ titleId, titleClass }">
          <div class="dialog-header">
            <h4 :id="titleId" :class="titleClass">{{ formRef.dialogTitle }}</h4>
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
          <el-form-item label="货币代码" prop="code">
            <el-input
              v-model="formRef.formData.code"
              autocomplete="off"
              placeholder="请输入货币代码"
            />
          </el-form-item>

          <el-form-item label="货币名称" prop="name">
            <el-input
              v-model="formRef.formData.name"
              autocomplete="off"
              placeholder="请输入货币名称"
            />
          </el-form-item>

          <el-form-item label="小数位精度" prop="decimalPlaces">
            <el-input-number
              v-model="formRef.formData.decimalPlaces"
              style="width: 20%"
              :min="0"
            />
          </el-form-item>

          <el-form-item label="地区" prop="region">
            <el-input
              v-model="formRef.formData.region"
              autocomplete="off"
              placeholder="请输入地区"
            />
          </el-form-item>
          <div class="columnContainer">
            <el-form-item label="是否为辅币" prop="subunit" class="column1">
              <el-select v-model="formRef.formData.subunit" class="!w-[100px]">
                <el-option label="是" :value="1" />
                <el-option label="否" :value="2" />
              </el-select>
            </el-form-item>

            <el-form-item
              v-if="formRef.formData.subunit === 1"
              label="辅币对主币的数量比"
              prop="ratio"
              class="column2"
            >
              <el-input-number
                v-model="formRef.formData.ratio"
                style="width: 20%"
                :min="0"
                class="!w-[150px]"
              />
            </el-form-item>
          </div>
          <el-form-item label="单位" prop="unit">
            <el-input
              v-model="formRef.formData.unit"
              autocomplete="off"
              placeholder="请输入单位"
            />
          </el-form-item>
          <el-form-item label="中文单位" prop="unit">
            <el-input
              v-model="formRef.formData.cnUnit"
              autocomplete="off"
              placeholder="请输入中文单位"
            />
          </el-form-item>

          <el-form-item label="备注" prop="notes">
            <el-input
              v-model="formRef.formData.notes"
              autocomplete="off"
              placeholder="请输入备注"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button size="small" @click="onClose">关闭</el-button>
            <el-button
              size="small"
              type="primary"
              @click="onSubmit(ruleFormRef)"
              v-if="
                formRef.operation === 'create' || formRef.operation === 'edit'
              "
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
.el-form-item__label {
  white-space: nowrap;
  // overflow: hidden;
  text-overflow: ellipsis;
}
.columnContainer {
  display: flex;
  justify-content: space-between; /* 添加这一行 */
}
.column1 {
  flex: 1; /* 均分宽度 */
  // width: 30%; /* 宽度 */
}
.column2 {
  flex: 1; /* 均分宽度 */
  // width: 70%; /* 宽度 */
}
</css>
