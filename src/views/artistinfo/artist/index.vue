<script setup lang="ts">
import { ref } from "vue";
defineOptions({
  name: "Artist"
});
const demo = ref("Artist");
</script>

<template>
  <div>this demo is {{ demo }}</div>
</template>

<!-- <style lang="scss" scoped></style> -->
