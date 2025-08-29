<script setup lang="ts">
import { ref } from "vue";
import { useAuthority } from "./hook";
import { PureTable } from "@pureadmin/table";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import type { FormInstance } from "element-plus";
import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";

defineOptions({
  name: "Department"
});

const ruleFormRef = ref<FormInstance>();
const formRef = ref();
const tableRef = ref();
const {
  loading,
  columns,
  dataList,
  onSearch,
  resetForm,
  handleUpdate,
  handleDelete,
  handleSelectionChange,

  dialogForm,
  closeDialogForm,
  formSumbit
} = useAuthority();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="dialogForm"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="角色名称：" prop="name">
        <el-input
          v-model="dialogForm.formData.name"
          placeholder="请输入角色名称："
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      title="角色列表"
      :columns="columns"
      :tableRef="tableRef?.getTableRef()"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button type="primary" :icon="useRenderIcon(AddFill)">
          新增角色
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          border
          align-whole="center"
          row-key="id"
          showOverflowTooltip
          table-layout="auto"
          default-expand-all
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
          @page-size-change="onSearch"
          @page-current-change="onSearch"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleUpdate(row)"
              :icon="useRenderIcon(EditPen)"
            >
              修改
            </el-button>
            <el-popconfirm title="是否确认删除?">
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon(Delete)"
                  @click="handleDelete(row)"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
        <!-- form弹窗 -->
        <!-- form弹窗数据 -->
        <el-dialog
          v-model="dialogForm.dialogFormVisible"
          :before-close="closeDialogForm"
          :title="dialogForm.dialogTitle"
        >
          <el-form
            ref="ruleFormRef"
            :model="dialogForm.formData"
            :rules="dialogForm.rules"
            label-width="80px"
          />
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dialogForm.formData.remark" autocomplete="off" />
          </el-form-item>
          <template #footer>
            <div class="dialog-footer">
              <el-button size="small" @click="closeDialogForm">关闭</el-button>
              <el-button
                size="small"
                type="primary"
                @click="formSumbit(ruleFormRef)"
                >提交</el-button
              >
            </div>
          </template>
        </el-dialog>
      </template>
    </PureTableBar>
  </div>
</template>
