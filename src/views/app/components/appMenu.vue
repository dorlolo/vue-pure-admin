<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import type { FormInstance } from "element-plus";
import warningBar from "@/components/warningBar/warningBar.vue";
import menuInput from "@/components/app/appMenuInput.vue";
import { message } from "@/utils/message";
import {
  AppMenuType,
  deleteAppMenus,
  updateAppMenu,
  createAppMenu
} from "@/api/appMenu";

//基本信息
defineOptions({
  name: "appMenu"
});
const menuListProps = defineProps({
  appMenuList: {
    type: Array as PropType<AppMenuType>
  },
  appId: {
    type: Number
  }
});
// console.log("appMenuList", menuListProps.appMenuList);
// console.log("appId", menuListProps.appId);
////接收父组件方法
const parentEmit = defineEmits(["getMenuList", "getAppId"]);

//表格事件定义
const tableRef = ref({
  deleteId: 0,
  deleteDialogVisible: false
});
const handleSelectionChange = val => {
  formRef.value.list = val;
};
////编辑
const onEdit = (index: number, row: AppMenuType) => {
  formRef.value.formData = row;
  openDialog("edit");
};
////删除
const onDelete = async () => {
  tableRef.value.deleteDialogVisible = false;
  if (tableRef.value.deleteId === 0) {
    message("数据id为0，操作取消", { type: "error" });
  }
  const res = await deleteAppMenus({ id: tableRef.value.deleteId });
  if (res.code != 0) {
    message(res.notice, { type: "error" });
    return;
  } else {
    message("删除成功", { type: "success" });
    updateDataList();
    tableRef.value.deleteId = 0;
  }
};
//// 打开删除提示框
const openDeleteDialog = (row: AppMenuType) => {
  tableRef.value.deleteId = row.id;
  tableRef.value.deleteDialogVisible = true;
};

// 会话表单信息定义
////自定义表单校验规则
const validateParentId = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入文件路径"));
  } else if (formRef.value.formData.id === value) {
    callback(new Error("父级菜单不能是自己"));
  } else {
    callback();
  }
};
const ruleFormRef = ref<FormInstance>();
const formRef = ref<{
  dialogFormVisible: boolean;
  dialogTitle: string;
  operation: string;
  formData: AppMenuType;
  list: Array<any>;
  rules: any;
  appMenus: Array<any>;
}>({
  ////展示表单
  dialogFormVisible: false,
  ////表单表格题
  dialogTitle: "创建菜单",
  //// 操作 create、edit
  operation: "create",
  ////formData表单中的数据，和table中的一样要与prop进行关联
  formData: reactive({
    id: 0,
    appId: 0,
    parentId: 0,
    parentPath: "",
    name: "",
    autoEnable: 1,
    path: "",
    component: "",
    title: "",
    icon: "",
    rank: 0,
    showParent: false,
    keepAlive: false,
    showLink: true
  }),
  list: [],
  ////表单校验规则
  rules: {
    path: [{ required: true, message: "请输入文件路径", trigger: "blur" }],
    parentId: [{ validator: validateParentId, trigger: "blur" }],
    title: [{ required: true, message: "请输入标题", trigger: "blur" }]
  },
  appMenus: []
});
////初始化表单内容
const initForm = () => {
  // formRef.value.form.resetFields();
  formRef.value.formData = {
    id: 0,
    appId: menuListProps.appId,
    parentId: 0,
    parentPath: "",
    name: "",
    autoEnable: 1,
    path: "",
    component: "",
    title: "",
    icon: "",
    rank: null,
    showParent: false,
    keepAlive: false,
    showLink: true
  };
  console.log("初始化表单数据", formRef.value);
};
////更新数据列表
const updateDataList = () => {
  parentEmit("getMenuList");
};
////表单关闭事件
const closeDialogForm = () => {
  initForm();
  formRef.value.dialogFormVisible = false;
};
////打开会话表单
const openDialog = thisDialogTtype => {
  switch (thisDialogTtype) {
    case "create":
      formRef.value.dialogTitle = "新增菜单";
      break;
    case "edit":
      formRef.value.dialogTitle = "编辑菜单";
      break;
    default:
      break;
  }
  formRef.value.operation = thisDialogTtype;
  formRef.value.dialogFormVisible = true;
};
////表单提交事件
const formSumbit = async (formEl: FormInstance | undefined) => {
  console.log("获取appId", formRef.value.formData.appId, menuListProps.appId);
  formRef.value.formData.appId = menuListProps.appId;

  console.log("输入表单数据", formRef.value.formData);
  console.log("operation", formRef.value.operation);
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (childInput.value != formRef.value.formData.parentPath) {
      formRef.value.formData.parentPath = childInput.value;
    }
    formRef.value.formData.rank = Number(formRef.value.formData.rank);
    if (valid) {
      switch (formRef.value.operation) {
        case "create":
          {
            console.log("create action~~!");
            const res = await createAppMenu(formRef.value.formData);
            if (res.code === 0) {
              message("添加成功", { type: "success" });
              updateDataList();
              closeDialogForm();
            } else {
              console.log("添加失败:", res);
              message("添加失败:" + res.notice, { type: "error" });
            }
          }
          break;
        case "edit":
          {
            console.log("edit action~~!");
            const res = await updateAppMenu(formRef.value.formData);
            if (res.code === 0) {
              message("更新成功", { type: "success" });
              updateDataList();
              closeDialogForm();
            } else {
              console.log("更新失败:", res);
              message("添加失败:" + res.notice, { type: "error" });
            }
          }
          break;
        default:
          console.log("unknown action~~!");
          message("未知操作", { type: "error" });
          break;
      }

      updateDropDownNotice.value = Date.now(); //使触发输入框搜索子组件更新数据
    } else {
      updateDataList();
      console.log("error submit!", fields);
      // message("表单填写错误,请检查输入内容再提交", { type: "error" });
    }
  });
};

onMounted(() => {
  formRef.value.appMenus = [{ key: 0, value: "无" }];
  menuListProps.appMenuList.forEach(val => {
    formRef.value.appMenus.push({ key: val.id, value: val.title });
  });
});

////父级菜单选择事件
const parentPathInputSelect = (item: any) => {
  formRef.value.formData.parentId = Number(item.link);
  formRef.value.formData.parentPath = item.value;
};

//接收父级菜单输入框补充组件传递的值（当没有选择选项时)
const childInput = ref("");
const catChildInput = (input: string) => {
  childInput.value = input;
};
const updateDropDownNotice = ref(0);
</script>

<template>
  <div class="gva-btn-list">
    <el-button type="primary" @click="openDialog('create')"
      ><img
        height="18"
        width="18"
        src="../../../assets/svg/add-line.svg"
      />添加</el-button
    >
  </div>
  <!-- table数据 -->
  <el-table
    :data="menuListProps.appMenuList"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column prop="id" label="ID" min-width="65" />
    <el-table-column prop="parentPath" label="父级菜单" min-width="120" />
    <el-table-column prop="name" label="组件名称" min-width="120">
      <template #default="scope">
        <el-tag v-if="scope.row.parentId === 0" class="ml-2" type="info"
          >无</el-tag
        >
        <div v-else class="cell">
          {{ scope.row.name }}
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="autoEnable" label="自动授权" min-width="96">
      <template #default="scope">
        <div class="cell">{{ scope.row.autoEnable === 1 ? "是" : "否" }}</div>
      </template>
    </el-table-column>
    <el-table-column prop="path" label="文件路径" min-width="120" />
    <el-table-column prop="component" label="组件" min-width="120" />
    <el-table-column prop="title" label="标题" min-width="120" />
    <el-table-column prop="icon" label="图标" min-width="120" />
    <el-table-column prop="rank" label="排序" min-width="80" :type="'number'" />
    <el-table-column prop="showParent" label="显示父级" min-width="80">
      <template #default="scope">
        <div class="cell">{{ scope.row.showParent ? "是" : "否" }}</div>
      </template>
    </el-table-column>
    <el-table-column prop="keepAlive" label="页面缓存" min-width="80">
      <template #default="scope">
        <div class="cell">{{ scope.row.keepAlive ? "是" : "否" }}</div>
      </template>
    </el-table-column>
    <el-table-column prop="showLink" label="展示状态" min-width="80">
      <template #default="scope">
        <div class="cell">{{ scope.row.showLink ? "展示" : "隐藏" }}</div>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="150">
      <template #default="scope">
        <el-button
          type="primary"
          size="small"
          @click="onEdit(scope.$index, scope.row)"
          >编辑</el-button
        >
        <el-button
          type="danger"
          size="small"
          @click="openDeleteDialog(scope.row)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <!-- form弹窗数据 -->
  <el-dialog
    v-model="formRef.dialogFormVisible"
    :before-close="closeDialogForm"
    :title="formRef.dialogTitle"
  >
    <warningBar title="新增菜单，需要在角色管理内配置访问权限才可使用" />

    <el-form
      ref="ruleFormRef"
      :model="formRef.formData"
      :rules="formRef.rules"
      label-width="80px"
    >
      <el-form-item label="父级菜单" prop="parentPath">
        <menuInput
          :input="formRef.formData.parentPath"
          :isUpdate="updateDropDownNotice"
          placeHolder="请输入父级菜单路径"
          @handleSelect="parentPathInputSelect"
          @sendInputToParent="catChildInput"
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
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="small" @click="closeDialogForm">关闭</el-button>
        <el-button size="small" type="primary" @click="formSumbit(ruleFormRef)"
          >提交</el-button
        >
      </div>
    </template>
  </el-dialog>
  <!-- 删除弹窗 -->
  <el-dialog
    v-model="tableRef.deleteDialogVisible"
    title="提示"
    width="20%"
    center
  >
    <span class="dialog-footer">
      此操作将永久删除所有角色下该api, 是否继续?
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="tableRef.deleteDialogVisible = false"
          >取消</el-button
        >
        <el-button type="primary" @click="onDelete"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
