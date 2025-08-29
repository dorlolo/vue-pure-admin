<script setup lang="ts">
import { computed, PropType } from "vue";
import businessCenterIcon from "@/assets/svg/outline-business-center.svg?component";
import gearWideIcon from "@/assets/svg/gear-wide-connected.svg?component";
import unknownIcon from "@/assets/svg/unknown.svg?component";
import More2Fill from "@iconify-icons/ri/more-2-fill";

defineOptions({
  name: "appCard"
});

interface CardAppInfoType {
  id: number;
  name: string;
  description: string;
  appType: number;
  table: string;
  apiGroup: any;
  menuGroup: any;
  usageState?: number;
  sort: number;
  depends: Array<CardAppInfoType>;
}

const props = defineProps({
  app: {
    type: Object as PropType<CardAppInfoType>
  }
});

const cardClass = computed(() => [
  "list-card-item",
  { "list-card-item__disabled": props.app.usageState === 2 }
]);
const cardLogoClass = computed(() => [
  "list-card-item_detail--logo",
  { "list-card-item_detail--logso__disabled": props.app.usageState === 2 }
]);

const emit = defineEmits([
  "manage-app",
  "delete-app",
  "update-app",
  "to-detail"
]);
const toDetail = (app: CardAppInfoType) => {
  console.log("toDetail");
  emit("to-detail", app.id, app.name);
};
const handleClickEdit = (app: CardAppInfoType) => {
  emit("manage-app", app);
};

const handleClickDelete = (app: CardAppInfoType) => {
  emit("delete-app", app);
};
const changeAppUsageState = (app: CardAppInfoType) => {
  app.usageState = app.usageState === 1 ? 2 : 1;
  console.log(app.usageState);
  emit("update-app", app);
};
//空事件，阻止触发父级点击事件
const emptyEvent = () => {
  return;
};
</script>

<template>
  <div :class="cardClass" @click="toDetail(app)">
    <div class="list-card-item_detail bg-bg_color">
      <el-row justify="space-between" @click.stop="emptyEvent">
        <div :class="cardLogoClass">
          <gearWideIcon v-if="app.appType === 1" />
          <businessCenterIcon v-else-if="app.appType === 2" />
          <unknownIcon v-else />
        </div>
        <div class="list-card-item_detail--operation">
          <el-tag
            :color="app.usageState === 1 ? '#00a870' : '#eee'"
            effect="dark"
            class="mx-1 list-card-item_detail--operation--tag"
            @click.stop="changeAppUsageState(app)"
          >
            {{ app.usageState === 1 ? "已启用" : "已禁用" }}
          </el-tag>
          <el-dropdown trigger="click">
            <IconifyIconOffline :icon="More2Fill" class="text-[24px]" />
            <template #dropdown>
              <el-dropdown-menu :disabled="app.usageState != 1">
                <el-dropdown-item @click.stop="handleClickEdit(app)">
                  编辑
                </el-dropdown-item>
                <el-dropdown-item @click.stop="handleClickDelete(app)">
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-row>
      <p class="list-card-item_detail--name text-text_color_primary">
        {{ app.name }}
      </p>
      <p class="list-card-item_detail--desc text-text_color_regular">
        {{ app.description }}
      </p>
      <!-- 展示依赖项 -->
      <!-- <el-row
        :gutter="40"
        v-if="
          app.depends != undefined &&
          app.depends != null &&
          app.depends.length > 0
        "
      >
        <el-tag v-for="(depApp, i) of app.depends" :key="i" light small>{{
          depApp.name
        }}</el-tag>
      </el-row> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.list-card-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 3px;

  &_detail {
    flex: 1;
    min-height: 140px;
    padding: 24px 32px;

    &--logo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      font-size: 32px;
      color: #0052d9;
      background: #e0ebff;
      border-radius: 50%;

      &__disabled {
        color: #a1c4ff;
      }
    }

    &--operation {
      display: flex;
      height: 100%;

      &--tag {
        border: 0;
      }
    }

    &--name {
      margin: 24px 0 8px;
      font-size: 16px;
      font-weight: 400;
    }

    &--desc {
      display: -webkit-box;
      height: 40px;
      margin-bottom: 24px;
      overflow: hidden;
      font-size: 12px;
      line-height: 20px;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  &__disabled {
    .list-card-item_detail--name,
    .list-card-item_detail--desc {
      color: var(--el-text-color-disabled);
    }

    .list-card-item_detail--operation--tag {
      color: #bababa;
    }
  }
}
</style>
