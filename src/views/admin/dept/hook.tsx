import dayjs from "dayjs";
import { handleTree } from "@/utils/tree";
import {
  AuthorityType,
  DeleteAuthority,
  UpdateAuthority,
  CreateAuthority,
  GetAuthorityList,
  GetIdNameList
} from "@/api/authority";
import { HandleResponseCode } from "@/api/utils";
import { message } from "@/utils/message";
import { reactive, ref, onMounted } from "vue";
import type { FormInstance } from "element-plus";

export function useAuthority() {
  const form = reactive({
    user: "",
    status: ""
  });
  const dataList = ref([]);
  const loading = ref(true);

  const columns: TableColumnList = [
    {
      label: "选择",
      type: "selection",
      width: 55,
      align: "left"
    },
    {
      label: "序号",
      type: "index",
      minWidth: 70
    },
    {
      label: "角色名称",
      prop: "name",
      width: 180,
      align: "left"
    },
    {
      label: "角色编号",
      prop: "authorityId",
      width: 180,
      align: "left"
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.status === 1 ? "success" : "danger"}
          effect="plain"
        >
          {row.status === 1 ? "开启" : "关闭"}
        </el-tag>
      )
    },
    {
      label: "创建时间",
      minWidth: 200,
      prop: "createdAt",
      formatter: ({ createdAt }) =>
        dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 200
    },
    {
      label: "操作",
      fixed: "right",
      width: 160,
      slot: "operation"
    }
  ];

  function handleCreate() {
    console.log("更新");
    openDialogFrom("create");
  }
  function handleCreateChild(row) {
    dialogForm.value.formData.parentId = row.authorityId;
    openDialogFrom("create");
  }

  function handleUpdate(row) {
    console.log("更新", row);
    dialogForm.value.formData = row;
    openDialogFrom("edit");
  }

  async function handleDelete(row) {
    const result = await DeleteAuthority({ authorityId: row.authorityId });
    if (HandleResponseCode(result)) {
      onSearch();
    }
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const response = await GetAuthorityList({ page: 1, pageSize: 10 });
    if (response.code !== 0) {
      message(response.notice, { type: "error" });
      return;
    }
    dataList.value = handleTree(response.list);
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  onMounted(() => {
    onSearch();
  });

  ////自定义表单校验规则
  const validateRemark = (rule: any, value: any, callback: any) => {
    if (value.length > 50) {
      callback(new Error("备注内容字数不能超过50"));
    }
  };
  // 会话表单
  const dialogForm = ref({
    ////展示表单
    dialogFormVisible: false,
    ////表单表格题
    dialogTitle: "创建角色",
    //// 操作 create、edit
    operation: "create",
    ////formData表单中的数据，和table中的一样要与prop进行关联
    formData: reactive({} as AuthorityType),
    list: [],
    ////表单校验规则
    rules: {
      name: [{ required: true, message: "请输入角色名", trigger: "blur" }],
      remark: [{ validator: validateRemark, trigger: "blur" }]
    },
    searchSelectList: reactive([])
  });
  function initDialogFormData() {
    dialogForm.value.formData = {
      prarentId: "",
      authorityId: "",
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
      name: "",
      parentId: "",
      defaultMenu: "",
      remark: "",
      status: 0
    };
  }
  function openDialogFrom(thisDialogTtype: string) {
    switch (thisDialogTtype) {
      case "create":
        dialogForm.value.dialogTitle = "新增角色";
        break;
      case "edit":
        dialogForm.value.dialogTitle = "编辑角色";
        break;
      default:
        break;
    }
    dialogForm.value.operation = thisDialogTtype;
    dialogForm.value.dialogFormVisible = true;
  }
  function closeDialogForm() {
    dialogForm.value.dialogFormVisible = false;
    initDialogFormData();
  }
  const formSumbit = async (formEl: FormInstance | undefined) => {
    console.log("输入表单数据", dialogForm.value.formData);
    console.log("operation", dialogForm.value.operation);
    console.log("formEl", !formEl);
    if (formEl === undefined) {
      console.log("formEl is undefined");
    } else {
      console.log(formEl);
    }
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        switch (dialogForm.value.operation) {
          case "create":
            {
              console.log("create action~~!");
              const res = await CreateAuthority(dialogForm.value.formData);
              if (res.code === 0) {
                message("添加成功", { type: "success" });
                InitInputPrompt();
                onSearch();
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
              const res = await UpdateAuthority(dialogForm.value.formData);
              if (res.code === 0) {
                message("更新成功", { type: "success" });
                InitInputPrompt();
                onSearch();
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
      } else {
        onSearch();
        console.log("error submit!", fields);
        // message("表单填写错误,请检查输入内容再提交", { type: "error" });
      }
    });
  };
  //初始化会话表单中父级角色输入框的补全列表
  const InitInputPrompt = async () => {
    const response = await GetIdNameList();
    dialogForm.value.searchSelectList = response.list;
    dialogForm.value.searchSelectList.push({ authorityId: "", name: "无" });
  };
  return {
    form,
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

    dialogForm,
    closeDialogForm,
    formSumbit
  };
}
