<script setup lang="ts">
import { onMounted } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
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
  deleteViewContent
} from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { PureTable } from "@pureadmin/table";
import { tableColumns } from "./menuListColumns";

defineOptions({
  name: "OrderProductTag"
});
const { onSearch, resetSearchForm } = useSearchForm();
const { onDelete, onOpenDeleteDialog, onMuiltSelectionChange } = useDataTable();
const { initForm, onCreate, onEdit, onSubmit, onClose } = useEditForm();
onMounted(() => {
  formRef.value.appMenus = [{ key: 0, value: "无" }];
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
      <el-form-item label="产品类别" prop="name">
        <el-input v-model="searchFormData.name" clearable class="!w-[200px]" />
      </el-form-item>

      <el-form-item label="唯一键字符" prop="key">
        <el-input v-model="searchFormData.key" clearable class="!w-[200px]" />
      </el-form-item>

      <el-form-item label="排序编号" prop="sort">
        <el-input v-model="searchFormData.sort" clearable class="!w-[200px]" />
      </el-form-item>

      <!-- <el-form-item label="" prop="parentId">
        <el-select v-model="searchFormData.parentId" class="!w-[180px]">
          <el-option label="待完成" :value="0" />
        </el-select>
      </el-form-item> -->

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
          @selection-change="onMuiltSelectionChange"
          @page-size-change="onSearch"
          @page-current-change="onSearch"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="onEdit(row)"
              :icon="useRenderIcon(EditPen)"
            >
              修改
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
      <el-dialog
        v-model="formRef.dialogFormVisible"
        :before-close="onClose"
        :title="formRef.dialogTitle"
      >
        <el-form
          ref="ruleFormRef"
          :model="formRef.formData"
          :rules="formRef.rules"
          label-width="80px"
          :disabled="formRef.operation === 'detail'"
        >
          <el-form-item label="产品类别" prop="name">
            <el-input
              v-model="formRef.formData.name"
              autocomplete="off"
              placeholder="请输入产品类别"
            />
          </el-form-item>

          <el-form-item label="唯一键字符" prop="key">
            <el-input
              v-model="formRef.formData.key"
              autocomplete="off"
              placeholder="用于后台业务逻辑处理"
            />
          </el-form-item>

          <el-form-item label="排序编号" prop="sort">
            <el-input-number
              v-model="formRef.formData.sort"
              style="width: 20%"
              :min="0"
            />
          </el-form-item>

          <el-form-item label="父级" prop="parentId">
            <el-select v-model="formRef.formData.parentId" style="width: 100%">
              <el-option :key="0" label="无" :value="0" />
              <el-option :key="1" label="待完成1" :value="1" />
              <el-option :key="2" label="待完成2" :value="2" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button size="small" @click="onClose">关闭</el-button>
            <el-button
              size="small"
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
