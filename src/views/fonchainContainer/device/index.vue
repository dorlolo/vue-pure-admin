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
  deleteViewContent,
  useFirmware,
  firmwareRef
} from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { PureTable } from "@pureadmin/table";
import { tableColumns } from "./menuListColumns";

defineOptions({
  name: "FonchainContainerDevice"
});
const { onSearch, resetSearchForm } = useSearchForm();
const { onDelete, onOpenDeleteDialog, onMultipleSelectionChange } =
  useDataTable();
const { initForm, onDetail, onSubmit, onClose, onOpen } = useEditForm();
const {
  onOpenDownFirmwareDialog,
  onCloseFirmwareDialog,
  onConfirmOtaFirmware,
  removeDevice
} = useFirmware();
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
      <el-form-item label="设备号" prop="sn">
        <el-input v-model="searchFormData.sn" clearable class="!w-[200px]" />
      </el-form-item>

      <el-form-item label="所在位置" prop="location">
        <el-input
          v-model="searchFormData.location"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-form-item label="联网状态" prop="netStatus">
        <el-select
          v-model="searchFormData.netStatus"
          class="!w-[180px]"
          clearable
        >
          <el-option label="无" :value="0" />
          <el-option label="在线" :value="1" />
          <el-option label="离线" :value="2" />
        </el-select>
      </el-form-item>

      <el-form-item label="设备状态" prop="useStatus">
        <el-select
          v-model="searchFormData.useStatus"
          class="!w-[180px]"
          clearable
        >
          <el-option label="无" :value="0" />
          <el-option label="使用中" :value="1" />
          <el-option label="作废" :value="2" />
        </el-select>
      </el-form-item>

      <el-form-item label="设备外网IP" prop="ip">
        <el-input v-model="searchFormData.ip" clearable class="!w-[200px]" />
      </el-form-item>

      <el-form-item label="内网Ip" prop="locationIp">
        <el-input
          v-model="searchFormData.locationIp"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-form-item label="LED类型" prop="ledType">
        <el-input
          v-model="searchFormData.ledType"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="searchFormData.remark"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-form-item label="最近一次ping" prop="pingTime">
        <el-input
          v-model="searchFormData.pingTime"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-form-item label="工作模式" prop="mode">
        <el-select v-model="searchFormData.mode" class="!w-[180px]" clearable>
          <el-option label="无" :value="0" />
          <el-option label="正常模式" :value="1" />
          <el-option label="调试模式" :value="2" />
        </el-select>
      </el-form-item>

      <el-form-item label="灯珠数" prop="pinTotal">
        <el-input
          type="number"
          v-model="searchFormData.pinTotal"
          class="!w-[180px]"
      /></el-form-item>

      <el-form-item label="wifi名称" prop="ssid">
        <el-input v-model="searchFormData.ssid" clearable class="!w-[200px]" />
      </el-form-item>

      <el-form-item label="mac地址" prop="mac">
        <el-input v-model="searchFormData.mac" clearable class="!w-[200px]" />
      </el-form-item>

      <el-form-item label="系统版本" prop="version">
        <el-input
          v-model="searchFormData.version"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>

      <el-form-item label="是否关联货架" prop="version">
        <el-select
          v-model="searchFormData.isRelContainer"
          class="!w-[180px]"
          clearable
        >
          <el-option label="是" :value="1" />
          <el-option label="否" :value="2" />
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
          type="warning"
          :disabled="multipleSelectList.length === 0"
          :icon="useRenderIcon(Delete)"
          @click="onOpenDownFirmwareDialog(null)"
        >
          固件更新
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
          <el-form-item label="设备号" prop="sn">
            <el-input
              v-model="formRef.formData.sn"
              autocomplete="off"
              placeholder=""
            />
          </el-form-item>

          <el-form-item label="所在位置" prop="location">
            <el-input
              v-model="formRef.formData.location"
              autocomplete="off"
              placeholder="请输入所在位置"
            />
          </el-form-item>

          <el-form-item label="联网状态" prop="netStatus">
            <el-select v-model="formRef.formData.netStatus" style="width: 100%">
              <el-option :key="0" label="无" :value="0" />
              <el-option :key="1" label="在线" :value="1" />
              <el-option :key="2" label="离线" :value="2" />
            </el-select>
          </el-form-item>

          <el-form-item label="设备状态" prop="useStatus">
            <el-select v-model="formRef.formData.useStatus" style="width: 100%">
              <el-option :key="0" label="无" :value="0" />
              <el-option :key="1" label="使用中" :value="1" />
              <el-option :key="2" label="作废" :value="2" />
            </el-select>
          </el-form-item>

          <el-form-item label="外网IP" prop="ip">
            <el-input
              v-model="formRef.formData.ip"
              autocomplete="off"
              placeholder=""
            />
          </el-form-item>

          <el-form-item label="内网Ip" prop="locationIp">
            <el-input
              v-model="formRef.formData.locationIp"
              autocomplete="off"
              placeholder=""
            />
          </el-form-item>

          <el-form-item label="LED类型" prop="ledType">
            <el-input
              v-model="formRef.formData.ledType"
              autocomplete="off"
              placeholder=""
            />
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="formRef.formData.remark"
              autocomplete="off"
              placeholder=""
            />
          </el-form-item>

          <el-form-item label="最近ping" prop="pingTime">
            <el-input
              v-model="formRef.formData.pingTime"
              autocomplete="off"
              placeholder=""
            />
          </el-form-item>

          <el-form-item label="工作模式" prop="mode">
            <el-select v-model="formRef.formData.mode" style="width: 100%">
              <el-option :key="0" label="无" :value="0" />
              <el-option :key="1" label="正常模式" :value="1" />
              <el-option :key="2" label="调试模式" :value="2" />
            </el-select>
          </el-form-item>

          <el-form-item label="灯珠数" prop="pinTotal">
            <el-input-number
              v-model="formRef.formData.pinTotal"
              style="width: 20%"
              :min="0"
            />
          </el-form-item>

          <el-form-item label="wifi名称" prop="ssid">
            <el-input
              v-model="formRef.formData.ssid"
              autocomplete="off"
              placeholder=""
            />
          </el-form-item>

          <el-form-item label="wifi密码" prop="password">
            <el-input
              v-model="formRef.formData.password"
              autocomplete="off"
              placeholder=""
            />
          </el-form-item>

          <el-form-item label="mac地址" prop="mac">
            <el-input
              v-model="formRef.formData.mac"
              autocomplete="off"
              placeholder=""
            />
          </el-form-item>

          <el-form-item label="系统版本" prop="version">
            <el-input
              v-model="formRef.formData.version"
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

    <div>
      <el-dialog
        v-model="firmwareRef.dialogFormVisible"
        title="更新固件"
        width="50%"
        :before-close="onCloseFirmwareDialog"
      >
        <!-- 固件版本选择 -->
        <el-form label-width="100px">
          <el-form-item label="固件版本">
            <el-select
              v-model="firmwareRef.formData.firmwareTag"
              placeholder="请选择固件版本"
              class="!w-[300px]"
              clearable
            >
              <el-option
                v-for="(version, index) in firmwareRef.firmwareTagList"
                :key="index"
                :label="version"
                :value="version"
              />
            </el-select>
          </el-form-item>

          <!-- 设备SN号列表 -->
          <el-form-item label="设备列表">
            <div>
              <el-tag
                v-for="device in firmwareRef.formData.selectedDeviceList"
                :key="device.sn"
                closable
                @close="removeDevice(device.sn)"
                :type="device.netStatus === 1 ? 'success' : 'danger'"
                class="device-tag"
              >
                {{ device.sn }} ({{ device.netStatus === 1 ? "在线" : "离线" }})
              </el-tag>
            </div>
          </el-form-item>
        </el-form>

        <!-- 确定和取消按钮 -->
        <template #footer>
          <div class="dialog-footer">
            <el-button size="small" @click="onCloseFirmwareDialog"
              >取消</el-button
            >
            <el-button
              size="small"
              type="primary"
              @click="onConfirmOtaFirmware"
              :disabled="firmwareRef.tapConfirm"
            >
              确定
            </el-button>
          </div>
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
