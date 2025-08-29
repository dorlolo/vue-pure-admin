export const tableColumns: TableColumnList = [
  {
    type: "selection",
    width: 55,
    align: "left"
  },
  {
    label: "时间",
    prop: "createdAt",
    minWidth: 120,
    align: "center"
  },
  {
    label: "请求id",
    prop: "requestId",
    minWidth: 80,
    align: "center"
  },
  {
    label: "模块",
    prop: "module",
    minWidth: 80,
    align: "center"
  },
  {
    label: "域",
    prop: "domain",
    minWidth: 70,
    align: "center"
  },
  {
    label: "用户id",
    prop: "userId",
    minWidth: 60,
    align: "center"
  },
  // {
  //   label: "用户名",
  //   prop: "userName",
  //   minWidth: 100,
  //   align: "center"
  // },
  // {
  //   label: "请求ip",
  //   prop: "ip",
  //   minWidth: 100,
  //   align: "center"
  // },
  {
    label: "数据操作",
    prop: "action",
    minWidth: 100,
    align: "center"
  },
  {
    label: "说明",
    prop: "target",
    minWidth: 100,
    align: "center"
  },
  // {
  //   label: "请求方式",
  //   prop: "method",
  //   minWidth: 100,
  //   align: "center"
  // },
  // {
  //   label: "请求头",
  //   prop: "header",
  //   minWidth: 100,
  //   align: "center"
  // },
  {
    label: "接口路径",
    prop: "path",
    minWidth: 160,
    align: "center"
  },
  // {
  //   label: "请求体",
  //   prop: "body",
  //   minWidth: 100,
  //   align: "center"
  // },
  {
    label: "结果",
    prop: "result",
    minWidth: 100,
    align: "center"
  },
  {
    label: "耗时",
    prop: "cost",
    minWidth: 100,
    align: "center"
  },
  // {
  //   label: "处理报错",
  //   prop: "errors",
  //   minWidth: 100,
  //   align: "center"
  // },
  {
    label: "操作",
    fixed: "right",
    width: 190,
    slot: "operation"
  }
];
