import { ref, onMounted } from "vue";
import { message } from "@/utils/message";
import { getVercode } from "@/api/vercode";
/**
 * 绘制图形验证码
 * @param width - 图形宽度
 * @param height - 图形高度
 */
export const useImageVerify = (width = 120, height = 40) => {
  const domRef = ref<HTMLCanvasElement>();
  const bs64Img = ref("");
  const captchaId = ref("");
  function setBs64Img(img: string) {
    bs64Img.value = img;
  }
  function setCaptchaId(id: string) {
    captchaId.value = id;
  }

  async function getImgCode() {
    // if (!domRef.value) return;
    // imgCode.value = draw(domRef.value, width, height);
    if (!domRef.value) return;
    //获取验证码
    const res = await getVercode("image");
    if (res.code === 0) {
      captchaId.value = res.data.captchaId;
      bs64Img.value = res.data.picPath;
      draw(domRef.value, res.data.picPath, width, height);
    } else {
      message(res.data.captchaId, { type: "error" });
    }
  }

  onMounted(() => {
    getImgCode();
  });

  return {
    domRef,
    bs64Img,
    captchaId,
    setBs64Img,
    setCaptchaId,
    getImgCode
  };
};

function draw(
  dom: HTMLCanvasElement,
  base64Img: string,
  width: number,
  height: number
) {
  // console.log("draw:base64Img", base64Img);
  const ctx = dom.getContext("2d");
  ctx.fillRect(0, 0, width, height);
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
  };
  img.src = base64Img;
}
