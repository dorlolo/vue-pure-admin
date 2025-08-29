<script setup lang="ts">
import { ref, reactive } from "vue";
import { message } from "@/utils/message";
import type { FormInstance } from "element-plus";
import { ApiType, createApi, deleteApis, updateApi } from "@/api/appApi";
import warningBar from "@/components/warningBar/warningBar.vue";

defineOptions({
  name: "appMenu"
});

//接收父组件信息
const apiProps = defineProps({
  appApiList: {
    type: Array as PropType<ApiType>
  },
  appId: {
    type: Number
  }
});
console.log("appId", apiProps.appId);
const parentEmit = defineEmits(["getApiList"]);

const onEdit = (index: number, row: ApiType) => {
  console.log(index, row);
  data.value.form = row;
  openDialog("edit");
};

//删除会话框
const openDeleteDialog = (row: ApiType) => {
  data.value.deleteDataId = row.id;
  data.value.deleteDialogVisible = true;
};
//删除操作
const onDelete = async () => {
  data.value.deleteDialogVisible = false;
  if (data.value.deleteDataId === 0) {
    message("数据id为0，无法删除", { type: "error" });
  }
  const res = await deleteApis({ id: data.value.deleteDataId });
  if (res.code != 0) {
    message(res.notice, { type: "error" });
    return;
  } else {
    message("删除成功", { type: "success" });
    data.value.deleteDataId = 0;
  }
  parentEmit("getApiList");
};
const methodOptions = [
  {
    key: "POST",
    value: "POST",
    label: "创建",
    type: "success"
  },
  {
    key: "GET",
    value: "GET",
    label: "查看",
    type: ""
  },
  {
    key: "PUT",
    value: "PUT",
    label: "更新",
    type: "warning"
  },
  {
    key: "DELETE",
    value: "DELETE",
    label: "删除",
    type: "danger"
  }
];
function filterMethodOptionsValue(cellValue: string) {
  let value = "";
  methodOptions.forEach(val => {
    if (val.key === cellValue) {
      // value = val.label + " / " + val.value;
      value = val.value;
    }
  });
  return value;
}
// table 相关参数
const handleSelectionChange = val => {
  console.log("触发handleSelectionChange事件");
  data.value.apis = val;
};
//form表单相关参数
const ruleFormRef = ref<FormInstance>();
const data = ref({
  deleteVisible: false,
  //增加、修改表单显示状态
  dialogFormVisible: false,
  //表单会话框标题
  dialogTitle: "新增Api",
  apis: [],
  //form表单中的数据，与table中的保持一致
  form: reactive({
    appId: 0,
    summary: "",
    method: "",
    description: "",
    version: "",
    path: ""
  }),
  methodOptions: methodOptions,
  //请求类型
  type: "",
  //表单校验规则
  rules: {
    path: [{ required: true, message: "请输入api路径", trigger: "blur" }],
    method: [{ required: true, message: "请选择请求方式", trigger: "blur" }],
    summary: [{ required: true, message: "请输入名称", trigger: "blur" }],
    version: [{ required: true, message: "请输入版本号", trigger: "blur" }]
  },
  //删除会话显示状态
  deleteDialogVisible: false,
  //删除内容
  deleteDataId: 0
});
const initForm = () => {
  // apiForm.resetFields();
  data.value.form = {
    appId: apiProps.appId,
    path: "",
    description: "",
    summary: "",
    method: "",
    version: ""
  };
  //重新抓取列表数据
  parentEmit("getApiList");
};
const openDialog = thisDialogTtype => {
  console.log("thisDialogTtype", thisDialogTtype);
  switch (thisDialogTtype) {
    case "addApi":
      data.value.dialogTitle = "新增Api";
      break;
    case "edit":
      data.value.dialogTitle = "编辑Api";
      break;
    default:
      break;
  }
  data.value.type = thisDialogTtype;
  data.value.dialogFormVisible = true;
};
//表单关闭事件
const closeDialog = () => {
  initForm();
  // console.log("appId", apiProps.appId);
  data.value.dialogFormVisible = false;
};
//表单提交事件
const enterDialog = async (formEl: FormInstance | undefined) => {
  console.log("输入表单数据", data.value.form);
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      switch (data.value.type) {
        case "addApi":
          {
            const res = await createApi(data.value.form);
            if (res.code === 0) {
              message("添加", { type: "success" });
              closeDialog();
              parentEmit("getApiList");
            } else {
              message("错误:" + res.notice, { type: "error" });
            }
          }
          break;
        case "edit":
          {
            console.log("update form:", data.value.form);
            const res = await updateApi(data.value.form);
            if (res.code === 0) {
              message("编辑成功", { type: "success" });
              closeDialog();
              parentEmit("getApiList");
            } else {
              message("错误:" + res.notice, { type: "error" });
            }
          }
          break;
        default:
          message("未知操作", { type: "error" });
          break;
      }
    } else {
      console.log("error submit!", fields);
      message("表填填写错误,请检查输入内容再提交", { type: "error" });
    }
  });
};
</script>

<template>
  <div class="gva-btn-list">
    <el-button type="primary" @click="openDialog('addApi')"
      ><img
        height="18"
        width="18"
        src="../../../assets/svg/add-line.svg"
      />添加</el-button
    >
  </div>
  <el-table
    :data="apiProps.appApiList"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column prop="xid" label="序号" min-width="100" />
    <el-table-column prop="summary" label="名称" min-width="150" />
    <el-table-column prop="description" label="简介" min-width="150">
      <template #default="scope">
        <el-popover
          placement="top-start"
          :width="250"
          trigger="hover"
          :content="scope.row.description"
        >
          <template #reference>
            <span>{{
              scope.row.description.length > 10
                ? scope.row.description.substring(1, 10) + "..."
                : scope.row.description
            }}</span>
          </template>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column prop="method" label="请求方式" min-width="150">
      <template #default="scope">
        <el-tag
          :type="
            scope.row.method === 'POST'
              ? 'success'
              : scope.row.method === 'PUT'
              ? 'warning'
              : scope.row.method === 'DELETE'
              ? 'danger'
              : ''
          "
          disable-transitions
          >{{ filterMethodOptionsValue(scope.row.method) }}</el-tag
        >
      </template>
    </el-table-column>
    <el-table-column prop="version" label="版本" min-width="150" />
    <el-table-column prop="path" label="路径" min-width="150" />
    <el-table-column fixed="right" label="操作" min-width="150">
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
  <el-dialog
    v-model="data.dialogFormVisible"
    :before-close="closeDialog"
    :title="data.dialogTitle"
  >
    <warningBar title="新增API，需要在角色管理内配置权限才可使用" />

    <el-form
      ref="ruleFormRef"
      :model="data.form"
      :rules="data.rules"
      label-width="80px"
    >
      <el-form-item label="名称" prop="summary">
        <el-input
          v-model="data.form.summary"
          autocomplete="off"
          placeholder="请输入名称"
        />
      </el-form-item>
      <el-form-item label="请求" prop="method">
        <el-select
          v-model="data.form.method"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in methodOptions"
            :key="item.key"
            :label="`${item.label} / ${item.value}`"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="版本" prop="version">
        <el-input
          v-model="data.form.version"
          autocomplete="off"
          placeholder="请输入版本"
        />
      </el-form-item>
      <el-form-item label="路径" prop="path">
        <el-input
          v-model="data.form.path"
          autocomplete="off"
          placeholder="请输入路径"
        />
      </el-form-item>
      <el-form-item label="api简介" prop="description">
        <el-input
          v-model="data.form.description"
          autocomplete="off"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入简介"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="small" @click="closeDialog">关闭</el-button>
        <el-button size="small" type="primary" @click="enterDialog(ruleFormRef)"
          >提交</el-button
        >
      </div>
    </template>
  </el-dialog>
  <!-- 删除弹窗 -->
  <el-dialog v-model="data.deleteDialogVisible" title="提示" width="20%" center>
    <span class="dialog-footer">
      此操作将永久删除所有角色下该api, 是否继续?
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="data.deleteDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onDelete"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss">
.addItemIcon {
  font-size: 28px;
  background: url("../../assets/svg/add-line.svg") no-repeat;
  background-size: cover;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
