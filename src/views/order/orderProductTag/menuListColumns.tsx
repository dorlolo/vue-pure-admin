export const tableColumns: TableColumnList = [
  {
    type: "selection",
    width: 55,
    align: "left"
  },

  {
    label: "产品类别",
    prop: "name",
    minWidth: 100,
    align: "center"
  },
  {
    label: "唯一键字符",
    prop: "key",
    minWidth: 100,
    align: "center"
  },
  {
    label: "排序编号",
    prop: "sort",
    minWidth: 100,
    align: "center"
  },

  // {
  //   label: "父级id",
  //   prop: "parentId",
  //   minWidth: 100,
  //   align: "center"
  // },

  {
    label: "操作",
    fixed: "right",
    minWidth: 190,
    slot: "operation"
  }
];
