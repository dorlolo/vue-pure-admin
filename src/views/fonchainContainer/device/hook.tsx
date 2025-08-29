import { ref, reactive } from "vue";
import { message } from "@/utils/message";
import type { FormInstance } from "element-plus";
import { type PaginationProps } from "@pureadmin/table";
import { HandleResponseCode, baseResponse } from "@/api/utils";
import {
  DeviceType,
  deleteDevice,
  updateDevice,
  createDevice,
  getDeviceList,
  getDeviceDetail
} from "@/api/fonchainContainerDeviceApi";
import {
  getDeviceFirmwareList,
  otaDeviceFirmware
} from "@/api/fonchainContainerDeviceFirmwareApi";
//-----------------------------搜索表单-----------------------------------
export const searchFormRef = ref();
export const searchLoading = ref(false);
export const searchFormData = reactive({
  sn: "",
  location: "",
  netStatus: 0,
  useStatus: 0,
  ip: "",
  locationIp: "",
  ledType: "",
  remark: "",
  pingTime: "",
  mode: 0,
  pinTotal: 0,
  ssid: "",
  password: "",
  mac: "",
  version: "",
  env: 2,
  isRelContainer: null //是否关联货架 1=是 2=否
});
//-----------------------------列表数据-----------------------------------
export const deleteViewContent = ref({
  title: "确定要删除吗？",
  content: "此操作会删除该条数据，是否确定？"
});
export const tableRef = ref();
export const tableRefRowKey = "id"; //数据中的唯一键名
export const multipleSelectList = ref([]); //多选列表
export const tableData = ref<DeviceType[]>([]);
export const tableDeleteRef = ref({
  deleteId: 0,
  deleteDialogVisible: false,
  deleteMode: "single" //single or mult
});
export const tablePagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 20,
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
  formData: DeviceType;
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
    sn: "",
    location: "",
    netStatus: 0,
    useStatus: 0,
    ip: "",
    locationIp: "",
    ledType: "",
    remark: "",
    pingTime: "",
    mode: 0,
    pinTotal: null,
    ssid: "",
    password: "",
    mac: "",
    version: ""
  }),
  list: [],
  ////表单校验规则
  rules: {
    //todo:
    //path: [{ required: true, message: "请输入文件路径", trigger: "blur" }],
    //parentId: [{ validator: validateParentId, trigger: "blur" }]
  }
});
type downDeviceFirmwareType = {
  id: number;
  sn: string; //硬件设备序列号
  netStatus: number; //联网状态 1=在线 2=离线
};
type downFirmwareDeviceForm = {
  selectedDeviceList: downDeviceFirmwareType[]; //选中的设备列表
  firmwareTag: string; //固件版本
};
export const firmwareRef = ref<{
  formData: downFirmwareDeviceForm;
  dialogFormVisible: boolean;
  firmwareTagList: string[];
  selectDeviceList: downDeviceFirmwareType[];
  tapConfirm: boolean;
}>({
  formData: reactive({
    selectedDeviceList: [],
    firmwareTag: ""
  }),
  dialogFormVisible: false,
  firmwareTagList: [],
  selectDeviceList: [],
  tapConfirm: false
});
//---------------------------------------hooks---------------------------------------
export function useSearchForm() {
  function resetSearchForm(formEl) {
    console.log("resetSearchForm", formEl);
    searchFormData.isRelContainer = null;
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
    const response = await getDeviceList({
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
  function onOpenDeleteDialog(row: DeviceType, deleteMode: "single" | "mult") {
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
        res = await deleteDevice({ id: tableDeleteRef.value.deleteId });
        break;
      case "mult":
        res = await deleteDevice({ ids: multipleSelectList.value });
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
      sn: "",
      location: "",
      netStatus: 0,
      useStatus: 0,
      ip: "",
      locationIp: "",
      ledType: "",
      remark: "",
      pingTime: "",
      mode: 0,
      pinTotal: 0,
      ssid: "",
      password: "",
      mac: "",
      version: ""
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
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        switch (formRef.value.operation) {
          case "create":
            {
              console.log("create action~~!");
              const res = await createDevice(formRef.value.formData);
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
              const res = await updateDevice(formRef.value.formData);
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
    initForm();
    onSearch();
    formRef.value.dialogFormVisible = false;
  }

  function onEdit(row: DeviceType) {
    formRef.value.formData = row;
    onOpen("edit");
  }

  async function onDetail(row: DeviceType) {
    const res = await getDeviceDetail({ id: row.id, env: searchFormData.env });
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

export function useFirmware() {
  const { onSearch } = useDataTable();
  async function onOpenDownFirmwareDialog(val) {
    firmwareRef.value.tapConfirm = false;
    console.log("onOpenDownFirmwareDialog", val);
    console.log("onOpenDownFirmwareDialog", multipleSelectList.value);
    firmwareRef.value.selectDeviceList = val;
    const firmwareListResp = await getDeviceFirmwareList({
      env: 3,
      page: 1,
      pageSize: 10,
      order: "id desc"
    });
    if (HandleResponseCode(firmwareListResp)) {
      firmwareRef.value.firmwareTagList = firmwareListResp.list.map(
        item => item.version
      );
    } else {
      message("获取固件列表失败", { type: "error" });
      return;
    }
    multipleSelectList.value.forEach(el => {
      const device = tableData.value.find(item => item.id === el);
      if (device) {
        firmwareRef.value.formData.selectedDeviceList.push({
          sn: device.sn,
          netStatus: device.netStatus,
          id: device.id
        });
      }
    });
    firmwareRef.value.dialogFormVisible = true;
  }
  function onCloseFirmwareDialog() {
    firmwareRef.value.dialogFormVisible = false;
    firmwareRef.value.formData.selectedDeviceList = [];
    firmwareRef.value.formData.firmwareTag = "";
    firmwareRef.value.selectDeviceList = [];
    firmwareRef.value.firmwareTagList = [];
  }
  function removeDevice(sn: string) {
    const index = firmwareRef.value.formData.selectedDeviceList.findIndex(
      item => item.sn === sn
    );
    if (index !== -1) {
      firmwareRef.value.formData.selectedDeviceList.splice(index, 1);
    }
  }
  async function onConfirmOtaFirmware() {
    firmwareRef.value.tapConfirm = true;
    // console.log("deviceSn:", firmwareRef.value.formData.selectedDeviceList);
    // console.log("firmwareTag:", firmwareRef.value.formData.firmwareTag);
    const resp = await otaDeviceFirmware({
      deviceSn: firmwareRef.value.formData.selectedDeviceList.map(
        item => item.sn
      ),
      version: firmwareRef.value.formData.firmwareTag,
      env: searchFormData.env
    });
    if (HandleResponseCode(resp as baseResponse)) {
      message("固件更新成功", { type: "success" });
      firmwareRef.value.tapConfirm = false;
      firmwareRef.value.dialogFormVisible = false;
      onSearch();
      return;
    } else {
      firmwareRef.value.tapConfirm = false;
      message("固件更新失败", { type: "error" });
      return;
    }
  }
  return {
    onOpenDownFirmwareDialog,
    onCloseFirmwareDialog,
    onConfirmOtaFirmware,
    removeDevice
  };
}
