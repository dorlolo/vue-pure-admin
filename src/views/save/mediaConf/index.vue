<script setup lang="ts">
import { onMounted } from "vue";
import MediaDefinitionTemplate from "./transcodeTemplate.vue";
import RegionBucket from "./regionBucket.vue";
defineOptions({
  name: "MediaConf"
});
onMounted(() => {});
</script>

<template>
  <div class="config-group">
    <RegionBucket class="child" />
    <MediaDefinitionTemplate class="child" />
  </div>
</template>
<css lang="scss" scoped>
.config-group {
  display: flex;
  flex-direction: column;
  background-color: antiquewhite;
}
.config-group .child {
  margin-bottom: 10px;
}
</css>
