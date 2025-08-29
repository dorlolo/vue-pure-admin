import { ref, reactive } from "vue";
import { message } from "@/utils/message";
import type { FormInstance } from "element-plus";
import { type PaginationProps } from "@pureadmin/table";
import { baseUrlApiV1, HandleResponseCode, baseResponse } from "@/api/utils";
import {
  DeviceFirmwareType,
  deleteDeviceFirmware,
  updateDeviceFirmware,
  createDeviceFirmware,
  getDeviceFirmwareList,
  getDeviceFirmwareDetail,
  otaDeviceFirmware
} from "@/api/fonchainContainerDeviceFirmwareApi";
import type { UploadFile, UploadFiles } from "element-plus";
//-----------------------------搜索表单-----------------------------------
export const searchFormRef = ref();
export const searchLoading = ref(false);
export const searchFormData = reactive({
  version: "",
  url: "",
  env: 3
});
//-----------------------------列表数据-----------------------------------
export const deleteViewContent = ref({
  title: "确定要删除吗？",
  content: "此操作会删除该条数据，是否确定？"
});
export const tableRef = ref();
export const tableRefRowKey = "id"; //数据中的唯一键名
export const multipleSelectList = ref([]); //多选列表
export const tableData = ref<DeviceFirmwareType[]>([]);
export const tableDeleteRef = ref({
  deleteId: 0,
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
  formData: DeviceFirmwareType;
  list: Array<any>;
  rules: any;
  fileList: UploadFile[];
  selectedFile: File | null; // 选中的文件
}>({
  ////展示表单
  dialogFormVisible: false,
  ////表单表格题
  dialogTitle: "创建数据",
  //// 操作 create、edit
  operation: "create",
  ////formData表单中的数据，和table中的一样要与prop进行关联
  formData: reactive({
    version: "",
    url: ""
  }),
  list: [],
  ////表单校验规则
  rules: {
    //todo:
    //path: [{ required: true, message: "请输入文件路径", trigger: "blur" }],
    //parentId: [{ validator: validateParentId, trigger: "blur" }]
  },
  fileList: [], // 初始化文件列表
  selectedFile: null // 初始化选中的文件
});
const uploadRef = ref(null);
const uploadActionUrl = baseUrlApiV1("/fonchainContainer/deviceFirmware/save");
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
    const response = await getDeviceFirmwareList({
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
    row: DeviceFirmwareType,
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
        res = await deleteDeviceFirmware({
          env: searchFormData.env,
          id: tableDeleteRef.value.deleteId
        });
        break;
      case "mult":
        res = await deleteDeviceFirmware({
          env: searchFormData.env,
          ids: multipleSelectList.value
        });
        break;
      default:
        break;
    }

    if (HandleResponseCode(res)) {
      tableDeleteRef.value.deleteId = 0;
      multipleSelectList.value = [];
      onSearch();
    }
    tableDeleteRef.value.deleteDialogVisible = false;
  }
  function onMultipleSelectionChange(val) {
    multipleSelectList.value = [];
    val.forEach(el => {
      multipleSelectList.value.push(el.id);
    });
    console.log("handleSelectionChange", val);
    console.log("multipleSelectList", multipleSelectList.value);
  }
  return {
    onSearch,
    onDelete,
    onOpenDeleteDialog,
    onMultipleSelectionChange
  };
}

export function useEditForm() {
  const { onSearch } = useDataTable();

  const initForm = () => {
    formRef.value.formData = {
      version: "",
      url: ""
    };
    console.log("初始化表单数据", formRef.value);
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
    formRef.value.formData.env = searchFormData.env;
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        switch (formRef.value.operation) {
          case "create":
            {
              console.log("create action~~!");
              const res = await createDeviceFirmware(formRef.value.formData);
              if (res.code === 0) {
                message("添加成功", { type: "success" });
                onSearch();
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
              const res = await updateDeviceFirmware(formRef.value.formData);
              if (res.code === 0) {
                message("更新成功", { type: "success" });
                onSearch();
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
    formRef.value.dialogFormVisible = false;
    initForm();
    onSearch();
  }

  function onEdit(row: DeviceFirmwareType) {
    formRef.value.formData = row;
    formRef.value.formData.env = searchFormData.env;
    onOpen("edit");
  }

  async function onDetail(row: DeviceFirmwareType) {
    const res = await getDeviceFirmwareDetail({
      id: row.id,
      env: searchFormData.env
    });
    if (HandleResponseCode(res as baseResponse)) {
      formRef.value.formData = res.data;
      onOpen("detail");
      console.log("onDetail", formRef.value.operation);
    }
  }

  function onCreate() {
    onOpen("create");
  }
  return {
    initForm,
    onClose,
    onOpen,
    onCreate,
    onEdit,
    onDetail,
    onSubmit,
    onSelectionChange
  };
}

export function useUpload() {
  const { onSearch } = useDataTable();
  // 上传成功的回调
  function handleUploadSuccess(
    response: any,
    file: UploadFile,
    fileList: UploadFile[]
  ) {
    console.log("上传成功：", response);
    formRef.value.fileList = fileList; // 更新文件列表
    // 将返回的文件地址添加到 formRef.formData.url 中
    if (response && (response.code === 0 || response.code === 200)) {
      onSearch(); // 刷新列表
      message("文件上传成功", { type: "success" });
    } else {
      message(response.msg, { type: "warning" });
    }
  }
  const handleFileChange = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
    formRef.value.selectedFile = uploadFile.raw; // 保存选中的文件，使用raw属性获取原始File对象
  };
  // 上传失败的回调
  function handleUploadError(err: any, file: UploadFile) {
    console.error("上传失败：", err);
    console.log("上传失败的文件：", file);
    message("文件上传失败，请重试", { type: "error" });
  }
  const handleSubmit = async () => {
    if (formRef.value.selectedFile) {
      if (uploadRef.value) {
        uploadRef.value.submit(); // 手动触发上传
        formRef.value.dialogFormVisible = false;
        // uploadRef.value.$on("success", (response: any) => {
        //   console.log("上传成功的结果：", response);
        //   formRef.value.dialogFormVisible = false;
        //   // 在这里处理上传成功后的逻辑
        //   if (response && (response.code === 0 || response.code === 200)) {
        //     formRef.value.formData.url = response.data;
        //     message("文件上传成功", { type: "success" });
        //   } else {
        //     message(response.msg || "上传成功但返回异常", { type: "warning" });
        //   }
        // });
      } else {
        console.error("上传组件未绑定，请检查 uploadRef 是否正确");
      }
    } else {
      console.error("请先选择文件");
    }
  };
  const onUploadSubmit = async (formEl: FormInstance | undefined) => {
    console.log("输入表单数据", formRef.value.formData);
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (!valid) {
        console.log("error submit!", fields);
        return;
      }
      await handleSubmit(); // 先上传文件
    });
    // 其他提交逻辑
  };
  const onOta = async (row: DeviceFirmwareType) => {
    const res = await otaDeviceFirmware({
      deviceSn: ["all"],
      version: row.version,
      env: searchFormData.env
    });
    if (HandleResponseCode(res as baseResponse)) {
      message("固件升级成功", { type: "success" });
      onSearch();
    } else {
      message("固件升级失败:" + res.notice, { type: "error" });
    }
  };
  return {
    handleUploadSuccess,
    handleUploadError,
    handleFileChange,
    handleSubmit,
    onUploadSubmit,
    uploadRef,
    uploadActionUrl,
    onOta
  };
}
