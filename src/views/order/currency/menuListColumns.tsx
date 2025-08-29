export const tableColumns: TableColumnList = [
  {
    type: "selection",
    width: 55,
    align: "left"
  },
  {
    label: "货币代码",
    prop: "code",
    minWidth: 100,
    align: "center"
  },
  {
    label: "货币名称",
    prop: "name",
    minWidth: 100,
    align: "center"
  },
  {
    label: "小数位精度",
    prop: "decimalPlaces",
    minWidth: 100,
    align: "center"
  },
  {
    label: "地区",
    prop: "region",
    minWidth: 100,
    align: "center"
  },
  {
    label: "是否为辅币",
    prop: "subunit",
    minWidth: 100,
    align: "center",
    cellRenderer: ({ row }) => (
      <span>
        {row.subunit === 0
          ? "无"
          : row.subunit === 1
          ? "是"
          : row.subunit === 2
          ? "否"
          : "未知"}
      </span>
    )
  },
  {
    label: "辅币对主币的数量比",
    prop: "ratio",
    minWidth: 100,
    align: "center"
  },
  {
    label: "单位",
    prop: "unit",
    minWidth: 100,
    align: "center"
  },
  {
    label: "中文单位",
    prop: "cnUnit",
    minWidth: 100,
    align: "center"
  },
  {
    label: "备注",
    prop: "notes",
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
