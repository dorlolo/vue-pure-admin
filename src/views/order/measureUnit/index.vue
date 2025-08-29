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
  name: "OrderMeasureUnit"
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
      <el-form-item label="分组名称" prop="groupName">
        <el-input
          v-model="searchFormData.groupName"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-form-item label="计量单位名称" prop="name">
        <el-input v-model="searchFormData.name" clearable class="!w-[200px]" />
      </el-form-item>

      <el-form-item label="计量单位key" prop="key">
        <el-input v-model="searchFormData.key" clearable class="!w-[200px]" />
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
            <h4 :id="titleId" :class="titleClass">
              {{ formRef.dialogTitle }}
            </h4>
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
          <el-form-item label="分组名称" prop="groupName">
            <el-input
              v-model="formRef.formData.groupName"
              autocomplete="off"
              placeholder="请输入分组名称"
            />
          </el-form-item>

          <el-form-item label="计量单位名称" prop="name">
            <el-input
              v-model="formRef.formData.name"
              autocomplete="off"
              placeholder="请输入计量单位名称"
            />
          </el-form-item>

          <el-form-item label="计量单位key" prop="key">
            <el-input
              v-model="formRef.formData.key"
              autocomplete="off"
              placeholder="请输入计量单位key"
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
</css>
