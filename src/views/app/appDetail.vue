<script setup lang="ts">
import { message } from "@/utils/message";
import { useDetail } from "./hooks";
import { ref, onMounted } from "vue";
import { appType, getAppDetail } from "@/api/app";
import { useDateFormat } from "@vueuse/core";
//获取菜单
import { getAppMenuList } from "@/api/appMenu";
import appMenu from "./components/appMenu.vue";
//获取api
import { getApiList } from "@/api/appApi";

import appApi from "./components/appApi.vue";
defineOptions({
  name: "TabQueryDetail"
});

//内容加载
const { initToDetail, id } = useDetail();
initToDetail();
const appData = ref({} as appType);
const dataLoading = ref(true);
const appDescription = ref([]);
const getAppDetailData = async () => {
  try {
    const result = await getAppDetail({ id: id });
    if (result.code != 0) {
      message(result.notice, { type: "error" });
      return;
    }
    appData.value = result.data;
    console.log("appData.value:", appData.value);
    console.log("appData.value.id:", appData.value.id);
    // console.log("appData.value.description", appData.value.description);
    appDescription.value = [
      // { label: "描述", field: appData.value.description },
      {
        label: "创建时间",
        field: useDateFormat(appData.value.createdAt, "YYYY-MM-DD")
      },
      {
        label: "更新时间",
        field: useDateFormat(appData.value.updatedAt, "YYYY-MM-DD")
      },
      {
        label: "类型",
        field: appData.value.appType === 1 ? "系统模块" : "业务模块"
      },
      { label: "表", field: appData.value.table },
      {
        label: "状态",
        field: appData.value.usageState === 1 ? "启用" : "禁用"
      },
      { label: "排序", field: appData.value.sort }
    ];
    // console.log("appDescription", appDescription);
  } catch (e) {
    message(e, { type: "error" });
  } finally {
    setTimeout(() => {
      dataLoading.value = false;
    }, 500);
  }
};
//子组件数据： 模型字段列表 todo
//..
//..

//默认选择的菜单
const clikeMenuName = ref("model");
//子组件数据： 菜单列表
const appMenuList = ref([]);
const tagClick = tab => {
  if (tab.paneName === "menu") {
    clickGetAppMenuList();
  } else if (tab.paneName === "api") {
    clickGetApiList();
  } else if (tab.paneName === "model") {
    console.log("未完成");
  }
};
const clickGetAppMenuList = async () => {
  try {
    const result = await getAppMenuList({
      appId: appData.value.id,
      page: 1,
      pageSize: 10
    });
    console.log("getAppMenuList_result:", result);
    if (result.code != 0) {
      message(result.notice, { type: "error" });
      return;
    }
    appMenuList.value = result.list ? result.list : [];
    // pagination.value = {
    //   ...pagination.value,
    //   total: result.pageInfo.total
    // };
  } catch (e) {
    alert(e);
  } finally {
    setTimeout(() => {
      dataLoading.value = false;
    }, 500);
  }
};
const getAppId = () => {
  console.log("父级appId", appData.value.id);
  return appData.value.id;
};
//子组件数据： api列表
const appApiList = ref([]);
const clickGetApiList = async () => {
  try {
    const result = await getApiList({
      appId: appData.value.id,
      page: 1,
      pageSize: 10
    });
    console.log("getApiList_result:", result);
    if (result.code != 0) {
      message(result.notice, { type: "error" });
      return;
    }
    appApiList.value = result.list ? result.list : [];
    // pagination.value = {
    //   ...pagination.value,
    //   total: result.pageInfo.total
    // };
  } catch (e) {
    alert(e);
  } finally {
    setTimeout(() => {
      dataLoading.value = false;
    }, 500);
  }
};
//加载
onMounted(() => {
  getAppDetailData();
  appMenuList.value = [];
  appApiList.value = [];
});
</script>

<template>
  <div class="common-layout">
    <el-card class="box-card m-4" shadow="hover" style="padding: 0 !important">
      <template #header>
        <div class="card-header">
          <span class="font-large" :style="{ fontSize: '2em' }"
            >{{ appData.name }}
          </span>
        </div>
        <div>
          <span :style="{ fontSize: '0.6em' }">{{ appData.description }}</span>
        </div>
      </template>
      <el-descriptions border>
        <el-descriptions-item
          :label="item.label"
          label-align="left"
          align="left"
          v-for="(item, index) in appDescription"
          :key="index"
        >
          <a>
            <span>{{ item.field }}</span>
            <!-- <span style="color: var(--el-color-primary)">{{ item.field }}</span> -->
          </a>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <div css="el-main">
      <el-tabs type="border-card" v-model="clikeMenuName" @tab-click="tagClick">
        <el-tab-pane label="模型管理" name="model">
          <el-empty description="暂无数据" />
        </el-tab-pane>
        <el-tab-pane label="菜单管理" name="menu">
          <appMenu
            :appMenuList="appMenuList"
            :appId="appData.id"
            @getMenuList="clickGetAppMenuList"
            @getAppId="getAppId"
          />
        </el-tab-pane>
        <el-tab-pane label="API管理" name="api">
          <appApi
            :appApiList="appApiList"
            :appId="appData.id"
            @getApiList="clickGetApiList"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-card {
  --el-card-border-color: var(--el-border-color-light);
  --el-card-border-radius: 4px;
  --el-card-bg-color: var(--el-fill-color-blank);

  padding: 0;
  // --el-card-padding: 20px;
  margin: 0;
  // overflow: hidden;
  color: var(--el-text-color-primary);
  background-color: var(--el-card-bg-color);
  border: 1px solid var(--el-card-border-color);
  border-radius: var(--el-card-border-radius);
  transition: var(--el-transition-duration);
}

.el-main {
  // padding-top: 0;
  --el-main-padding: 0px;

  box-sizing: border-box;
  display: block;
  flex: 1;
  flex-basis: auto;
  padding: var(--el-main-padding);
  margin: 0;
  overflow: auto;
}
</style>
