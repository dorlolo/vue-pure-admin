<script setup lang="ts">
import { ref, defineProps, onMounted } from "vue";
import { ApiType, userParamType } from "@/api/appApi";
// 定义组件选项
defineOptions({
  name: "ApiBody"
});
const props = defineProps<{
  data: ApiType;
}>();
const demo = ref("ApiBody");

const processData = (data: ApiType) => {
  console.log("Processing data:", data);
  demo.value = `Processed: ${data}`;
};

onMounted(() => {
  if (props.data) {
    processData(props.data);
  }
});

function buildJsonParams(defineParams) {
  const json = {};
  defineParams.forEach(param => {
    // if (param.params && param.params.length > 0) {
    //   json[param.key] = buildJsonParams(param.params);
    // } else {
    //   json[param.key] = param.value;
    // }
    if (param.in != "body" && param.messageType === 1) {
      return;
    }
    const subData = buildJsonUserParams(param.params);
    if (param.name === "data") {
      Object.assign(json, subData); // 将 userJson 的内容合并到 json 中
    } else {
      json[param.name] = subData;
    }
  });
  return json;
}
function buildJsonUserParams(userParams: Array<userParamType>) {
  const json = {};
  userParams.forEach(param => {
    switch (param.fieldType) {
      case "Array":
        break;
      case "Object":
        break;
      default:
        console.log("param.fieldType:", param.fieldType);
    }
  });
  return json;
}
</script>

<template>
  <div>
    <div>{{ buildJsonParams(props.data.parameters) }}</div>
    <div v-for="(item, index) in props.data.parameters" :key="index">
      <div>{{ item }}</div>
    </div>
  </div>
</template>

<!-- <style lang="scss" scoped></style> -->
