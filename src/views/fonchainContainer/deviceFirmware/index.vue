<script setup lang="ts">
import { onMounted } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "~icons/ep/delete";
// import View from "~icons/ep/view";
import Upload from "~icons/ep/upload";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";
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
  deleteViewContent,
  useUpload
} from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { PureTable } from "@pureadmin/table";
import { tableColumns } from "./menuListColumns";

defineOptions({
  name: "FonchainContainerDeviceFirmware"
});
const { onSearch, resetSearchForm } = useSearchForm();
const { onDelete, onOpenDeleteDialog, onMultipleSelectionChange } =
  useDataTable();
const { initForm, onCreate, onClose, onOpen } = useEditForm();
onMounted(() => {
  initForm();
  onSearch();
});
const {
  handleFileChange,
  onUploadSubmit,
  handleUploadSuccess,
  handleUploadError,
  uploadRef,
  uploadActionUrl,
  onOta
} = useUpload();
</script>

<template>
  <div>
    <el-form
      ref="searchFormRef"
      :inline="true"
      :model="searchFormData"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="版本号" prop="version">
        <el-input
          v-model="searchFormData.version"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <!-- <el-form-item label="" prop="url">
        <el-input v-model="searchFormData.url" clearable class="!w-[200px]" />
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
            <!-- <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="onDetail(row)"
              :icon="useRenderIcon(View)"
            >
              详情
            </el-button> -->
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="onOta(row)"
              :icon="useRenderIcon(Upload)"
            >
              OTA升级
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
          <el-form-item
            label="版本号"
            prop="version"
            v-if="formRef.operation !== 'create'"
          >
            <el-input
              v-model="formRef.formData.version"
              autocomplete="off"
              placeholder="请输入版本号"
            />
          </el-form-item>

          <el-form-item
            label="文件链接"
            prop="url"
            v-if="
              formRef.fileList.length === 0 && formRef.operation !== 'create'
            "
          >
            <el-input
              v-model="formRef.formData.url"
              autocomplete="off"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="文件上传"
            prop="file"
            v-if="!formRef.formData.url"
          >
            <el-upload
              ref="uploadRef"
              class="upload-demo"
              :on-change="handleFileChange"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              :file-list="formRef.fileList"
              :limit="1"
              :auto-upload="false"
              accept=".bin"
              :data="formRef.formData"
              :action="uploadActionUrl"
            >
              <el-button type="primary">选择文件</el-button>
              <template #tip>
                <div class="el-upload__tip">只支持 bin 格式文件</div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button size="small" @click="onClose">关闭</el-button>
            <el-button
              size="small"
              type="primary"
              @click="onUploadSubmit(ruleFormRef)"
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
