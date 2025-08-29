import dayjs from "dayjs";
import { handleTree } from "@/utils/tree";
import {
  operationRecordType,
  getOperationRecordList,
  getOperationRecordDetail,
  deleteOperationRecord,
  operationRecordRequqest
} from "@/api/artistinfo";
import { HandleResponseCode } from "@/api/utils";
import { message } from "@/utils/message";
import { reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";
export function useApiRecord() {
  const form = reactive({
    user: "",
    status: ""
  });
  const dataList = ref([]);
  const loading = ref(true);

  const columns: TableColumnList = [
    {
      label: "创建时间",
      width: 180,
      prop: "createdAt",
      formatter: ({ createdAt }) =>
        dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "ip地址",
      prop: "ip",
      width: 100,
      align: "right"
    },
    {
      label: "接口路径",
      prop: "path",
      minWidth: 180,
      align: "left"
    },
    {
      label: "接口名",
      prop: "target",
      minWidth: 180,
      align: "left"
    },
    {
      label: "事件通知",
      prop: "message",
      minWidth: 180,
      align: "left"
    },
    {
      label: "耗时",
      prop: "cost",
      width: 120,
      align: "left"
    },
    {
      label: "错误",
      prop: "errors",
      minWidth: 100
    },
    {
      label: "操作",
      fixed: "right",
      width: 190,
      slot: "operation"
    }
  ];

  async function handleDelete(row) {
    const result = await deleteOperationRecord({
      id: row.id
    });
    if (HandleResponseCode(result)) {
      onSearch();
    }
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  const searchFormData = reactive({} as operationRecordRequqest);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  function resetSearchForm(formEl) {
    console.log("resetSearchForm", formEl);
    if (!formEl) return;
    // formEl.resetFields();
    initSearchFormData();
    console.log("reset ok");
    onSearch();
  }
  function initSearchFormData() {
    searchFormData.env = 2;
    searchFormData.phone = "";
    searchFormData.userName = "";
    searchFormData.likeTime = "";
    searchFormData.target = "";
    searchFormData.path = "";
    searchFormData.message = "";
    pagination.currentPage = 1;
    pagination.pageSize = 20;
  }
  async function onSearch() {
    loading.value = true;
    searchFormData.page = pagination.currentPage;
    searchFormData.pageSize = pagination.pageSize;
    const response = await getOperationRecordList(searchFormData);
    if (response.code !== 0) {
      loading.value = false;
      message(response.notice + "\n" + response.err, { type: "error" });
      return;
    }
    pagination.total = response.pageInfo.total;
    dataList.value = handleTree(response.list);
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }
  async function handleDetail(row) {
    const response = await getOperationRecordDetail({
      env: searchFormData.env,
      id: row.id
    });
    if (response.code !== 0) {
      message(response.notice, { type: "error" });
      return;
    }
    console.log("response", response);
    dialogForm.value.formData = response.data;
    dialogForm.value.dialogFormVisible = true;
    if (response.data.body != "") {
      dialogForm.value.formData.jsonBody = JSON.stringify(
        JSON.parse(response.data.body),
        null,
        4
      );
    }
    if (response.data.header != "") {
      const header = JSON.parse(response.data.header);
      delete header.traceSpan;
      dialogForm.value.formData.jsonHeader = JSON.stringify(header, null, 4);
    }
    if (response.data.result != "") {
      const jsonResult = JSON.parse(response.data.result);
      const trace = jsonResult.trace;
      delete jsonResult.trace;
      const traceLines = parseTrace(trace);
      dialogForm.value.formData.traceLines = traceLines.traceLines;
      dialogForm.value.formData.hasErr = traceLines.hasErr;
      dialogForm.value.formData.jsonResult = JSON.stringify(
        jsonResult,
        null,
        4
      );
    }
    if (response.data.errors != "") {
      dialogForm.value.formData.jsonErrors = JSON.stringify(
        JSON.parse(response.data.errors),
        null,
        4
      );
    }
  }

  ////自定义表单校验规则
  const validateRemark = (rule: any, value: any, callback: any) => {
    if (value.length > 50) {
      callback(new Error("备注内容字数不能超过50"));
    }
  };
  type dialgoFormExt = {
    jsonBody?: string;
    jsonResult?: string;
    jsonErrors?: string;
    jsonHeader?: string;
  };
  // 编辑表单
  const dialogForm = ref({
    ////展示表单
    dialogFormVisible: false,
    ////表单表格题
    dialogTitle: "创建角色",
    //// 操作 create、edit
    operation: "create",
    ////formData表单中的数据，和table中的一样要与prop进行关联
    formData: reactive(
      {} as operationRecordType & dialgoFormExt & traceLineList
    ),
    list: [],
    ////表单校验规则
    rules: {
      doamin: [{ required: true, message: "请输入角色名", trigger: "blur" }],
      remark: [{ validator: validateRemark, trigger: "blur" }]
    }
  });
  function initDialogFormData() {
    dialogForm.value.formData = {
      createdAt: "",
      domain: "",
      requestId: "",
      userId: 0,
      ip: "",
      action: "",
      method: "",
      header: "",
      path: "",
      message: "",
      body: "",
      target: "",
      result: "",
      cost: "",
      errors: ""
    };
  }
  function closeDialogForm() {
    dialogForm.value.dialogFormVisible = false;
    initDialogFormData();
  }
  return {
    form,
    loading,
    columns,
    dataList,
    onSearch,
    searchFormData,
    initSearchFormData,
    pagination,
    resetSearchForm,
    handleDelete,
    handleSelectionChange,
    handleDetail,
    dialogForm,
    closeDialogForm
  };
}

type traceLineType = {
  indent?: number;
  functionName?: string;
  result?: Array<traceLineResultType>;
  nodeStep?: string; //'start' or 'end'
  hasErr?: boolean;
};
type traceLineResultType = {
  key?: string;
  value?: string;
};
type traceLineList = {
  traceLines?: Array<traceLineType>;
  hasErr?: boolean;
};
function parseTrace(str: string): traceLineList {
  console.log("str", str);
  if (str === "" || str === undefined || str === null)
    return {
      traceLines: [],
      hasErr: false
    };
  const lines = str.split("--:-");
  const traceLines = [];
  let hasErr = false;
  let indentLevel = 0;
  let nextIndent = 0;
  for (let i = 0; i < lines.length; i++) {
    if (i === 1) {
      indentLevel++;
    }
    const line = lines[i].trim();
    console.log("line", line);
    let funcHandle = line.split(":");
    const funcName = funcHandle[0].trim();
    const funcResult = funcHandle[1].trim();
    const traceNode: traceLineType = {
      hasErr: false
    };
    const resultItemList: traceLineResultType[] = [];
    console.log("funcResult", funcResult);
    if (funcResult === "__START__") {
      nextIndent = 1;
      traceNode.nodeStep = "start";
      traceNode.functionName = funcName;
    } else if (funcResult === "__END__") {
      nextIndent = -1;
      traceNode.nodeStep = "end";
      traceNode.functionName = funcName;
    } else {
      if (nextIndent !== 0) {
        indentLevel += nextIndent;
        nextIndent = 0;
      }
      funcHandle = line.split(":(");
      traceNode.functionName = funcHandle[0].trim();
      if (funcHandle.length == 2 && funcHandle[1] !== "") {
        const resultGroup = funcHandle[1].trim().slice(0, -1).split(";");
        for (let i = 0; i < resultGroup.length; i++) {
          const resultItem = resultGroup[0].split(":");
          resultItemList.push({
            key: resultItem[0].slice(1, -1),
            value: resultItem[1]
          });
          if (
            resultItem[0] === "err" &&
            resultItem[1] !== "" &&
            resultItem[1] !== "nil"
          ) {
            traceNode.hasErr = true;
            hasErr = true;
          }
        }
      }
    }
    traceNode.result = resultItemList;
    traceNode.indent = indentLevel;
    console.log("traceNode", traceNode);
    traceLines.push(traceNode);
  }

  return {
    traceLines: traceLines,
    hasErr: hasErr
  };
}
