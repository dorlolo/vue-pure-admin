export const tableColumns: TableColumnList = [
  {
    type: "selection",
    width: 55,
    align: "left"
  },
  {
    label: "版本号",
    prop: "version",
    minWidth: 100,
    align: "center"
  },
  {
    label: "地址",
    prop: "url",
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
