import { ref, reactive } from "vue";
import {
  useRouter,
  useRoute,
  type LocationQueryRaw,
  type RouteParamsRaw
} from "vue-router";
import { isString, isEmpty } from "@pureadmin/utils";
import { message } from "@/utils/message";
import type { FormInstance } from "element-plus";
import { type PaginationProps } from "@pureadmin/table";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { HandleResponseCode, baseResponse } from "@/api/utils";
import {
  ProductType,
  deleteProduct,
  updateProduct,
  createProduct,
  getProductList
  // getProductDetail
} from "@/api/productApi";
import { getProductTagList } from "@/api/productTagApi";
import { getCurrencyList } from "@/api/productCurrencyApi";
import { getMeasureUnitList } from "@/api/productMeasureUnitApi";
//-----------------------------搜索表单-----------------------------------
export const searchFormRef = ref();
export const searchLoading = ref(false);
export const searchFormData = reactive({
  productNo: "",
  key: "",
  name: "",
  desc: "",
  content: "",
  webView: "",
  productType: 0,
  parentId: 0,
  TagId: 0,
  status: 0,
  defaultCurrencyId: 0,
  quantityUnit: "",
  timeUnit: "",
  calculateUnit: 0,
  mTagName: "",
  TagName: "",
  productTypeIn: [1, 2]
});
//-----------------------------列表数据-----------------------------------
export const deleteViewContent = ref({
  title: "确定要删除吗？",
  content: "此操作会删除该条数据，是否确定？"
});
export const tableRef = ref();
export const tableRefRowKey = "id"; //数据中的唯一键名
export const muiltSelectList = ref([]); //多选列表
export const tableData = ref<ProductType[]>([]);
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
export interface RestaurantItem {
  value: string;
  link: number;
}
export const formRef = ref<{
  dialogFormVisible: boolean;
  dialogTitle: string;
  operation: string;
  formData: ProductType;
  list: Array<any>;
  rules: any;
  tagSelectList: RestaurantItem[]; //Array<{ value: number; label: string }>;
  currencySelectList: Array<{ value: number; label: string }>;
  measureUnitList: Array<{ value: number; label: string }>;
}>({
  ////展示表单
  dialogFormVisible: false,
  ////表单表格题
  dialogTitle: "创建菜单",
  //// 操作 create、edit
  operation: "create",
  ////formData表单中的数据，和table中的一样要与prop进行关联
  formData: reactive({
    productNo: "",
    key: "",
    name: "",
    desc: "",
    content: "",
    webView: "",
    productType: 0,
    parentId: 0,
    TagId: 0,
    status: 0,
    defaultCurrency: "",
    quantityFactor: "",
    timeFactor: "",
    quantityUnit: "",
    timeUnit: "",
    calculateUnit: 0
  }),
  list: [],
  ////表单校验规则
  rules: {
    //todo:
    //path: [{ required: true, message: "请输入文件路径", trigger: "blur" }],
    //parentId: [{ validator: validateParentId, trigger: "blur" }]
  },
  tagSelectList: [],
  currencySelectList: [],
  measureUnitList: []
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
    const response = await getProductList({
      page: tablePagination.currentPage,
      pageSize: tablePagination.pageSize,
      ...searchFormData,
      productTypeIn: searchFormData.productTypeIn.join(",")
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
  function onOpenDeleteDialog(row: ProductType, deleteMode: "single" | "mult") {
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
        res = await deleteProduct({ id: tableDeleteRef.value.deleteId });
        break;
      case "mult":
        res = await deleteProduct({ ids: muiltSelectList.value });
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
  function onMultSelectionChange(val) {
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
    onMultSelectionChange
  };
}

export function useEditForm() {
  const { onSearch } = useDataTable();
  const initForm = () => {
    formRef.value.formData = {
      productNo: "",
      key: "",
      name: "",
      desc: "",
      content: "",
      webView: "",
      productType: 0,
      mTagId: 0,
      status: 0,
      defaultCurrencyId: 1
      // quantityFactor: "",
      // quantityUnit: "",
      // timeFactor: "",
      // timeUnit: "",
      // calculateUnit: 0,
      // tagName: ""
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
              const res = await createProduct(formRef.value.formData);
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
              const res = await updateProduct(formRef.value.formData);
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
            console.log("unknown action~~!", formRef.value.operation);
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

  function onEdit(row: ProductType) {
    formRef.value.formData = row;
    onOpen("edit");
  }
  function onCreate() {
    initForm();
    onOpen("create");
  }
  async function initTagSelectList() {
    const res = await getProductTagList({ page: 1, pageSize: -1 });
    if (HandleResponseCode(res as baseResponse, true)) {
      formRef.value.tagSelectList = [{ value: "无", link: 0 }];
      res.list.forEach(el => {
        formRef.value.tagSelectList.push({
          value: el.name,
          link: el.id
        });
      });
    } else {
      onClose();
    }
  }
  async function initCurrencySelectList() {
    const res = await getCurrencyList({ page: 1, pageSize: -1 });
    if (HandleResponseCode(res as baseResponse, true)) {
      formRef.value.currencySelectList = [{ value: 0, label: "无" }];
      res.list.forEach(el => {
        formRef.value.currencySelectList.push({ value: el.id, label: el.name });
      });
    } else {
      onClose();
    }
  }
  async function initMeasureUnitList() {
    const res = await getMeasureUnitList({ page: 1, pageSize: -1 });
    if (HandleResponseCode(res as baseResponse, true)) {
      formRef.value.measureUnitList = [{ value: 0, label: "无" }];
      res.list.forEach(el => {
        formRef.value.measureUnitList.push({ value: el.id, label: el.name });
      });
    } else {
      onClose();
    }
  }
  return {
    initForm,
    onClose,
    onOpen,
    onCreate,
    onEdit,
    onSubmit,
    onSelectionChange,
    initTagSelectList,
    initCurrencySelectList,
    initMeasureUnitList
  };
}

export function useDetail() {
  const route = useRoute();
  const router = useRouter();
  const getParameter = isEmpty(route.params) ? route.query : route.params;

  function toDetail(parameter: LocationQueryRaw | RouteParamsRaw) {
    // ⚠️ 这里要特别注意下，因为vue-router在解析路由参数的时候会自动转化成字符串类型，比如在使用useRoute().route.query或useRoute().route.params时，得到的参数都是字符串类型
    // 所以在传参的时候，如果参数是数字类型，就需要在此处 toString() 一下，保证传参跟路由参数类型一致都是字符串，这是必不可少的环节！！！
    Object.keys(parameter).forEach(param => {
      if (!isString(parameter[param])) {
        parameter[param] = parameter[param].toString();
      }
    });
    useMultiTagsStoreHook().handleTags("push", {
      path: `/order/orderProduct/detail`,
      name: "OrderProductDetail",
      query: parameter,
      meta: {
        title: `详情 / ${parameter.name}`,
        // 最大打开标签数
        dynamicLevel: 2
      }
    });
    //跳转到OrderProductDetail页面
    router.push({
      name: "OrderProductDetail",
      query: parameter
    });
  }
  function initToDetail() {
    if (getParameter) toDetail(getParameter);
  }

  return {
    toDetail,
    initToDetail,
    getParameter,
    router
  };
}
