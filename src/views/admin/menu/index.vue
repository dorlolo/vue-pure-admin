<script setup lang="ts">
import { onMounted } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import warningBar from "@/components/warningBar/warningBar.vue";
import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
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
  muiltSelectList,
  formRef,
  useEditForm,
  ruleFormRef,
  deleteViewContent,
  updateParentPathDropDownNotice,
  parentPathInputSelect,
  catParentPathInput,
  updateAppNameDropDownNotice,
  appNameInputSelect,
  catAppNameInput,
  initFormSelector
} from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { PureTable } from "@pureadmin/table";
import { tableColumns } from "./menuListColumns";
import menuInput from "@/components/app/appMenuInput.vue";
import appNameInput from "@/components/app/appNameInput.vue";

defineOptions({
  name: "MenuList"
});
const { onSearch, resetSearchForm } = useSearchForm();
const { onDelete, onOpenDeleteDialog } = useDataTable();
const { initForm, onCreate, onEdit, onSubmit, onClose } = useEditForm();
onMounted(() => {
  onSearch();
  initForm();
  initFormSelector();
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
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="searchFormData.name"
          placeholder="请输入名称："
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="searchFormData.title"
          placeholder="请输入标题："
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="路径" prop="path">
        <el-input
          v-model="searchFormData.path"
          placeholder="请输入路径："
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="自动授权" prop="autoEnable">
        <el-select
          v-model="searchFormData.autoEnable"
          placeholder="请选择自动授权状态"
          class="!w-[180px]"
        >
          <el-option label="无" :value="0" />
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="2" />
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

    <!-- :tableRef="tableData" -->
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
        <warningBar title="新增菜单后，需要在角色管理内配置访问权限才可使用" />

        <el-form
          ref="ruleFormRef"
          :model="formRef.formData"
          :rules="formRef.rules"
          label-width="80px"
        >
          <el-form-item label="所属应用" prop="appName">
            <appNameInput
              :input="formRef.formData.appName"
              :isUpdate="updateAppNameDropDownNotice"
              placeHolder="请输入应用名称"
              @handleSelect="appNameInputSelect"
              @sendInputToParent="catAppNameInput"
            />
          </el-form-item>
          <el-form-item label="父级菜单" prop="parentPath">
            <menuInput
              :input="formRef.formData.parentPath"
              :isUpdate="updateParentPathDropDownNotice"
              placeHolder="请输入父级菜单路径"
              @handleSelect="parentPathInputSelect"
              @sendInputToParent="catParentPathInput"
            />
          </el-form-item>

          <el-form-item
            v-if="formRef.formData.parentId > 0"
            label="名称"
            prop="name"
          >
            <el-input
              v-model="formRef.formData.name"
              autocomplete="off"
              placeholder="请输入vue文件中使用defineOptions函数定义的name"
            />
          </el-form-item>

          <el-form-item label="自动授权" prop="name">
            <el-select
              v-model="formRef.formData.autoEnable"
              placeholder="请选择（选是表示创建角色时自动添加）"
              style="width: 100%"
            >
              <el-option :key="1" label="是" :value="1" />
              <el-option :key="2" label="否" :value="2" />
            </el-select>
          </el-form-item>

          <el-form-item label="文件路径" prop="path">
            <el-input
              v-model="formRef.formData.path"
              autocomplete="off"
              placeholder="例: /app/appDetail(实际位置为/src/view/app/appDetail.vue)"
            />
          </el-form-item>

          <el-form-item label="组件" prop="component">
            <el-input
              v-model="formRef.formData.component"
              autocomplete="off"
              placeholder="可不填，会根据文件路径自动索引。示例:fighting/index,对应的是实际业务 `.vue` 或 `.tsx` 代码路径"
            />
          </el-form-item>

          <el-form-item label="标题" prop="title">
            <el-input
              v-model="formRef.formData.title"
              autocomplete="off"
              placeholder="在菜单或标题栏展示的名称"
            />
          </el-form-item>

          <el-form-item label="图标" prop="icon">
            <el-input v-model="formRef.formData.icon" autocomplete="off" />
          </el-form-item>

          <el-form-item label="排序" prop="rank">
            <el-input
              v-model="formRef.formData.rank"
              autocomplete="off"
              placeholder="可不填，后端会自动赋值"
            />
          </el-form-item>

          <el-form-item label="显示父级" prop="showParent">
            <el-select
              v-model="formRef.formData.showParent"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option :key="1" label="是" :value="true" />
              <el-option :key="0" label="否" :value="false" />
            </el-select>
          </el-form-item>

          <el-form-item label="页面缓存" prop="keepAlive">
            <el-select
              v-model="formRef.formData.keepAlive"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option :key="1" label="是" :value="true" />
              <el-option :key="0" label="否" :value="false" />
            </el-select>
          </el-form-item>

          <el-form-item label="展示状态" prop="showLink">
            <el-select
              v-model="formRef.formData.showLink"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option :key="1" label="展示" :value="true" />
              <el-option :key="0" label="隐藏" :value="false" />
            </el-select>
          </el-form-item>
          <el-form-item label="权限" prop="authList">
            <div
              v-for="(auth, index) in formRef.formData.authList"
              :key="index"
            >
              <el-input
                v-model="auth.name"
                placeholder="权限名称"
                style="width: 200px; margin-right: 10px"
              />
              <el-input
                v-model="auth.value"
                placeholder="权限值"
                style="width: 200px; margin-right: 10px"
              />
              <el-button
                type="danger"
                :icon="useRenderIcon(Delete)"
                @click="formRef.formData.authList.splice(index, 1)"
                >删除</el-button
              >
            </div>
            <el-button
              type="primary"
              :icon="useRenderIcon(AddFill)"
              @click="formRef.formData.authList.push({ name: '', value: '' })"
              >新增权限</el-button
            >
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
        <span class="dialog-footer"> {{ deleteViewContent.content }} </span>
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
