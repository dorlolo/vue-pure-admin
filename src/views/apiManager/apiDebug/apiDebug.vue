<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useApiDebug } from "./hook";
import ApiBody from "./compoment/apiBody.vue";
import UpArrowIcon from "@iconify-icons/ep/arrow-up";
defineOptions({
  name: "ApiDebug"
});

const {
  handlerSearch,
  searchWords,
  loading,
  tagList,
  apiList,
  host,
  mockRequest,
  apiBlockShow,
  openBlockChange,
  TagOpenStatusChange,
  TagCheckedStatusChange,
  tagExist,
  changeTagToDeepClass,
  changeTagToLightClass,
  docReload,
  openBlockMap
} = useApiDebug();
</script>

<template>
  <div>
    <div class="topbar">
      <!-- pai搜索框 -->
      <form :inline="true" class="input-wrapper wrapper">
        <el-input
          v-model="searchWords"
          placeholder="关键字搜索  标签/路径/接口说明"
          clearable
          class="inputText"
        />
        <el-button
          type="primary"
          :icon="useRenderIcon('ep:search')"
          :loading="loading"
          @click="handlerSearch"
          class="searchBtn"
          >Search</el-button
        >
      </form>
      <div>
        <el-button
          type="primary"
          :icon="useRenderIcon('ep:reload')"
          @click="docReload"
          >更新接口信息</el-button
        >
      </div>
      <!-- 标签列表,对搜素条件进行二次过滤 -->
      <div class="tag-box">
        <div v-for="thisTag in tagList" :key="thisTag.name" class="tag-item">
          <!-- <el-tag
            :style="'color:' + thisTag.color"
            :color="thisTag.bg"
            :checked="isTagChecked(thisTag.name)"
            @change="checkedTagStatusChange"
            >{{ thisTag.name }}</el-tag
          > -->
          <el-check-tag
            :checked="thisTag.checked"
            @click="TagCheckedStatusChange(thisTag)"
            >{{ thisTag.name }}</el-check-tag
          >
        </div>
      </div>
      <div>
        <div
          v-for="thisTag in tagList"
          :key="thisTag.name"
          style="margin: 25px 0"
        >
          <div v-if="thisTag.checked === true" class="border-space">
            <!-- 标签名称 -->
            <div
              @click="TagOpenStatusChange(thisTag)"
              v-on:mouseover="changeTagToDeepClass($event)"
              v-on:mouseout="changeTagToLightClass($event)"
            >
              <span class="block-tag">{{ thisTag.name }}</span>
            </div>
            <!-- api列表 -->
            <div v-if="thisTag.open">
              <div
                v-for="api in apiList"
                :key="api.name"
                style="margin: 0 0 15px"
              >
                <div v-if="tagExist(api.tags, thisTag.name)">
                  <div :class="'block block-' + api.method">
                    <div
                      style="display: flex"
                      class="block-control block-control-summary"
                      @click="openBlockChange(api.id)"
                    >
                      <span
                        :class="`apiMethod ` + api.method"
                        @click="mockRequest(host, api)"
                        :type="
                          api.method === 'POST'
                            ? 'success'
                            : api.method === 'PUT'
                            ? 'warning'
                            : api.method === 'DELETE'
                            ? 'danger'
                            : ''
                        "
                        >{{ api.method }}</span
                      >
                      <div class="apiPath">
                        /{{ api.version }}{{ api.path }}
                      </div>
                      <span>{{ api.summary }}</span>
                    </div>
                    <div v-if="apiBlockShow(api.id)">
                      <!-- <div v-for="(value, key) in openBlockMap" :key="key">
                        <div v-if="key === api.id">{{ value }}</div>
                      </div> -->
                      <div>{{ openBlockMap.get(api.id)?.method }}</div>
                      <!-- <div>
                        <div>请求参数</div>
                        <div
                          v-for="(item, index) in openBlockMap.get(api.id)
                            ?.parameters"
                          :key="index"
                        >
                          <div>{{ item }}</div>
                        </div>
                      </div>
                      <div>
                        返回值: {{ openBlockMap.get(api.id)?.responses }}
                      </div> -->
                      <apiBody :data="openBlockMap.get(api.id)" />
                      <div>
                        <el-button
                          style="width: 100%; height: 5px"
                          :icon="useRenderIcon(UpArrowIcon)"
                          @click="openBlockChange(api.id)"
                        />
                        <!-- <IconifyIconOffline :icon="UpArrowIcon" /> -->
                      </div>
                    </div>
                  </div>
                </div>
                <!-- <div>
            <div>详细描述:</div>
            <div>{{ api.description }}</div>
          </div> -->
                <!-- <div>{{ api }}</div>-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.topbar {
  // background-color: #1b1b1b;
  padding: 10px 0;
}

.topbar .wrapper {
  box-sizing: border-box;
  width: 60%;
  max-width: 1460px;
  padding: 0 20px;
  margin: 0 auto;
}

.topbar .input-wrapper {
  display: flex;
  flex: 3;
  justify-content: flex-end;
}

.topbar .input-wrapper .inputText {
  width: 100%;
  margin: 0;
  border: 2px solid #62a03f;
  border-radius: 4px 0 0 4px;
  outline: none;
}

.topbar .input-wrapper .searchBtn {
  width: 14%;
  padding: 4px 30px;
  font-family: sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background: #62a03f;
  border: none;
  border-radius: 0 4px 4px 0;
}

.searchBar {
  width: 800px;
  height: 50px;
}

.searchBtn {
  width: 50px;
  height: 50px;
}

.tag-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.5rem auto;
  // position: absolute;
}

.tag-item {
  margin: 0 0.5rem;
}

.apiMethod {
  width: 5em;
  min-width: 80px;
  padding: 6px 15px;
  font-family: sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  text-shadow: 0 1px 0 rgba (0, 0, 0, 0.1);
  background: #000;
  border-radius: 3px;
}

.apiPath {
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-family: monospace;
  font-size: 16px;
  font-weight: 600;
  color: #3b4151;
  word-break: break-word;
}

.POST {
  background: #49cc90;
}

.DELETE {
  background: #f93e3e;
}

.PUT {
  background: #fca130;
}

.GET {
  background: #61affe;
}

.block {
  border: 1px solid #000;
  border-radius: 4px;
  box-shadow: 0 0 3px rgb(0 0 0 / 19%);
}

.block-tag {
  margin: 0 0 5px;
  font-family: sans-serif;
  font-size: 24px;
  color: #3b4151;
}

.block-POST {
  background: rgb(73 204 144 / 10%);
  border-color: #49cc90;
}

.block-DELETE {
  background: rgb(249 62 62 / 10%);
  border-color: #f93e3e;
}

.block-PUT {
  background: rgb(252 161 48 / 10%);
  border-color: #fca130;
}

.block-GET {
  background: rgb(97 175 254 / 10%);
  border-color: #61affe;
}

.block-control {
  all: inherit;
  flex: 1;
  padding: 0;
  cursor: pointer;
  border-bottom: 0;
}

.block-control-summary {
  display: flex;
  align-items: center;
  padding: 5px;
  cursor: pointer;
}

.tag-deep-class {
  background-color: #e8e8e8;
}

.tag-light-class {
  cursor: pointer;
  background-color: "";
}

.border-space {
  cursor: pointer;
  border-bottom: 1px solid #626262;
}
</style>
