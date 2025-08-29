export const tableColumns: TableColumnList = [
  {
    type: "selection",
    width: 55,
    align: "left"
  },
  {
    label: "正面",
    prop: "front",
    minWidth: 100,
    align: "center"
  },
  {
    label: "背面",
    prop: "back",
    minWidth: 100,
    align: "center"
  },
  {
    label: "学习状态",
    prop: "status",
    minWidth: 100,
    align: "center",
    cellRenderer: ({ row }) => (
      <span>
        {row.status === 1
          ? "未学习"
          : row.status === 2
          ? "已学习"
          : row.status === 3
          ? "已掌握"
          : "无"}
      </span>
    )
  },

  {
    label: "复习次数",
    prop: "reviewCount",
    minWidth: 100,
    align: "center"
  },

  {
    label: "组名",
    prop: "groupId",
    minWidth: 100,
    align: "center"
  },

  {
    label: "引用卡片id",
    prop: "citeId",
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
