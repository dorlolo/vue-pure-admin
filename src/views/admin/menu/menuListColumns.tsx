export const tableColumns: TableColumnList = [
  {
    type: "selection",
    width: 55,
    align: "left"
  },
  {
    label: "菜单标题",
    prop: "title",
    width: 140,
    align: "left"
  },
  {
    label: "所属应用",
    prop: "appName",
    width: 100,
    align: "left",
    cellRenderer: ({ row }) => (
      <span>{row.appName === "" ? "无" : row.appName}</span>
    )
  },
  {
    label: "菜单ID",
    prop: "id",
    width: 100,
    align: "center"
  },
  {
    label: "名称",
    prop: "name",
    width: 140,
    align: "left"
  },
  {
    label: "文件路径",
    prop: "path",
    minWidth: 140,
    align: "left"
  },
  {
    label: "组件",
    prop: "component",
    width: 140,
    align: "left"
  },
  {
    label: "图标",
    prop: "icon",
    width: 140,
    align: "left"
  },
  {
    label: "排序",
    prop: "rank",
    width: 140,
    align: "left"
  },
  {
    label: "显示父级",
    prop: "showParent",
    width: 140,
    align: "left"
  },
  {
    label: "自动授权",
    prop: "autoEnable",
    width: 90,
    align: "left",
    cellRenderer: ({ row, props }) => (
      <el-tag
        size={props.size}
        type={row.autoEnable === 1 ? "success" : "info"}
        effect="light"
      >
        {row.autoEnable === 1 ? "启用" : row.autoEnable === 2 ? "禁用" : "无"}
      </el-tag>
      // cellRenderer: ({ row }) => (
      //   <span>
      //     {row.autoEnable === 1 ? "启用" : row.autoEnable === 2 ? "禁用" : "无"}
      //   </span>
    )
  },
  {
    label: "页面缓存",
    prop: "name",
    width: 140,
    align: "center",
    minWidth: 100,
    cellRenderer: ({ row, props }) => (
      <el-tag
        size={props.size}
        type={row.status === 1 ? "success" : "info"}
        effect="light"
      >
        {row.status === 1 ? "开启" : "关闭"}
      </el-tag>
    )
  },
  {
    label: "操作",
    fixed: "right",
    width: 190,
    slot: "operation"
  }
];
