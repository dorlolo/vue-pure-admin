export const tableColumns: TableColumnList = [
  {
    type: "selection",
    width: 55,
    align: "left"
  },
  {
    label: "设备号",
    prop: "sn",
    minWidth: 80,
    align: "center"
  },
  {
    label: "关联货架",
    prop: "containerRel",
    minWidth: 80,
    align: "center"
  },
  {
    label: "mac地址",
    prop: "mac",
    minWidth: 100,
    align: "center"
  },
  // {
  //   label: "所在位置",
  //   prop: "location",
  //   minWidth: 100,
  //   align: "center"
  // },
  {
    label: "联网状态", // 1=在线 2=离线
    prop: "netStatus",
    minWidth: 70,
    align: "center",
    formatter: ({ netStatus }) =>
      netStatus == 1 ? (
        <text style="color:#13ce66">在线</text>
      ) : netStatus == 2 ? (
        <text style="color:#ff4747">离线</text>
      ) : (
        <text style="color:#CDD0D6">无</text>
      )
  },
  {
    label: "设备状态", // 1=使用中 2=作废
    prop: "useStatus",
    minWidth: 70,
    align: "center",
    formatter: ({ useStatus }) =>
      useStatus == 1 ? (
        <text style="color:#13ce66">使用中</text>
      ) : useStatus == 2 ? (
        <text style="color:#ff4747">作废</text>
      ) : (
        <text style="color:#CDD0D6">无</text>
      )
  },
  // {
  //   label: "设备外网IP",
  //   prop: "ip",
  //   minWidth: 100,
  //   align: "center"
  // },
  // {
  //   label: "内网Ip",
  //   prop: "locationIp",
  //   minWidth: 100,
  //   align: "center"
  // },
  // {
  //   label: "LED类型",
  //   prop: "ledType",
  //   minWidth: 100,
  //   align: "center"
  // },
  {
    label: "模式", //1=正常模式 2=调试模式
    prop: "mode",
    minWidth: 70,
    align: "center",
    formatter: ({ mode }) =>
      mode == 1 ? (
        <span>工作</span>
      ) : mode == 2 ? (
        <span>调试</span>
      ) : (
        <span>无</span>
      )
  },
  {
    label: "引脚/灯珠总数",
    prop: "pinTotal",
    minWidth: 100,
    align: "center"
  },
  {
    label: "wifi名称",
    prop: "ssid",
    minWidth: 100,
    align: "center"
  },
  // {
  //   label: "wifi密码",
  //   prop: "password",
  //   minWidth: 100,
  //   align: "center"
  // },
  {
    label: "系统版本",
    prop: "version",
    minWidth: 100,
    align: "center"
  },
  {
    label: "备注",
    prop: "remark",
    minWidth: 100,
    align: "center"
  },
  {
    label: "最近一次ping",
    prop: "pingTime",
    minWidth: 100,
    align: "center"
  },
  {
    label: "操作",
    fixed: "right",
    width: 190,
    slot: "operation"
  }
];
