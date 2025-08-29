<script setup lang="ts">
import { onMounted } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "~icons/ep/delete";
import View from "~icons/ep/view";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
// import AddFill from "~icons/ri/add-circle-line";
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
  name: "FonchainArtistinfoBackendOperationRecord"
});
const { onSearch, resetSearchForm } = useSearchForm();
const { onDelete, onOpenDeleteDialog, onMultipleSelectionChange } =
  useDataTable();
const { initForm, onDetail, onSubmit, onClose, onOpen } = useEditForm();
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
      <el-form-item label="环境" prop="status">
        <el-select
          v-model="searchFormData.env"
          placeholder="选择环境"
          class="!w-[180px]"
        >
          <el-option label="生产环境" :value="3" />
          <el-option label="测试" :value="2" />
          <el-option label="本地" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="域" prop="domain">
        <el-input
          v-model="searchFormData.domain"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-form-item label="请求id" prop="requestId">
        <el-input
          v-model="searchFormData.requestId"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-form-item label="用户ID" prop="userId">
        <el-input
          v-model="searchFormData.userId"
          type="number"
          clearable
          class="!w-[180px]"
          placeholder="请输入用户ID"
        />
      </el-form-item>

      <el-form-item label="用户名" prop="userName">
        <el-input
          v-model="searchFormData.userName"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-form-item label="请求ip" prop="ip">
        <el-input v-model="searchFormData.ip" clearable class="!w-[200px]" />
      </el-form-item>

      <el-form-item label="数据操作" prop="action">
        <el-input
          v-model="searchFormData.action"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-form-item label="说明" prop="target">
        <el-input
          v-model="searchFormData.target"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-form-item label="请求方式" prop="method">
        <el-input
          v-model="searchFormData.method"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-form-item label="请求头" prop="header">
        <el-input
          v-model="searchFormData.header"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-form-item label="接口路径" prop="path">
        <el-input v-model="searchFormData.path" clearable class="!w-[200px]" />
      </el-form-item>

      <el-form-item label="请求体" prop="body">
        <el-input v-model="searchFormData.body" clearable class="!w-[200px]" />
      </el-form-item>

      <el-form-item label="结果" prop="result">
        <el-input
          v-model="searchFormData.result"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <!-- <el-form-item label="耗时" prop="cost">
        <el-input v-model="searchFormData.cost" clearable class="!w-[200px]" />
      </el-form-item> -->

      <el-form-item label="处理报错" prop="errors">
        <el-input
          v-model="searchFormData.errors"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-form-item label="模块" prop="module">
        <el-input
          v-model="searchFormData.module"
          clearable
          class="!w-[200px]"
        />
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
        <!-- <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="onCreate"
        >
          新增数据
        </el-button> -->
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
              <!-- <el-button
                :disabled="
                  formRef.operation === 'edit' || formRef.operation === 'create'
                "
                type="primary"
                @click="onOpen('edit')"
              >
                编辑
              </el-button> -->
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
          <el-form-item label="模块" prop="module">
            <el-input
              v-model="formRef.formData.module"
              autocomplete="off"
              placeholder=""
            />
          </el-form-item>
          <el-form-item label="域" prop="domain">
            <el-input
              v-model="formRef.formData.domain"
              autocomplete="off"
              placeholder=""
            />
          </el-form-item>

          <el-form-item label="请求id" prop="requestId">
            <el-input
              v-model="formRef.formData.requestId"
              autocomplete="off"
              placeholder=""
            />
          </el-form-item>

          <el-form-item label="用户ID" prop="userId">
            <el-select v-model="formRef.formData.userId" style="width: 100%">
              <el-option :key="0" label="无" :value="0" />
              <el-option :key="1" label="待完成1" :value="1" />
              <el-option :key="2" label="待完成2" :value="2" />
            </el-select>
          </el-form-item>

          <el-form-item label="用户名" prop="userName">
            <el-input
              v-model="formRef.formData.userName"
              autocomplete="off"
              placeholder=""
            />
          </el-form-item>

          <el-form-item label="请求ip" prop="ip">
            <el-input
              v-model="formRef.formData.ip"
              autocomplete="off"
              placeholder=""
            />
          </el-form-item>

          <el-form-item label="数据操作" prop="action">
            <el-input
              v-model="formRef.formData.action"
              autocomplete="off"
              placeholder=""
            />
          </el-form-item>

          <el-form-item label="说明" prop="target">
            <el-input
              v-model="formRef.formData.target"
              autocomplete="off"
              placeholder=""
            />
          </el-form-item>

          <el-form-item label="请求方式" prop="method">
            <el-input
              v-model="formRef.formData.method"
              autocomplete="off"
              placeholder=""
            />
          </el-form-item>

          <el-form-item label="请求头" prop="header">
            <el-input
              v-model="formRef.formData.header"
              autocomplete="off"
              placeholder=""
            />
          </el-form-item>

          <el-form-item label="接口路径" prop="path">
            <el-input
              v-model="formRef.formData.path"
              autocomplete="off"
              placeholder=""
            />
          </el-form-item>

          <el-form-item label="请求体" prop="body">
            <el-input
              type="textarea"
              v-model="formRef.formData.body"
              :rows="4"
              placeholder=""
            />
          </el-form-item>

          <el-form-item label="结果" prop="result">
            <el-input
              type="textarea"
              :autosize="{ minRows: 6, maxRows: 10 }"
              v-model="formRef.formData.result"
              autocomplete="off"
              placeholder=""
            />
          </el-form-item>

          <el-form-item label="耗时" prop="cost">
            <el-input
              v-model="formRef.formData.cost"
              autocomplete="off"
              placeholder=""
            />
          </el-form-item>

          <el-form-item label="处理报错" prop="errors">
            <el-input
              v-model="formRef.formData.errors"
              autocomplete="off"
              placeholder=""
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
<style lang="scss" scoped>
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
</style>
