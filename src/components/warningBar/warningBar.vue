<script setup lang="ts">
import warningIcon from "~icons/ep/warning-filled";
const prop = defineProps({
  title: {
    type: String,
    default: ""
  }
});
</script>

<template>
  <div class="warning-bar">
    <IconifyIconOffline class="icon" :icon="warningIcon" />
    <span>
      {{ prop.title }}
    </span>
  </div>
</template>

<style scoped>
.warning-bar {
  display: flex;
  align-items: center;
  padding: 6px 14px;
  margin-bottom: 12px;
  font-size: 14px;
  background-color: #fff5ed;
  border-radius: 2px;
}

span {
  margin-left: 8px;
  line-height: 22px;
  color: #f67207;
}

.icon {
  font-size: 18px;
  color: #ed6a0c;
}
</style>
