<script setup lang="ts">
import { watch } from "vue";
import { useImageVerify } from "./hooks";

defineOptions({
  name: "ReImageVerify"
});

interface Props {
  img?: string;
  imgId?: string;
}

interface Emits {
  (e: "imgChange", img: string): void;
  (e: "captchaIdChange", imgId: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  img: "",
  ImgId: ""
});

const emit = defineEmits<Emits>();

const { domRef, bs64Img, captchaId, setBs64Img, setCaptchaId, getImgCode } =
  useImageVerify();

watch(
  () => props.img,
  newValue => {
    setBs64Img(newValue);
  }
);
watch(
  () => props.imgId,
  newValue => {
    setCaptchaId(newValue);
  }
);
watch(bs64Img, newValue => {
  emit("imgChange", newValue);
});
watch(captchaId, newValue => {
  emit("captchaIdChange", newValue);
});
defineExpose({ getImgCode });
</script>

<template>
  <canvas
    ref="domRef"
    width="120"
    height="40"
    class="cursor-pointer"
    @click="getImgCode"
  />
</template>
