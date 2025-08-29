<script setup lang="ts">
import { ref } from "vue";
defineOptions({
  name: "Artwork"
});
const demo = ref("Artwork");
</script>

<template>
  <div>this demo is {{ demo }}</div>
</template>

<!-- <style lang="scss" scoped></style> -->
