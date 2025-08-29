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
  name: "StudyMemoryCard"
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
      <el-form-item label="" prop="userId">
        <el-select
          v-model="searchFormData.userId"
          placeholder="请选择"
          class="!w-[180px]"
        >
          <el-option label="待完成" :value="0" />
        </el-select>
      </el-form-item>

      <el-form-item label="正面" prop="front">
        <el-input v-model="searchFormData.front" clearable class="!w-[200px]" />
      </el-form-item>

      <el-form-item label="背面" prop="back">
        <el-input v-model="searchFormData.back" clearable class="!w-[200px]" />
      </el-form-item>

      <el-form-item label="学习状态" prop="status">
        <el-select
          v-model="searchFormData.status"
          placeholder="请选择学习状态"
          class="!w-[180px]"
        >
          <el-option label="所有" :value="0" />
          <el-option label="未学习" :value="1" />
          <el-option label="已学习" :value="2" />
          <el-option label="已掌握" :value="3" />
        </el-select>
      </el-form-item>

      <el-form-item label="复习次数" prop="reviewCount">
        <el-select
          v-model="searchFormData.reviewCount"
          placeholder="请选择复习次数"
          class="!w-[180px]"
        >
          <el-option label="待完成" :value="0" />
        </el-select>
      </el-form-item>

      <el-form-item label="" prop="groupId">
        <el-select
          v-model="searchFormData.groupId"
          placeholder="请选择"
          class="!w-[180px]"
        >
          <el-option label="待完成" :value="0" />
        </el-select>
      </el-form-item>

      <el-form-item label="引用卡片id" prop="citeId">
        <el-select
          v-model="searchFormData.citeId"
          placeholder="请选择引用卡片id"
          class="!w-[180px]"
        >
          <el-option label="待完成" :value="0" />
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
      title="菜单列表"
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
          新增菜单
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
              :icon="useRenderIcon(EditPen)"
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
            <span>{{ formRef.operation }}</span>
            <div class="button-group">
              <el-button
                :disabled="formRef.operation === 'detail'"
                type="success"
                @click="onOpen('detail')"
              >
                预览
              </el-button>
              <el-button
                :disabled="formRef.operation === 'edit'"
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
        >
          <el-form-item label="名称" prop="front">
            <textarea
              v-if="formRef.operation !== 'detail'"
              v-model="formRef.formData.front"
              autocomplete="off"
              placeholder="请输入正面内容"
            />
            <div v-else v-html="formRef.frontMarkdown" />
          </el-form-item>

          <el-form-item label="背面" prop="back">
            <textarea
              v-if="formRef.operation !== 'detail'"
              v-model="formRef.formData.back"
              autocomplete="off"
              placeholder="请输入背面内容"
            />
            <div v-else v-html="formRef.backMarkdown" />
          </el-form-item>

          <el-form-item label="学习状态" prop="status">
            <el-select
              v-model="formRef.formData.status"
              placeholder="请选择学习状态"
              style="width: 100%"
            >
              <el-option :key="0" label="无" :value="0" />
              <el-option :key="1" label="未学习" :value="1" />
              <el-option :key="2" label="已学习" :value="2" />
              <el-option :key="3" label="已掌握" :value="3" />
            </el-select>
          </el-form-item>

          <el-form-item label="复习次数" prop="reviewCount">
            <el-input-number
              v-model="formRef.formData.reviewCount"
              style="width: 20%"
              :min="0"
          /></el-form-item>

          <el-form-item label="绑定分组" prop="groupId">
            <el-select v-model="formRef.formData.groupId" style="width: 100%">
              <el-option :key="1" label="待完成1" :value="1" />
              <el-option :key="2" label="待完成1" :value="2" />
            </el-select>
          </el-form-item>

          <el-form-item label="引用卡片" prop="citeId">
            <span>{{ formRef.formData.citeId }}</span>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="onClose">关闭</el-button>
            <el-button
              v-if="formRef.operation === 'edit'"
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
  margin-right: 0;
  margin-left: 0;
}
</css>
