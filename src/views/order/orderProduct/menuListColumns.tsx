export const tableColumns: TableColumnList = [
  {
    type: "selection",
    width: 55,
    align: "left"
  },

  {
    label: "商品标签",
    prop: "mTagName",
    width: 100,
    align: "center"
  },
  {
    label: "商品编号",
    prop: "productNo",
    minWidth: 120,
    align: "center"
  },
  // {
  //   label: "关键字",
  //   prop: "key",
  //   width: 100,
  //   align: "center"
  // },
  {
    label: "商品名",
    prop: "name",
    minWidth: 90,
    align: "center"
  },
  {
    label: "商品描述",
    prop: "desc",
    minWidth: 120,
    align: "center"
  },
  // {
  //   label: "详细说明",
  //   prop: "content",
  //   width: 120,
  //   align: "center"
  // },
  // {
  //   label: "web端展示",
  //   prop: "webView",
  //   minWidth: 70,
  //   align: "center"
  // },
  {
    label: "商品类型",
    prop: "productType",
    width: 100,
    align: "center",
    cellRenderer: ({ row }) => (
      <span>
        {row.productType === 0
          ? "无"
          : row.productType === 1
          ? "独立商品"
          : row.productType === 2
          ? "套餐商品"
          : row.productType === 3
          ? "套餐商品子项"
          : "未知"}
      </span>
    )
  },

  // {
  //   label: "父级id,套餐子商品使用",
  //   prop: "parentId",
  //   width: 100,
  //   align: "center"
  // },
  {
    label: "默认货币",
    prop: "defaultCurrencyName",
    width: 100,
    align: "center"
  },

  {
    label: "状态",
    prop: "status",
    width: 100,
    align: "center",
    cellRenderer: ({ row }) => (
      <span>
        {row.status === 0
          ? "无"
          : row.status === 1
          ? "预发布"
          : row.status === 2
          ? "已上架"
          : row.status === 3
          ? "已下架"
          : "未知"}
      </span>
    )
  },
  // {
  //   label: "展示数量单位",
  //   prop: "quantityUnit",
  //   width: 100,
  //   align: "center"
  // },
  // {
  //   label: "展示时间单位",
  //   prop: "timeUnit",
  //   width: 100,
  //   align: "center"
  // },
  // {
  //   label: "计算单位",
  //   prop: "calculateUnit",
  //   width: 100,
  //   align: "center",
  //   cellRenderer: ({ row }) => (
  //     <span>
  //       {row.calculateUnit === 0
  //         ? "无"
  //         : row.calculateUnit === 1
  //         ? "数量"
  //         : row.calculateUnit === 2
  //         ? "时间"
  //         : row.calculateUnit === 3
  //         ? "数量和时间"
  //         : "未知"}
  //     </span>
  //   )
  // },
  {
    label: "操作",
    fixed: "right",
    width: 190,
    slot: "operation"
  }
];
