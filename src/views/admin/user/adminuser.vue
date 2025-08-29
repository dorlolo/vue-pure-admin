<script setup lang="ts">
import { ref } from "vue";
import { useUser } from "./hook";
import { PureTable } from "@pureadmin/table";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import AddIcon from "~icons/ri/add-line";
import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";
import { userInfo, ResetPasswd } from "@/api/user";
import { HandleResponseCode } from "@/api/utils";
// import SettIcon from "@iconify-icons/ep/set-up";
defineOptions({
  name: "UserList"
});
const roleEditProps = { multiple: true, checkStrictly: true };

const formRef = ref();
const tableRef = ref();
const {
  searchForm,
  muiltSelectList,
  loading,
  columns,
  dataList,
  onSearch,
  resetForm,
  handleCreate,
  handleUpdate,
  handleDelete,
  handleSelectionChange,
  pagination,
  // checkList,
  authorityTree,
  dialogForm,
  closeDialogForm,
  formSumbit,
  hadleEditAuthority
} = useUser();

const deleteConfirmDialogVisible = ref(false);
const deleteUserInfo = ref<userInfo>();
const deleteUserName = ref("");
function closeDeleteConfirmDialog() {
  deleteConfirmDialogVisible.value = false;
  deleteUserInfo.value = null;
  deleteUserName.value = "";
}
function openDeleteConfirmDialog(row) {
  deleteUserInfo.value = row;
  const tipNames = [];
  if (row.nickName !== "") {
    tipNames.push("昵称:" + row.nickName);
  }
  if (row.phone !== "") {
    tipNames.push("手机号:" + row.phone);
  }
  if (row.username !== "" && tipNames.length < 2) {
    tipNames.push("用户名:" + row.userName);
  }
  if (row.email !== "" && tipNames.length < 2) {
    tipNames.push("邮箱:" + row.email);
  }
  deleteUserName.value = tipNames.join("-");
  deleteConfirmDialogVisible.value = true;
}
async function HandleResetPassword() {
  console.log("重置用户", deleteUserInfo.value.id);
  const response = await ResetPasswd({ id: deleteUserInfo.value.id });
  const success = HandleResponseCode(response);
  if (success) {
    closeDeleteConfirmDialog();
  }
}
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="昵称" prop="nickName">
        <el-input
          v-model="searchForm.nickName"
          placeholder="请输入昵称："
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input
          v-model="searchForm.userName"
          placeholder="请输入用户名："
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="searchForm.phone"
          placeholder="请输入用户名："
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="searchForm.email"
          placeholder="请输入邮箱："
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="UUID" prop="uuid">
        <el-input
          v-model="searchForm.uuid"
          placeholder="请输入UUID："
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="searchForm.status"
          placeholder="请选择用户状态"
          class="!w-[180px]"
        >
          <el-option label="全部" :value="0" />
          <el-option label="禁用" :value="1" />
          <el-option label="启用" :value="2" />
        </el-select>
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

    <PureTableBar title="角色列表" :tableRef="tableRef" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="handleCreate"
        >
          新增用户
        </el-button>
        <el-button
          class="reset-margin"
          type="danger"
          :disabled="muiltSelectList.length === 0"
          :icon="useRenderIcon(Delete)"
          @click="handleDelete"
        >
          删除
        </el-button>
      </template>
      <template v-slot="{ size, checkList }">
        <pure-table
          ref="tableRef"
          border
          align-whole="center"
          row-key="authorityId"
          showOverflowTooltip
          table-layout="auto"
          default-expand-all
          :loading="loading"
          :size="size"
          :checkList="checkList"
          :data="dataList"
          :columns="columns"
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
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
              :icon="useRenderIcon(AddIcon)"
              @click="openDeleteConfirmDialog(row)"
            >
              重置密码
            </el-button>
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
          </template>
        </pure-table>
        <!-- form弹窗 -->
        <el-dialog
          v-model="dialogForm.dialogFormVisible"
          :before-close="closeDialogForm"
          :title="dialogForm.dialogTitle"
        >
          <!-- <warningBar title="新增菜单，需要在角色管理内配置访问权限才可使用" /> -->

          <el-form
            ref="formRef"
            :model="dialogForm.formData"
            :rules="dialogForm.rules"
            label-width="80px"
          >
            <el-form-item label="昵称" prop="nickName">
              <el-input
                v-model="dialogForm.formData.nickName"
                autocomplete="off"
              />
            </el-form-item>

            <el-form-item label="头像" prop="headerImg">
              <el-input
                v-model="dialogForm.formData.headerImg"
                autocomplete="off"
              />
            </el-form-item>

            <el-form-item label="用户名" prop="userName">
              <el-input
                v-model="dialogForm.formData.userName"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="dialogForm.formData.email"
                autocomplete="off"
                placeholder=""
              />
            </el-form-item>

            <el-form-item label="手机号码" prop="phone">
              <el-input
                v-model="dialogForm.formData.phone"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item label="语言" prop="lang">
              <el-input v-model="dialogForm.formData.lang" autocomplete="off" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="dialogForm.formData.status">
                <el-option :key="1" label="未激活" :value="1" />
                <el-option :key="2" label="正常" :value="2" />
                <el-option :key="3" label="禁用" :value="3" />
              </el-select>
            </el-form-item>
            <el-form-item label="密码过期" prop="passwordExpired">
              <el-date-picker
                v-model="dialogForm.formData.passwordExpired"
                type="date"
                placeholder="选择过期时间"
              />
            </el-form-item>
            <el-form-item label="用户角色" prop="authority">
              <el-cascader
                style="width: 100%"
                :disabled="dialogForm.formDataAuthorityList.includes('000')"
                v-model="dialogForm.formDataAuthorityList"
                :props="roleEditProps"
                :options="authorityTree"
                :show-all-levels="false"
                @change="hadleEditAuthority"
              />
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button size="small" @click="closeDialogForm">关闭</el-button>
              <el-button
                size="small"
                type="primary"
                @click="formSumbit(formRef)"
                >提交</el-button
              >
            </div>
          </template>
        </el-dialog>

        <el-dialog
          v-model="deleteConfirmDialogVisible"
          :before-close="closeDeleteConfirmDialog"
          title="您在进行重置密码的操作"
        >
          <div>确认重置【{{ deleteUserName }}】的密码吗？</div>
          <template #footer>
            <div class="dialog-footer">
              <el-button
                size="small"
                type="primary"
                @click="HandleResetPassword"
                >确认</el-button
              >
              <el-button size="small" @click="closeDeleteConfirmDialog"
                >取消</el-button
              >
            </div>
          </template>
        </el-dialog>
      </template>
    </PureTableBar>
  </div>
</template>
<!-- <style scoped lang="scss"></style> -->
