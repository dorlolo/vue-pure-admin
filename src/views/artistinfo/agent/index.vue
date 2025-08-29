<script setup lang="ts">
import { ref } from "vue";

defineOptions({
  name: "Agent"
});

const demo = ref("Agent 111");
</script>

<template>
  <div>this demo is {{ demo }}</div>
</template>

<!-- <style lang=
 scoped></style> -->
