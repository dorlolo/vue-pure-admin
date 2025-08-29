export const tableColumns: TableColumnList = [
  {
    type: "selection",
    width: 55,
    align: "left"
  },
  {
    label: "分组名称",
    prop: "groupName",
    minWidth: 100,
    align: "center"
  },
  {
    label: "计量单位名称",
    prop: "name",
    minWidth: 100,
    align: "center"
  },
  {
    label: "计量单位key",
    prop: "key",
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
