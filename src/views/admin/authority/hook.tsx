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
import { HandleResponseCode, HandleResponseErr } from "@/api/utils";
import { message } from "@/utils/message";
import { reactive, ref, onMounted } from "vue";
import type { FormInstance } from "element-plus";
import { ElMessageBox } from "element-plus";

export function useAuthority() {
  //搜索表单内容
  const searchForm = reactive({
    name: "",
    status: 0,
    authorityId: "",
    defaultMenu: ""
  });
  const dataList = ref([]);
  const loading = ref(true);
  // const checkList = ref(["勾选列"]);
  const muiltSelectList = ref([]);
  const switchLoadMap = ref({});
  const columns: TableColumnList = [
    {
      type: "selection",
      width: 55,
      align: "left"
    },
    {
      label: "序号",
      type: "index",
      width: 70
    },
    {
      label: "角色名称",
      prop: "name",
      minWidth: 70,
      align: "left"
    },
    {
      label: "角色编号",
      prop: "authorityId",
      width: 120,
      align: "center"
    },
    // {
    //   label: "状态",
    //   prop: "status",
    //   minWidth: 60,
    //   cellRenderer: ({ row, props }) => (
    //     <el-tag
    //       size={props.size}
    //       type={row.status === 1 ? "success" : "danger"}
    //       effect="plain"
    //       onclick={() => console.log({ row })}
    //     >
    //       {row.status === 1 ? "启用" : "禁用"}
    //     </el-tag>
    //   )
    // },
    {
      label: "状态",
      minWidth: 40,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={1}
          inactive-value={2}
          active-text="已启用"
          inactive-text="已禁用"
          style="--el-switch-on-color: #13ce66;"
          inline-prompt
          onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "默认菜单",
      prop: "defaultMenu",
      width: 180,
      align: "center",
      cellRenderer: ({ row }) => (
        <text style={row.defaultMenu === "" ? "color:#CDD0D6" : ""}>
          {row.defaultMenu === "" ? "/welcome" : row.defaultMenu}
        </text>
      )
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 60
    },
    {
      label: "创建时间",
      minWidth: 60,
      prop: "createdAt",
      formatter: ({ createdAt }) =>
        dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 280,
      slot: "operation"
    }
  ];
  function handleCreate() {
    console.log("更新");
    dialogForm.value.parentIdVisible = true;
    openDialogFrom("create");
  }
  function handleCreateChild(row) {
    dialogForm.value.formData.parentId = row.authorityId;
    dialogForm.value.parentIdVisible = false;
    openDialogFrom("create");
  }

  function handleUpdate(row) {
    console.log("更新", row);
    dialogForm.value.formData = row;
    dialogForm.value.parentIdVisible = true;
    openDialogFrom("edit");
  }

  async function handleDelete() {
    const result = await DeleteAuthority({
      authorityList: muiltSelectList.value
    });
    if (HandleResponseCode(result)) {
      onSearch();
    }
  }
  //修改角色状态
  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status === 1 ? "启用" : "禁用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.name
      }</strong>角色吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(async () => {
        console.log(row.status);
        const res = await UpdateAuthority(row);
        if (res.code === 0) {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          message("已成功修改角色状态", {
            type: "success"
          });
        } else {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: true
            }
          );
        }
      })
      .catch(() => {
        row.status === 1 ? (row.status = 1) : (row.status = 2);
      });
  }
  function handleSelectionChange(val) {
    if (val.length === 0) {
      muiltSelectList.value = [];
    } else {
      val.forEach(element => {
        muiltSelectList.value.push(element.authorityId);
      });
    }
  }
  //重置搜索表单
  function resetForm(formEl) {
    console.log("resetForm", formEl);
    if (!formEl) return;
    searchForm.authorityId = "";
    searchForm.defaultMenu = "";
    searchForm.name = "";
    searchForm.status = 0;
    formEl.resetFields();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const response = await GetAuthorityList({
      page: 1,
      pageSize: -1,
      authorityId: searchForm.authorityId,
      name: searchForm.name,
      status: searchForm.status,
      defaultMenu: searchForm.defaultMenu
    });
    if (!HandleResponseErr(response)) {
      loading.value = false;
      return;
    }
    //初始化表格数据
    dataList.value = handleTree(response.list);
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  onMounted(() => {
    onSearch();
    InitInputPrompt();
    initDialogFormData();
  });
  ////自定义表单校验规则
  const validateRemark = (rule: any, value: string, callback: any) => {
    if (value.length > 50) {
      callback(new Error("备注内容字数不能超过50"));
    } else {
      callback();
    }
  };
  // 会话表单
  const ruleFormRef = ref<FormInstance>();
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
    parentIdVisible: ref(false),
    searchSelectList: reactive([])
  });
  function initDialogFormData() {
    dialogForm.value.formData = {} as AuthorityType;
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

  // 抽屉
  const selectedRow = ref({});
  const showDrawer = ref(false);
  const handleAuthoritySet = row => {
    showDrawer.value = true;
    selectedRow.value = row;
    console.log("设置权限", row);
  };
  //// 自动确认输信息，未提交内容自动提交,目前用不到
  function dwawerAutoEnter(activeName, oldActiveName) {
    const paneArr = ["menus", "apis", "datas"];
    if (oldActiveName) {
      // if (this.$refs[paneArr[oldActiveName]].needConfirm) {
      //   this.$refs[paneArr[oldActiveName]].enterAndNext();
      //   this.$refs[paneArr[oldActiveName]].needConfirm = false;
      // }
      console.log("autoEnter event", paneArr[oldActiveName]);
    }
  }
  return {
    searchForm,
    muiltSelectList,
    loading,
    // checkList,
    columns,
    dataList,
    onSearch,
    resetForm,
    handleCreateChild,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleSelectionChange,
    handleAuthoritySet,
    //会话表单
    ruleFormRef,
    dialogForm,
    closeDialogForm,
    formSumbit,
    //抽屉
    selectedRow,
    showDrawer,
    dwawerAutoEnter
  };
}
