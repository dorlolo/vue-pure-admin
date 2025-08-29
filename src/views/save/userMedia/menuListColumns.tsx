import { formatBytes } from "@/components/upload/hook";
import { formatDate } from "@/utils/date";
export const tableColumns: TableColumnList = [
  {
    type: "selection",
    width: 55,
    align: "left"
  },
  {
    label: "序号",
    prop: "xid",
    minWidth: 70,
    align: "center"
  },
  {
    label: "创建时间",
    prop: "createdAt",
    minWidth: 120,
    align: "center",
    cellRenderer: ({ row }) => <span>{formatDate(row.createdAt)}</span>
  },
  {
    label: "文件类型",
    prop: "fileType",
    minWidth: 100,
    align: "center",
    cellRenderer: ({ row }) => <span>{formatFileType(row.fileType)}</span>
  },
  {
    label: "标题",
    prop: "title",
    minWidth: 100,
    align: "center"
  },
  {
    label: "后缀格式",
    prop: "formatType",
    minWidth: 70,
    align: "center"
  },
  // {
  //   label: "封面",
  //   prop: "coverUrl",
  //   minWidth: 100,
  //   align: "center"
  // },
  // {
  //   label: "描述",
  //   prop: "description",
  //   minWidth: 100,
  //   align: "center"
  // },
  {
    label: "大小",
    prop: "size",
    minWidth: 100,
    align: "center",
    cellRenderer: ({ row }) => <span>{formatBytes(row.size)}</span>
  },
  {
    label: "来源",
    prop: "source",
    minWidth: 100,
    align: "center"
  },
  {
    label: "上传状态",
    prop: "uploadState",
    minWidth: 100,
    align: "center",
    cellRenderer: ({ row, props }) => (
      <el-tag
        effect="dark"
        size={props.size}
        type={
          row.uploadState === 1
            ? ""
            : row.uploadState === 2
            ? "danger"
            : row.uploadState === 3
            ? "success"
            : "warning"
        }
      >
        {row.uploadState === 1
          ? "待上传"
          : row.uploadState === 2
          ? "失败"
          : row.uploadState === 3
          ? "成功"
          : "无"}
      </el-tag>
    )
  },
  {
    label: "用户昵称",
    prop: "nickName",
    minWidth: 100,
    align: "center"
  },
  {
    label: "手机号",
    prop: "phone",
    minWidth: 100,
    align: "center"
  },
  {
    label: "邮箱",
    prop: "email",
    minWidth: 100,
    align: "center"
  },
  {
    label: "更新时间",
    prop: "updatedAt",
    minWidth: 100,
    align: "center",
    cellRenderer: ({ row }) => <span>{formatDate(row.updatedAt)}</span>
  },
  {
    label: "删除时间",
    prop: "deletedAt",
    minWidth: 100,
    align: "center",
    cellRenderer: ({ row }) => <span>{formatDate(row.deletedAt)}</span>
  },
  {
    label: "操作",
    fixed: "right",
    width: 220,
    slot: "operation"
  }
];
function formatFileType(cellValue) {
  const definitions = {
    "1": "视频",
    "2": "音频",
    "3": "图片",
    "4": "文件",
    "5": "其它"
  };
  return definitions[cellValue] || cellValue;
}
