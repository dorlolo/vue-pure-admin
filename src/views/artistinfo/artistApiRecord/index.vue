<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useApiRecord } from "./hook";
import { PureTable } from "@pureadmin/table";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";

defineOptions({
  name: "ArtistApiRecord"
});
const tableRef = ref();
const searchFormRef = ref();
const {
  loading,
  columns,
  dataList,
  searchFormData,
  pagination,
  initSearchFormData,
  onSearch,
  resetSearchForm,
  handleDelete,
  handleSelectionChange,
  handleDetail,
  dialogForm,
  closeDialogForm
} = useApiRecord();
onMounted(() => {
  initSearchFormData();
  onSearch();
});
const pageActiveName = ref("requestBody");
function getNodeYPosition(traceLines, index, type) {
  const thisLine = traceLines[index];
  let nodeFuncCount = 1;
  let nodeLength = 0;
  if (thisLine.nodeStep === "start") {
    for (let i = index + 1; i < traceLines.length; i++) {
      const endLine = traceLines[i];
      nodeFuncCount += endLine.result.length;
      if (endLine.nodeStep === "end") {
        break;
      } else {
        nodeFuncCount++;
      }
    }
    if (type === 0) {
      nodeLength = nodeFuncCount - 5;
    } else {
      nodeLength = nodeFuncCount * 20;
    }
    console.log("index:", index, "type:", type, "length:", nodeLength);
  }
  return nodeLength;
}
</script>

<template>
  <div class="main">
    <el-form
      ref="searchFormRef"
      :inline="true"
      :model="searchFormData"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="环境" prop="status">
        <el-select
          v-model="searchFormData.env"
          placeholder="选择环境"
          class="!w-[180px]"
        >
          <el-option label="生产环境" :value="3" />
          <el-option label="测试" :value="2" />
          <el-option label="本地" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="searchFormData.userName"
          placeholder="请输入用户姓名"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="searchFormData.phone"
          placeholder="请输入用户手机号"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="事件" prop="message">
        <el-input
          v-model="searchFormData.likeTime"
          placeholder="模糊查询事件内容"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="接口名" prop="target">
        <el-input
          v-model="searchFormData.target"
          placeholder="模糊查询接口名"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="模糊时间" prop="likeTime">
        <el-input
          v-model="searchFormData.likeTime"
          placeholder="模糊查询时间"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="请求内容" prop="body">
        <el-input
          v-model="searchFormData.body"
          placeholder="模糊查询请求内容"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="请求结果" prop="result">
        <el-input
          v-model="searchFormData.result"
          placeholder="模糊查询请求结果"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="错误" prop="errors">
        <el-input
          v-model="searchFormData.errors"
          placeholder="模糊查询错误内容"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button
          :icon="useRenderIcon(Refresh)"
          @click="resetSearchForm(searchFormRef)"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      title="日志列表"
      :columns="columns"
      :tableRef="tableRef?.getTableRef()"
      @refresh="onSearch"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          border
          align-whole="center"
          row-key="id"
          showOverflowTooltip
          table-layout="auto"
          default-expand-all
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
          :adaptiveConfig="{ offsetBottom: 32 }"
          @selection-change="handleSelectionChange"
          @page-size-change="onSearch"
          @page-current-change="onSearch"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleDetail(row)"
              :icon="useRenderIcon(EditPen)"
            >
              详情
            </el-button>
            <el-popconfirm title="是否确认删除?">
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon(Delete)"
                  @click="handleDelete(row)"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <!-- form弹窗 -->
    <el-dialog
      v-model="dialogForm.dialogFormVisible"
      :before-close="closeDialogForm"
      :title="'请求ID: ' + dialogForm.formData.requestId"
    >
      <div style="display: flex">
        <h3>请求地址：</h3>
        <span>{{ dialogForm.formData.path }}</span>
      </div>
      <div>
        <el-tabs v-model="pageActiveName" class="demo-tabs">
          <el-tab-pane label="请求内容" name="requestBody">
            <div style="width: 90%">
              <h3>请求头</h3>
              <textarea
                class="text-content"
                :value="dialogForm.formData.jsonHeader"
                :rows="dialogForm.formData.jsonHeader ? 10 : 1"
              />
            </div>
            <div>
              <h3>请求体</h3>
              <textarea
                class="text-content"
                :value="dialogForm.formData.jsonBody"
                :rows="dialogForm.formData.jsonBody ? 10 : 1"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="返回内容" name="responseBody">
            <div style="width: 90%">
              <div>
                <h3>错误信息：</h3>
                <textarea
                  style="height: 100px !important"
                  class="text-content"
                  :value="dialogForm.formData.jsonErrors"
                  :rows="dialogForm.formData.jsonErrors ? 10 : 1"
                />
              </div>
              <div>
                <h3>返回内容</h3>
                <textarea
                  style="height: 300px !important"
                  class="text-content"
                  :value="dialogForm.formData.jsonResult"
                  :rows="dialogForm.formData.jsonResult ? 20 : 1"
                />
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="链路追踪" name="trace">
            <div>
              <h3>链路追踪：</h3>
              <div
                v-if="dialogForm.formData.traceLines"
                class="scroll-container"
              >
                <div
                  v-for="(item, index) in dialogForm.formData.traceLines"
                  v-bind="item"
                  :key="index"
                >
                  <div
                    :style="{
                      'padding-left': item.indent * 20 + 'px'
                    }"
                  >
                    <span
                      class="cricle"
                      :style="{
                        backgroundColor: item.hasErr ? 'red' : 'green'
                      }"
                    />

                    <span>{{ item.functionName }}</span>
                    <span v-if="item.nodeStep === 'start'">开始</span>
                    <span v-else-if="item.nodeStep === 'end'">结束</span>
                    <div v-else>
                      <div
                        v-for="(result, resultIndex) in item.result"
                        v-bind="result"
                        :key="resultIndex"
                      >
                        <div class="resultGroup">
                          <span class="keyLabel">{{ result.key }} ：</span>
                          <span class="valueLabel">{{ result.value }}</span>
                        </div>
                      </div>
                    </div>
                    <!-- 添加竖直连接线 -->
                    <svg>
                      <line
                        :x1="(item.indent - 1) * 10 + 5"
                        :y1="
                          getNodeYPosition(
                            dialogForm.formData.traceLines,
                            index,
                            0
                          )
                        "
                        :x2="(item.indent - 1) * 10 + 5"
                        :y2="
                          getNodeYPosition(
                            dialogForm.formData.traceLines,
                            index,
                            1
                          )
                        "
                        stroke="black"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="dialog-footer">
        <el-button size="large" @click="closeDialogForm">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.block-col-2 .demonstration {
  display: block;
  margin-bottom: 20px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.demo-tabs {
  height: 500px;
}

.text-content {
  width: 95%;
  height: 200px;
  padding: 8px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  resize: vertical;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}

.cricle {
  display: inline-block;
  width: 10px; /* 设置宽度 */
  height: 10px; /* 设置高度 */
  margin-right: 5px; /* 设置右侧间距 */
  border-radius: 50%; /* 设置边框圆角 */
}

svg {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

line {
  stroke-width: 2;
}

.resultGroup {
  display: flex;
  margin-left: 20px;
}

.keyLabel {
  padding: 0 0 0 5px;
  background-color: #e0e0e0; /* 为 key 标签添加背景色 */
  // padding: 5px; /* 调整背景色周围的内边距 */
}

.valueLabel {
  padding: 0 5px;
  margin-left: 10px; /* 分开两个 span 的距离 */
  background-color: #c0c0c0; /* 为 value 标签添加背景色 */
}

.scroll-container {
  /* 或者使用 overflow: auto; 来自动显示滚动条 */
  height: 500px; /* 设置div的高度，确保内容超过div的高度才会显示滚动条 */
  overflow-y: scroll;
}
</style>
