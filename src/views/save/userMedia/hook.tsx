import { ref, reactive } from "vue";
import { message } from "@/utils/message";
import type { FormInstance } from "element-plus";
import { type PaginationProps } from "@pureadmin/table";
import { HandleResponseCode, baseResponse } from "@/api/utils";
import {
  ViewUserMediaType,
  deleteViewUserMedia,
  recoveryUserMedia,
  getViewUserMediaList,
  getViewUserMediaDetail,
  updateUserMedia
} from "@/api/mediaAttachmentApi";

import { getFileList } from "@/components/upload/hook";
//-----------------------------搜索表单-----------------------------------
export const searchFormRef = ref();
export const searchLoading = ref(false);
export const searchFormData = reactive({
  uid: "",
  fileType: 0,
  formatType: "",
  md5: "",
  source: "",
  uploadState: 0,
  title: "",
  description: "",
  nickName: "",
  userUid: "",
  phone: "",
  email: "",
  querySelf: 0,
  queryDeleted: 0
});
//-----------------------------列表数据-----------------------------------
export const deleteViewContent = ref({
  title: "确定要删除吗？",
  content: "此操作会删除该条数据，是否确定？"
});
export const tableRef = ref();
export const tableRefRowKey = "id"; //数据中的唯一键名
export const multipleSelectList = ref([]); //多选列表
export const tableData = ref<ViewUserMediaType[]>([]);
export const tableDeleteRef = ref({
  uid: "",
  deleteDialogVisible: false,
  deleteMode: "single" //single or mult
});
export const tablePagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});
//-----------------------------编辑表单-----------------------------------

export const ruleFormRef = ref<FormInstance>();
////表单校验规则
//const validateParentId = (rule: any, value: any, callback: any) => {
//  if (value === "") {
//    callback(new Error("请输入文件路径"));
//  } else if (formRef.value.formData.id === value) {
//    callback(new Error("父级菜单不能是自己"));
//  } else {
//    callback();
//  }
//};
export const formRef = ref<{
  dialogFormVisible: boolean;
  dialogTitle: string;
  operation: string;
  formData: ViewUserMediaType;
  list: Array<any>;
  rules: any;
}>({
  ////展示表单
  dialogFormVisible: false,
  ////表单表格题
  dialogTitle: "创建数据",
  //// 操作 create、edit
  operation: "create",
  ////formData表单中的数据，和table中的一样要与prop进行关联
  formData: reactive({
    uid: "",
    fileType: 0,
    formatType: "",
    md5: "",
    size: 0,
    source: "",
    uploadState: 0,
    title: "",
    description: "",
    nickName: "",
    userUid: "",
    phone: "",
    email: ""
  }),
  list: [],
  ////表单校验规则
  rules: {
    //todo:
    //path: [{ required: true, message: "请输入文件路径", trigger: "blur" }],
    //parentId: [{ validator: validateParentId, trigger: "blur" }]
  }
});

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
    const response = await getViewUserMediaList({
      page: tablePagination.currentPage,
      pageSize: tablePagination.pageSize,
      ...searchFormData
    });
    if (response.code != 0) {
      message(response.notice, { type: "error" });
      return;
    }
    tableData.value = response.list;
    tablePagination.total = response.pageInfo.total;
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
    row: ViewUserMediaType,
    deleteMode: "single" | "mult"
  ) {
    if (row !== null) {
      tableDeleteRef.value.uid = row.uid;
    }
    tableDeleteRef.value.deleteDialogVisible = true;
    tableDeleteRef.value.deleteMode = deleteMode;
  }
  function onOpenRecoveryDialog(row: ViewUserMediaType) {
    if (row !== null) {
      tableDeleteRef.value.uid = row.uid;
    }
    tableDeleteRef.value.deleteDialogVisible = true;
    tableDeleteRef.value.deleteMode = "recovery";
  }
  //删除菜单
  async function onDelete() {
    let res;
    switch (tableDeleteRef.value.deleteMode) {
      case "single":
        if (tableDeleteRef.value.uid === "") {
          message("数据id为0，操作取消", { type: "error" });
        }
        res = await deleteViewUserMedia({ uid: tableDeleteRef.value.uid });
        break;
      case "mult":
        res = await deleteViewUserMedia({ uids: multipleSelectList.value });
        break;
      case "recovery":
        res = await recoveryUserMedia({ uid: tableDeleteRef.value.uid });
        break;
      default:
        break;
    }

    if (HandleResponseCode(res)) {
      tableDeleteRef.value.uid = "";
      multipleSelectList.value = [];
      onSearch();
    }
    tableDeleteRef.value.deleteDialogVisible = false;
  }
  function onMultipleSelectionChange(val) {
    multipleSelectList.value = [];
    val.forEach(el => {
      multipleSelectList.value.push(el.uid);
    });
    console.log("handleSelectionChange", val);
    console.log("multipleSelectList", multipleSelectList.value);
  }
  return {
    onSearch,
    onDelete,
    onOpenDeleteDialog,
    onOpenRecoveryDialog,
    onMultipleSelectionChange
  };
}

export function useEditForm() {
  const { onSearch } = useDataTable();

  const initForm = () => {
    formRef.value.formData = {
      uid: "",
      fileType: 0,
      formatType: "",
      md5: "",
      size: 0,
      source: "",
      uploadState: 0,
      title: "",
      description: "",
      nickName: "",
      userUid: "",
      phone: "",
      email: ""
    };
    // console.log("初始化表单数据", formRef.value);
  };

  //打开会话表单
  function onOpen(type: "edit" | "create" | "detail") {
    formRef.value.operation = type;
    switch (type) {
      case "edit":
        formRef.value.dialogTitle = "编辑";
        break;
      case "create":
        formRef.value.dialogTitle = "新增";
        break;
      case "detail":
        formRef.value.dialogTitle = "详情";
        break;
    }
    formRef.value.dialogFormVisible = true;
  }

  //提交表单
  async function onSubmit(formEl: FormInstance | undefined) {
    console.log("输入表单数据", formRef.value.formData);
    console.log("operation", formRef.value.operation);
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        if (formRef.value.formData.uid === "") {
          console.log("getFileList", getFileList());
          const fileList = getFileList();
          if (fileList.length === 0) {
            message("请先上传文件", { type: "warning" });
            return;
          }
          // if (fileList[0].task.uploadStatus != 3) {
          //   message("请先上传文件", { type: "warning" });
          //   return;
          // }
          formRef.value.formData.uid = fileList[0].task.uid;
        }
        console.log("edit action~~!");
        const res = await updateUserMedia(formRef.value.formData);
        if (res.code === 0) {
          message("更新成功", { type: "success" });
          onSearch();
          onClose();
        } else {
          console.log("更新失败:", res);
          message("添加失败:" + res.notice, { type: "error" });
        }
        // switch (formRef.value.operation) {
        //   case "create":
        //     {
        //       if (formRef.value.formData.uid === "") {
        //         console.log("getFileList", getFileList());
        //         const fileList = getFileList();
        //         if (fileList.length === 0) {
        //           message("请先上传文件", { type: "warning" });
        //           return;
        //         }
        //         if (fileList[0].task.uploadStatus != 3) {
        //           message("请先上传文件", { type: "warning" });
        //           return;
        //         }
        //         formRef.value.formData.uid = fileList[0].task.uid;
        //       }
        //       console.log("edit action~~!");
        //       const res = await updateUserMedia(formRef.value.formData);
        //       if (res.code === 0) {
        //         message("更新成功", { type: "success" });
        //         onSearch();
        //         onClose();
        //       } else {
        //         console.log("更新失败:", res);
        //         message("添加失败:" + res.notice, { type: "error" });
        //       }
        //     }
        //     break;
        //   case "edit":
        //     {
        //       if (formRef.value.formData.uid === "") {
        //         console.log("getFileList", getFileList());
        //         const fileList = getFileList();
        //         if (fileList.length === 0) {
        //           message("请先上传文件", { type: "warning" });
        //           return;
        //         }
        //         if (fileList[0].task.uploadStatus != 3) {
        //           message("请先上传文件", { type: "warning" });
        //           return;
        //         }
        //         formRef.value.formData.uid = fileList[0].task.uid;
        //       }
        //       console.log("edit action~~!");
        //       const res = await updateUserMedia(formRef.value.formData);
        //       if (res.code === 0) {
        //         message("更新成功", { type: "success" });
        //         onSearch();
        //         onClose();
        //       } else {
        //         console.log("更新失败:", res);
        //         message("添加失败:" + res.notice, { type: "error" });
        //       }
        //     }
        //     break;
        //   default:
        //     console.log("unknown action~~!");
        //     message("未知操作", { type: "error" });
        //     break;
        // }
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
    initForm();
    onSearch();
    formRef.value.dialogFormVisible = false;
  }

  function onEdit(row: ViewUserMediaType) {
    formRef.value.formData = row;
    onOpen("edit");
  }

  async function onDetail(row: ViewUserMediaType) {
    const res = await getViewUserMediaDetail({ uid: row.uid });
    if (HandleResponseCode(res as baseResponse)) {
      formRef.value.formData = res.data;
      onOpen("detail");
      // console.log("onDetail", formRef.value.operation);
    }
  }

  function onCreate() {
    onOpen("create");
  }

  function handleDownload(row) {
    const downloadUrl = row.downloadUrl ? row.downloadUrl : row.url;
    if (downloadUrl) {
      // 方法1: 使用window.open()，适用于文件可以直接在浏览器中打开的情况
      //window.open(row.url);

      // 方法2: 创建动态<a>标签进行下载，适用于需要直接下载的文件
      const link = document.createElement("a");
      link.href = downloadUrl;
      // 如果你想为下载的文件指定一个默认文件名，可以这样做：
      // link.download = '自定义文件名';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      message("该资源没有下载地址", { type: "warning" });
    }
  }
  return {
    initForm,
    onClose,
    onOpen,
    onCreate,
    onEdit,
    onDetail,
    onSubmit,
    onSelectionChange,
    handleDownload
  };
}
