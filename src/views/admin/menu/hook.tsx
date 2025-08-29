import { ref, reactive } from "vue";
import { message } from "@/utils/message";
import type { FormInstance } from "element-plus";
import { HandleResponseCode } from "@/api/utils";
import {
  ViewAppMenuType,
  deleteAppMenus,
  updateAppMenu,
  createAppMenu,
  GetMenuTree
} from "@/api/appMenu";
import { getAppList } from "@/api/app";
//-----------------------------搜索表单-----------------------------------
export const searchFormRef = ref();
export const searchLoading = ref(false);
export const searchFormData = reactive({
  name: "",
  title: "",
  path: "",
  autoEnable: 0
});
//-----------------------------列表数据-----------------------------------
export const deleteViewContent = ref({
  title: "确定要删除吗？",
  content: "此操作会同时删除其名下的所有子菜单，是否确定？"
});
export const tableRef = ref();
export const tableRefRowKey = "id"; //数据中的唯一键名
export const muiltSelectList = ref([]); //多选列表
export const tableData = ref<ViewAppMenuType[]>([]);
export const tableDeleteRef = ref({
  deleteId: 0,
  deleteDialogVisible: false,
  deleteMode: "single" //single or mult
});
//-----------------------------编辑表单-----------------------------------

export const ruleFormRef = ref<FormInstance>();
////表单校验规则
const validateParentId = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入文件路径"));
  } else if (formRef.value.formData.id === value) {
    callback(new Error("父级菜单不能是自己"));
  } else {
    callback();
  }
};
export const formRef = ref<{
  dialogFormVisible: boolean;
  dialogTitle: string;
  operation: string;
  formData: ViewAppMenuType;
  list: Array<any>;
  rules: any;
  menuSelector: Array<any>; //菜单选择器数据
  appSelector: Array<any>; //应用选择器数据
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
    showLink: true,
    appName: ""
  }),
  list: [],
  ////表单校验规则
  rules: {
    appId: [{ required: true, message: "请绑定应用", trigger: "blur" }],
    path: [{ required: true, message: "请输入文件路径", trigger: "blur" }],
    parentId: [{ validator: validateParentId, trigger: "blur" }],
    title: [{ required: true, message: "请输入标题", trigger: "blur" }]
  },
  menuSelector: [],
  appSelector: []
});

//接收父级菜单输入框补充组件传递的值（当没有选择选项时)
//父级菜单路径选择器
const parentPathInput = ref("");
export const updateParentPathDropDownNotice = ref(0);
export const parentPathInputSelect = (item: any) => {
  formRef.value.formData.parentId = Number(item.link);
  formRef.value.formData.parentPath = item.value;
};
export const catParentPathInput = (input: string) => {
  parentPathInput.value = input;
};
//应用信息选择器
const appNameInput = ref("");
export const updateAppNameDropDownNotice = ref(0);
export const appNameInputSelect = (item: any) => {
  formRef.value.formData.appId = Number(item.link);
  formRef.value.formData.appName = item.value;
};
export const catAppNameInput = (input: string) => {
  appNameInput.value = input;
};

export const initFormSelector = async () => {
  formRef.value.menuSelector = [{ key: 0, value: "无" }];
  tableData.value.forEach(val => {
    formRef.value.menuSelector.push({ key: val.id, value: val.title });
  });
  const result = await getAppList({
    page: 1,
    pageSize: -1
  });

  formRef.value.menuSelector = [{ key: 0, value: "无" }];
  result.list.forEach(val => {
    formRef.value.appSelector.push({ key: val.id, value: val.name });
  });
  console.log("formRef.value.appSelector", formRef.value.appSelector);
};
//---------------------------------------hooks---------------------------------------
export function useSearchForm() {
  function resetSearchForm(formEl) {
    console.log("resetSearchForm", formEl);
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  //搜索菜单
  async function onSearch() {
    searchLoading.value = true;
    setTimeout(() => {
      searchLoading.value = false;
    }, 500);
    const response = await GetMenuTree({
      page: 1,
      pageSize: -1,
      name: searchFormData.name,
      title: searchFormData.title,
      path: searchFormData.path,
      autoEnable: searchFormData.autoEnable
    });
    console.log("response", response);
    if (response.code != 0) {
      message(response.notice, { type: "error" });
      return;
    }
    tableData.value = response.list;
  }
  return {
    resetSearchForm,
    onSearch
  };
}

export function useDataTable() {
  const { onSearch } = useSearchForm();
  // 打开删除提示框
  function onOpenDeleteDialog(
    row: ViewAppMenuType,
    deleteMode: "single" | "mult"
  ) {
    if (row !== null) {
      tableDeleteRef.value.deleteId = row.id;
    }
    tableDeleteRef.value.deleteDialogVisible = true;
    tableDeleteRef.value.deleteMode = deleteMode;
  }

  //删除菜单
  async function onDelete() {
    let res;
    switch (tableDeleteRef.value.deleteMode) {
      case "single":
        if (tableDeleteRef.value.deleteId === 0) {
          message("数据id为0，操作取消", { type: "error" });
        }
        res = await deleteAppMenus({ id: tableDeleteRef.value.deleteId });
        break;
      case "mult":
        res = await deleteAppMenus({ ids: muiltSelectList.value });
        break;
      default:
        break;
    }

    if (HandleResponseCode(res)) {
      tableDeleteRef.value.deleteId = 0;
      muiltSelectList.value = [];
      onSearch();
    }
    tableDeleteRef.value.deleteDialogVisible = false;
  }
  function onMuiltSelectionChange(val) {
    muiltSelectList.value = [];
    val.forEach(el => {
      muiltSelectList.value.push(el.id);
    });
    console.log("handleSelectionChange", val);
    console.log("muiltSelectList", muiltSelectList.value);
  }
  return {
    onSearch,
    onDelete,
    onOpenDeleteDialog,
    onMuiltSelectionChange
  };
}

export function useEditForm() {
  const { onSearch } = useDataTable();

  const initForm = () => {
    formRef.value.formData = {
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
      rank: null,
      showParent: false,
      keepAlive: false,
      showLink: true,
      appName: ""
    };
    console.log("初始化表单数据", formRef.value);
  };

  //打开会话表单
  function onOpen(id: number | undefined) {
    if (id > 0) {
      formRef.value.dialogTitle = "编辑菜单";
      formRef.value.operation = "edit";
    } else {
      formRef.value.dialogTitle = "新增菜单";
      formRef.value.operation = "create";
    }
    formRef.value.dialogFormVisible = true;
  }

  //提交表单
  async function onSubmit(formEl: FormInstance | undefined) {
    console.log("输入表单数据", formRef.value.formData);
    console.log("operation", formRef.value.operation);
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (parentPathInput.value != formRef.value.formData.parentPath) {
        formRef.value.formData.parentPath = parentPathInput.value;
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
                onClose();
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
                onClose();
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

        updateParentPathDropDownNotice.value = Date.now(); //使触发输入框搜索子组件更新数据
      } else {
        onSearch();
        console.log("error submit!", fields);
        // message("表单填写错误,请检查输入内容再提交", { type: "error" });
      }
    });
  }

  async function onSelectionChange(val) {
    formRef.value.list = val;
  }

  function onClose() {
    onSearch();
    initForm();
    formRef.value.dialogFormVisible = false;
  }

  function onEdit(row: ViewAppMenuType) {
    formRef.value.formData = row;
    console.log("onEdit", row);
    console.log("formRef.value.formData", formRef.value.formData);
    onOpen(row.id);
  }
  function onCreate() {
    onOpen(0);
  }
  return {
    initForm,
    onClose,
    onCreate,
    onEdit,
    onSubmit,
    onSelectionChange
  };
}
