<script setup lang="ts">
import Card from "./components/Card.vue";
import { getAppList, deleteApps, updateApp } from "@/api/app";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { ref, onMounted, nextTick, provide } from "vue";
import dialogForm from "./components/DialogForm.vue";
import Search from "@iconify-icons/ep/search";
// 跳转详情页
import { useDetail } from "./hooks";

defineOptions({
  name: "AppCardList"
});

const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `;

const INITIAL_DATA = {
  name: "",
  status: "",
  description: "",
  type: "",
  mark: ""
};

const pagination = ref({ current: 1, pageSize: 12, total: 0 });

const appList = ref([]);
const dataLoading = ref(true);

const getAppListData = async () => {
  try {
    console.log("分页", pagination.value);
    const result = await getAppList({
      page: 1,
      pageSize: -1
    });
    if (result.code != 0) {
      message(result.notice, { type: "error" });
    }
    appList.value = result.list;
    pagination.value = {
      ...pagination.value,
      total: result.pageInfo.total
    };
  } catch (e) {
    alert(e);
  } finally {
    setTimeout(() => {
      dataLoading.value = false;
    }, 500);
  }
};

onMounted(() => {
  getAppListData();
});
//依赖注入子组件
provide("getAppListData", { getAppListData });

const formDialogVisible = ref(false);
const formData = ref({ ...INITIAL_DATA });
const searchValue = ref("");

const onPageSizeChange = (size: number) => {
  pagination.value.pageSize = size;
  pagination.value.current = 1;
  getAppListData();
};
const onCurrentChange = (current: number) => {
  pagination.value.current = current;
  getAppListData();
  console.log("listdata:", appList.value);
};
const handleDeleteItem = app => {
  ElMessageBox.confirm(
    app ? `确认删除后${app.name}的所有模块信息将被清空, 且无法恢复` : "",
    "提示",
    {
      type: "warning"
    }
  )
    .then(async () => {
      const result = await deleteApps({ id: app.id });
      if (result.code === 0) {
        message("删除成功", { type: "success" });
        const appIndex = appList.value.indexOf(app);
        appList.value.splice(appIndex, 1);
      } else {
        message("删除失败：" + result.notice, { type: "error" });
      }
    })
    .catch(e => {
      alert(e);
    });
};
const handleUpdateApp = async app => {
  const result = await updateApp(app);
  if (result.code === 0) {
    message("更新成功", { type: "success" });
  } else {
    message("更新失败" + result.notice, { type: "error" });
  }
};
const handleManageApp = app => {
  formDialogVisible.value = true;
  nextTick(() => {
    formData.value = { ...app, status: app?.usageState ? "1" : "0" }; //todo
  });
};
// 跳转详情页
const { toDetail } = useDetail();
</script>

<template>
  <div class="main">
    <div class="w-full flex justify-between mb-4">
      <!-- <el-button
        :icon="useRenderIcon(AddFill)"
        @click="formDialogVisible = true"
      >
        新建模块
      </el-button> -->
      <el-input
        style="width: 300px"
        v-model="searchValue"
        placeholder="请输入模块名称"
        clearable
      >
        <template #suffix>
          <el-icon class="el-input__icon">
            <IconifyIconOffline
              v-show="searchValue.length === 0"
              :icon="Search"
            />
          </el-icon>
        </template>
      </el-input>
    </div>
    <div
      v-loading="dataLoading"
      :element-loading-svg="svg"
      element-loading-svg-view-box="-10, -10, 50, 50"
    >
      <el-empty
        description="暂无数据"
        v-show="
          appList
            .slice(
              pagination.pageSize * (pagination.current - 1),
              pagination.pageSize * pagination.current
            )
            .filter(v =>
              v.name.toLowerCase().includes(searchValue.toLowerCase())
            ).length === 0
        "
      />
      <template v-if="pagination.total > 0">
        <el-row :gutter="16">
          <el-col
            v-for="(app, index) in appList
              .slice(
                pagination.pageSize * (pagination.current - 1),
                pagination.pageSize * pagination.current
              )
              .filter(v =>
                v.name.toLowerCase().includes(searchValue.toLowerCase())
              )"
            :key="index"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <Card
              :app="app"
              @delete-app="handleDeleteItem"
              @manage-app="handleManageApp"
              @update-app="handleUpdateApp"
              @to-detail="toDetail"
            />
          </el-col>
        </el-row>
        <el-pagination
          class="float-right"
          v-model:currentPage="pagination.current"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[12, 24, 36]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="onPageSizeChange"
          @current-change="onCurrentChange"
        />
      </template>
    </div>
    <dialogForm v-model:visible="formDialogVisible" :data="formData" />
  </div>
</template>
