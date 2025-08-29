<script setup lang="ts">
import { onMounted } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "@iconify-icons/ep/delete";
import View from "@iconify-icons/ep/view";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import Download from "@iconify-icons/ri/download-fill";
import Recovery from "@iconify-icons/ri/device-recover-line";
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
import { formatDate } from "@/utils/date";
import { formatBytes } from "@/components/upload/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { PureTable } from "@pureadmin/table";
import { tableColumns } from "./menuListColumns";
import uploadFile from "@/components/upload/uploadFile.vue";

defineOptions({
  name: "UserMedia"
});

const { onSearch, resetSearchForm } = useSearchForm();
const {
  onDelete,
  onOpenDeleteDialog,
  onOpenRecoveryDialog,
  onMultipleSelectionChange
} = useDataTable();
const {
  initForm,
  onCreate,
  onDetail,
  onSubmit,
  onClose,
  onOpen,
  handleDownload
} = useEditForm();
onMounted(() => {
  initForm();
  onSearch();
});
const getFileType = fileType => {
  switch (fileType) {
    case 1:
      return "视频";
    case 2:
      return "音频";
    case 3:
      return "图片";
    case 4:
      return "文件";
    case 5:
      return "其它";
    default:
      return "未知";
  }
};
</script>

<template>
  <div>
    <el-form
      ref="searchFormRef"
      :inline="true"
      :model="searchFormData"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item label="查询已删除" prop="queryDeleted">
            <el-select v-model="searchFormData.queryDeleted" class="!w-[180px]">
              <el-option label="否" :value="0" />
              <el-option label="是" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="用户附件uid" prop="uid">
            <el-input
              v-model="searchFormData.uid"
              clearable
              class="!w-[200px]"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="文件类型" prop="fileType">
            <el-select
              v-model="searchFormData.fileType"
              clearable
              class="!w-[180px]"
            >
              <el-option label="全部" :value="0" />
              <el-option label="视频" :value="1" />
              <el-option label="音频" :value="2" />
              <el-option label="图片" :value="3" />
              <el-option label="文件" :value="4" />
              <el-option label="其它" :value="5" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="后缀格式" prop="formatType">
            <el-input
              v-model="searchFormData.formatType"
              clearable
              class="!w-[200px]"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="md5值" prop="md5">
            <el-input
              v-model="searchFormData.md5"
              clearable
              class="!w-[200px]"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="来源" prop="source">
            <el-input
              v-model="searchFormData.source"
              clearable
              class="!w-[200px]"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="上传状态" prop="uploadState">
            <el-select
              v-model="searchFormData.uploadState"
              clearable
              class="!w-[180px]"
            >
              <el-option label="无" :value="0" />
              <el-option label="待上传" :value="1" />
              <el-option label="失败" :value="2" />
              <el-option label="成功" :value="3" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="标题" prop="title">
            <el-input
              v-model="searchFormData.title"
              clearable
              class="!w-[200px]"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="searchFormData.description"
              clearable
              class="!w-[200px]"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item
            v-if="searchFormData.querySelf == 0"
            label="用户昵称"
            prop="nickName"
          >
            <el-input
              v-model="searchFormData.nickName"
              clearable
              class="!w-[200px]"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6" v-if="searchFormData.querySelf == 0">
          <el-form-item label="用户uid" prop="userUid">
            <el-input
              v-model="searchFormData.userUid"
              clearable
              class="!w-[200px]"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6" v-if="searchFormData.querySelf == 0">
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="searchFormData.phone"
              clearable
              class="!w-[200px]"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6" v-if="searchFormData.querySelf == 0">
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="searchFormData.email"
              clearable
              class="!w-[200px]"
            />
          </el-form-item>
        </el-col>

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
      </el-row>
    </el-form>

    <PureTableBar
      title="数据列表"
      @refresh="onSearch"
      :columns="tableColumns"
      :tableRef="tableRef?.getTableRef()"
    >
      <template #buttons>
        <div class="switch-self">
          <span class="words">只看自己</span>
          <el-switch
            v-model="searchFormData.querySelf"
            active-value="1"
            inactive-value="0"
            active-color="#67C23A"
            @click="onSearch"
          />
        </div>

        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="onCreate"
        >
          上传文件
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
              :disabled="!row.url"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleDownload(row)"
              :icon="useRenderIcon(Download)"
            >
              下载
            </el-button>
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
              type="danger"
              :size="size"
              :icon="useRenderIcon(Delete)"
              @click="onOpenDeleteDialog(row, 'single')"
              v-if="!row.deletedAt"
            >
              删除
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="warning"
              :size="size"
              :icon="useRenderIcon(Recovery)"
              @click="onOpenRecoveryDialog(row)"
              v-if="row.deletedAt"
            >
              恢复
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
    <div>
      <!-- form弹窗数据 -->

      <!-- :title="formRef.dialogTitle" -->
      <el-dialog
        v-model="formRef.dialogFormVisible"
        :before-close="onClose"
        width="80%"
      >
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
          <el-form-item label="标题" prop="title">
            <el-input
              v-model="formRef.formData.title"
              autocomplete="off"
              placeholder="请输入标题"
            />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="formRef.formData.description"
              autocomplete="off"
              placeholder="请输入描述"
              type="textarea"
            />
          </el-form-item>

          <el-form-item
            label="上传区域"
            v-if="
              formRef.formData.uploadState != 3 &&
              formRef.operation !== 'detail'
            "
          >
            <div class="upload-container">
              <uploadFile />
            </div>
          </el-form-item>
          <div class="formContainer" v-if="formRef.operation === 'detail'">
            <div class="form-group">
              <div class="group-title">所属用户</div>
              <span>用户UID：{{ formRef.formData.userUid }}</span>
              <span>用户名：{{ formRef.formData.nickName }}</span>
              <span>电话：{{ formRef.formData.phone }}</span>
              <span>邮箱：{{ formRef.formData.email }}</span>
            </div>
            <div class="form-group">
              <span class="group-title">文件信息</span>
              <span>UID：{{ formRef.formData.uid }}</span>
              <span>类型：{{ getFileType(formRef.formData.fileType) }}</span>
              <span>后缀：{{ formRef.formData.formatType }}</span>
              <span>大小：{{ formatBytes(formRef.formData.size) }}</span>
              <span>链接：{{ formRef.formData.url }}</span>
              <span
                >创建时间：{{ formatDate(formRef.formData.createdAt) }}</span
              >
              <span
                >更新时间：{{ formatDate(formRef.formData.updatedAt) }}</span
              >
            </div>
          </div>
        </el-form>
        <template #footer>
          <div>
            <el-button @click="onClose">关闭</el-button>
            <el-button type="primary" @click="onSubmit(ruleFormRef)"
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
        <template #footer>
          <span>
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
.switch-self {
  display: flex;
  align-items: center;
  margin-right: 15px;
  border-radius: 5px;
  background-color: #4caf50;
  padding: 0px 5px;
}
.words {
  padding-top: 3px;
  margin-right: 2px;
  color: #ececec;
  font-size: 14px;
}
.upload-container {
  width: 100%;
  border: 2px solid #409eff; /* 示例：蓝色边框 */
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}
.formContainer {
  display: flex;
  flex-direction: row;
  align-items: left;
}
.formContainer .form-group {
  display: flex;
  flex-direction: column;
  align-items: left;
  margin: 2px 0px;
  padding-left: 40px;
}
.formContainer .group-title {
  margin-bottom: 10px;
  font-weight: bold; /* 加粗 */
}
.el-form-item__label {
  font-weight: bold; /* 加粗 */
}
</css>
