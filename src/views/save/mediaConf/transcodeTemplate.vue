<script setup lang="ts">
import { onMounted } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import {
  searchLoading,
  useSearchForm,
  tableDeleteRef,
  useDataTable,
  tableData,
  formRef,
  useEditForm,
  ruleFormRef,
  deleteViewContent
} from "./transocdeTemplate.hook";

defineOptions({
  name: "MediaDefinitionTemplate"
});
const { onSearch } = useSearchForm();
const { onDelete, onOpenDeleteDialog } = useDataTable();
const { initForm, onCreate, onDetail, onSubmit, onClose, onOpen } =
  useEditForm();
onMounted(() => {
  initForm();
  onSearch();
});

function formatDefinition(row, column, cellValue) {
  // console.log("row", row);
  // console.log("column", column);
  // console.log("cellValue", cellValue);
  const definitions = {
    "1": "流畅",
    "2": "标清",
    "3": "高清",
    "4": "超清",
    "5": "原画"
  };
  let explain = "";
  const ll = cellValue.split(",");
  for (let i = 0; i < ll.length; i++) {
    explain += definitions[ll[i]] || ll[i];
    if (i < ll.length - 1) {
      explain += ",";
    }
  }
  return explain;
}
</script>

<template>
  <div class="child">
    <div style="padding: 10px">
      <div style="display: flex; justify-content: space-between">
        <div style="display: flex">
          <h4>[vod视频点播] - 音视频转码模板</h4>
          <a
            style="margin-left: 10px; color: #409eff"
            href="https://vod.console.aliyun.com/#/settings/transcode/list"
            target="_blank"
            >去配置</a
          >
        </div>
        <div>
          <el-button
            type="primary"
            :icon="useRenderIcon(Refresh)"
            :loading="searchLoading"
            @click="onSearch"
          >
            刷新
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon(AddFill)"
            @click="onCreate"
          >
            新增
          </el-button>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column label="模板组名称" prop="templateName" />
        <el-table-column
          label="包含清晰度"
          prop="definition"
          :formatter="formatDefinition"
        />
        <el-table-column label="模板组ID" prop="templateId" />
        <el-table-column align="right">
          <template v-slot="scope">
            <el-button
              size="small"
              @click="onDetail(scope.row)"
              :icon="useRenderIcon(EditPen)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="onOpenDeleteDialog(scope.row, 'single')"
              :icon="useRenderIcon(Delete)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
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
          <el-form-item label="模板组名称" prop="templateName">
            <el-input
              v-model="formRef.formData.templateName"
              autocomplete="off"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="包含清晰度" prop="selectDefinitions">
            <el-select
              v-model="formRef.formData.selectDefinitions"
              placeholder="请选择"
              multiple
              clearable
              style="min-width: 380px"
            >
              <el-option label="流畅" :value="'1'" />
              <el-option label="标清" :value="'2'" />
              <el-option label="高清" :value="'3'" />
              <el-option label="超清" :value="'4'" />
              <el-option label="原画" :value="'5'" />
            </el-select>
          </el-form-item>

          <el-form-item label="模板组ID" prop="templateId">
            <el-input
              v-model="formRef.formData.templateId"
              autocomplete="off"
              placeholder="请输入"
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
