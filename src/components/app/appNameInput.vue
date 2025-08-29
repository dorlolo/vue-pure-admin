<script setup lang="ts">
import { ref, onMounted, defineProps, watch } from "vue";
import { getAppList } from "@/api/app";

defineOptions({
  name: "appNameInput"
});
interface RestaurantItem {
  value: string; //展示值
  link: string;
}
const inputProp = defineProps({
  input: {
    type: String
  },
  placeHolder: {
    type: String
  },
  isUpdate: {
    type: Number
  }
});

// handleSelect 处理选中事件,去除选中事件的值
// sendInputToParent 处理输入后没有点击下拉框的情况，主要目的是把输入的值传递给父组件
const functions = defineEmits(["handleSelect", "sendInputToParent"]);
//数据资源
const restaurants = ref<RestaurantItem[]>([]);
//输入值
const inputValue = ref("");

onMounted(async () => {
  // console.log("传入值", inputProp.input);
  inputValue.value = String(inputProp.input);
  await updateMenuDropDownList();
  // console.log("当前值", inputValue.value);
});
async function updateMenuDropDownList(forceUpdate?: boolean) {
  console.log("更新下拉菜单列表", forceUpdate);
  if (forceUpdate || restaurants.value.length == 0) {
    const res = await getAppList({});
    if (res.list) {
      restaurants.value = [];
      res.list.forEach(v => {
        restaurants.value.push({
          value: v.name,
          link: String(v.id)
        });
      });
    }
  }
}

const handleSelect = (item: any) => {
  functions("handleSelect", item);
};

watch(
  //监听父级数据变动
  () => inputProp.input,
  (newVal, oldVal) => {
    console.log("父级数据变动new", newVal, "old", oldVal);
    inputValue.value = newVal ? newVal : "";
  }
);
watch(
  () => inputValue.value,
  (newVal, oldVal) => {
    console.log("组件内输入数据变动", "new", newVal, "old:", oldVal);
    functions("sendInputToParent", newVal);
  }
);
watch(
  () => inputProp.isUpdate,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      updateMenuDropDownList(true);
    }
  }
);
const querySearch = (queryString: string, cb: any) => {
  const results = restaurants.value.filter(createFilter(queryString));
  cb(results.length > 0 ? results : restaurants.value);
};
const createFilter = (queryString: string) => {
  return (restaurant: RestaurantItem) => {
    return restaurant.value.indexOf(queryString) > -1;
  };
};
</script>

<template>
  <el-autocomplete
    v-model="inputValue"
    inputRef
    default="inputProp.input"
    :fetch-suggestions="querySearch"
    :trigger-on-focus="false"
    clearable
    class="inline-input w-50"
    :placeholder="
      inputProp.placeHolder != '' ? inputProp.placeHolder : '请输入'
    "
    @select="handleSelect"
  />
</template>
