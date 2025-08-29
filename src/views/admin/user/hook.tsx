import dayjs from "dayjs";
import { handleTree } from "@/utils/tree";
import {
  userInfo,
  GetUserList,
  CreateUser,
  UpdateUser,
  DeleteUser
} from "@/api/user";
import { HandleResponseCode, HandleResponseErr } from "@/api/utils";
import { message } from "@/utils/message";
import { reactive, ref, onMounted } from "vue";
import type { FormInstance } from "element-plus";
import { type PaginationProps } from "@pureadmin/table";
import { GetAuthorityList } from "@/api/authority";
function convertToUTC8(dateString) {
  const date = new Date(dateString);
  const utc8Offset = 8 * 60 * 60 * 1000;
  const utc8Date = new Date(date.getTime() + utc8Offset);
  return utc8Date.toISOString();
}
export function useUser() {
  const dataList = ref([]);
  const loading = ref(true);
  const muiltSelectList = ref([]);
  const authorityTree = ref([]);
  const columns: TableColumnList = [
    {
      type: "selection",
      width: 55,
      align: "left"
    },
    {
      label: "头像",
      prop: "headerImg",
      cellRenderer: ({ row }) => (
        <el-image
          fit="cover"
          preview-teleported={true}
          src={row.headerImg}
          preview-src-list={Array.of(row.headerImg)}
          class="w-[24px] h-[24px] rounded-full align-middle"
        />
      ),
      width: 70
    },
    {
      label: "昵称",
      prop: "nickName",
      width: 100,
      align: "left"
    },
    {
      label: "用户名",
      prop: "userName",
      width: 140,
      align: "left"
    },
    // {
    //   label: "UUID",
    //   prop: "uuid",
    //   width: 180,
    //   align: "left"
    // },
    {
      label: "状态",
      prop: "status",
      minWidth: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={
            row.status === 1
              ? "info"
              : row.status === 2
              ? "success"
              : row.status === 3
              ? "danger"
              : "warning"
          }
          effect="plain"
        >
          {row.status === 1
            ? "未激活"
            : row.status === 2
            ? "正常"
            : row.status === 3
            ? "禁用"
            : "未知"}
        </el-tag>
      )
    },
    {
      label: "手机号",
      prop: "phone",
      minWidth: 100
    },
    {
      label: "邮箱",
      prop: "email",
      minWidth: 140
    },
    {
      label: "创建时间",
      minWidth: 120,
      prop: "createdAt",
      formatter: ({ createdAt }) =>
        dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 190,
      slot: "operation"
    }
  ];

  function handleCreate() {
    console.log("创建");
    openDialogFrom("create");
  }
  function hadleEditAuthority(value) {
    console.log("value", value);
    if (value.length === 0) {
      dialogForm.value.formData.authorityList = [];
      return;
    } else {
      const l = [];
      value.forEach(el => {
        el.forEach(sub => {
          l.push(sub);
        });
      });
      dialogForm.value.formData.authorityList = l;
    }
  }
  async function handleUpdate(row) {
    console.log("更新", row);
    dialogForm.value.formData = row;
    openDialogFrom("edit");
    const resp = await GetAuthorityList({ page: 1, pageSize: -1 });
    if (HandleResponseErr(resp)) {
      authorityTree.value = convertToAuthorityTree(resp.list);
      dialogForm.value.formDataAuthorityList = row.authority.map(
        el => el.authorityId
      );
    } else {
      message("角色列表获取失败，无法更新用户角色", { type: "error" });
    }
  }
  //将角色列表转换为树形结构
  function convertToAuthorityTree(list) {
    const tree = list
      .filter(el => !el.parentId)
      .map(el => {
        const node = {
          id: el.id,
          label: el.name,
          children: findChildren(list, el.id),
          value: el.id
        };
        return node;
      });
    console.log("tree", tree);
    return tree;
  }
  function findChildren(list, id) {
    const children = [];
    list.forEach(el => {
      if (el.parentId === id) {
        const node = {
          id: el.id,
          label: el.name,
          children: [],
          value: el.id
        };
        node.children = findChildren(list, el.id);
        children.push(node);
      }
    });
    return children;
  }

  async function handleDelete() {
    const result = await DeleteUser({ ids: muiltSelectList.value });
    if (HandleResponseCode(result)) {
      onSearch();
    }
  }

  function handleSelectionChange(val) {
    muiltSelectList.value = [];
    val.forEach(el => {
      muiltSelectList.value.push(el.id);
    });
  }
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  //搜索表单内容
  const searchForm = reactive({
    userName: "",
    uuid: "",
    status: 0,
    nickName: "",
    phone: "",
    email: ""
  });
  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const response = await GetUserList({
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      userName: searchForm.userName,
      uuid: searchForm.uuid,
      status: searchForm.status,
      nickName: searchForm.nickName,
      email: searchForm.email,
      phone: searchForm.phone
    });
    if (response.code !== 0) {
      message(response.notice, { type: "error" });
      return;
    }
    pagination.total = response.pageInfo.total;
    dataList.value = handleTree(response.list);
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  onMounted(() => {
    onSearch();
  });

  ////自定义表单校验规则
  // const validateRemark = (rule: any, value: any, callback: any) => {
  //   if (value.length > 50) {
  //     callback(new Error("备注内容字数不能超过50"));
  //   }
  // };
  // 会话表单
  const dialogForm = ref({
    ////展示表单
    dialogFormVisible: false,
    ////表单表格题
    dialogTitle: "创建用户",
    //// 操作 create、edit
    operation: "create",
    ////formData表单中的数据，和table中的一样要与prop进行关联
    formData: reactive({} as userInfo & { authorityList: string[] }),
    formDataAuthorityList: [],
    list: [],
    ////表单校验规则
    rules: {
      userName: [{ required: true, message: "请输入用户名", trigger: "blur" }]
    },
    searchSelectList: reactive([])
  });
  function initDialogFormData() {
    dialogForm.value.formData = {
      id: 0,
      createdAt: null,
      uuid: "",
      email: "",
      userName: "",
      phone: "",
      authorityId: "",
      status: 2,
      nickName: "",
      headerImg: "",
      tokenExpireAt: null,
      authority: [],
      lang: "",
      authorityList: [],
      pwdExpiredAfter: ""
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
              const res = await CreateUser(dialogForm.value.formData);
              if (res.code === 0) {
                message("添加成功", { type: "success" });
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
              dialogForm.value.formData.authorityList = [];
              if (dialogForm.value.formDataAuthorityList.length > 0) {
                // 提取每个字符串中的最后一个数字
                const lastNumbers = dialogForm.value.formDataAuthorityList
                  .map(arrayAuth => {
                    return arrayAuth ? arrayAuth[arrayAuth.length - 1] : null;
                  })
                  .filter(num => num !== null);
                dialogForm.value.formData.authorityList = [
                  ...new Set(lastNumbers)
                ];
              }
              if (
                dialogForm.value.formData.passwordExpired != null &&
                dialogForm.value.formData.passwordExpired != ""
              ) {
                dialogForm.value.formData.passwordExpired = convertToUTC8(
                  dialogForm.value.formData.passwordExpired
                );
              }
              const res = await UpdateUser(dialogForm.value.formData);
              if (res.code === 0) {
                dialogForm.value.formDataAuthorityList = [];
                message("更新成功", { type: "success" });
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

  return {
    searchForm,
    muiltSelectList,
    loading,
    columns,
    dataList,
    onSearch,
    resetForm,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleSelectionChange,
    pagination,
    authorityTree,
    dialogForm,
    closeDialogForm,
    formSumbit,
    hadleEditAuthority
  };
}
