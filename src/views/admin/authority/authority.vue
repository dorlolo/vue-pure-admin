<script setup lang="ts">
import { ref } from "vue";
import { useAuthority } from "./hook";
import { PureTable } from "@pureadmin/table";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Menus from "./components/menus.vue";
import APis from "./components/apis.vue";
import AddIcon from "~icons/ri/add-line";
import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";
import SettIcon from "~icons/ep/set-up";

defineOptions({
  name: "Authority"
});

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
  handleCreateChild,
  handleCreate,
  handleUpdate,
  handleDelete,
  handleSelectionChange,
  // checkList,
  ruleFormRef,
  dialogForm,
  closeDialogForm,
  formSumbit,
  handleAuthoritySet,
  //抽屉
  selectedRow,
  showDrawer,
  dwawerAutoEnter
} = useAuthority();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="角色名称：" prop="name">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入角色名称："
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="角色编号：" prop="authority_id">
        <el-input
          v-model="searchForm.authorityId"
          placeholder="请输入角色编号："
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select
          v-model="searchForm.status"
          placeholder="请选择状态"
          class="!w-[180px]"
        >
          <el-option label="全部" :value="0" />
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="2" />
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
          新增角色
        </el-button>
        <el-button
          class="reset-margin"
          type="danger"
          :disabled="muiltSelectList.length === 0"
          :icon="useRenderIcon(Delete)"
          @click="handleDelete()"
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
          @selection-change="handleSelectionChange"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleCreateChild(row)"
              :icon="useRenderIcon(AddIcon)"
            >
              添加子角色
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
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(SettIcon)"
              @click="handleAuthoritySet(row)"
            >
              设置权限
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
            ref="ruleFormRef"
            :model="dialogForm.formData"
            :rules="dialogForm.rules"
            label-width="80px"
          >
            <el-form-item label="父级角色" prop="parentId">
              <el-select
                v-model="dialogForm.formData.parentId"
                :disabled="!dialogForm.parentIdVisible"
              >
                <el-option
                  v-for="item in dialogForm.searchSelectList"
                  :key="item.authorityId"
                  :label="item.name"
                  :value="item.authorityId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="dialogForm.formData.name" autocomplete="off" />
            </el-form-item>

            <el-form-item label="角色编号" prop="authorityId">
              <el-input
                v-model="dialogForm.formData.authorityId"
                autocomplete="off"
                placeholder="可不填,后态会自动配置"
              />
            </el-form-item>
            <el-form-item label="默认菜单" prop="defaultMenu">
              <el-input
                v-model="dialogForm.formData.defaultMenu"
                autocomplete="off"
                placeholder="/welcome"
              />
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-select
                v-model="dialogForm.formData.status"
                style="width: 100%"
              >
                <el-option :key="1" label="启用" :value="1" />
                <el-option :key="2" label="禁用" :value="2" />
              </el-select>
            </el-form-item>

            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="dialogForm.formData.remark"
                autocomplete="off"
                placeholder="选填"
              />
            </el-form-item>
          </el-form>
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
    <el-drawer
      v-if="showDrawer"
      v-model="showDrawer"
      :with-header="true"
      size="40%"
      height="100%"
    >
      <template #header>
        <div style="display: flex">
          <h2>{{ selectedRow.name }}</h2>
          <text style="margin-top: 10px">权限设置</text>
        </div>
      </template>
      <el-tabs :before-leave="dwawerAutoEnter" type="border-card">
        <el-tab-pane label="菜单">
          <Menus ref="menus" :row="selectedRow" />
        </el-tab-pane>
        <el-tab-pane label="Api">
          <APis ref="menus" :row="selectedRow" />
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>
<style scoped lang="scss">
::v-deep(.el-drawer__header) {
  align-items: center;
  color: #72767b;
  display: flex;
  margin-bottom: 10px;
  padding: var(--el-drawer-padding-primary);
  padding-bottom: 0;
  // border-bottom: thick black #a0cfff;
}

::v-deep(.el-drawer__body) {
  flex: 1;
  // padding: var(--el-drawer-padding-primary);
  padding: 0;
  overflow-y: hidden;
}

// .role-box {
//   .el-tabs__content {
//     height: calc(100vh - 72px);
//     overflow: auto;
//   }
// }

.el-tab-pane {
  height: calc(100vh - 172px);
  overflow-y: scroll;
}
</style>
