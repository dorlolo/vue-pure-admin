import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { useRouter, useRoute } from "vue-router";
import { onBeforeMount } from "vue";

export function useDetail() {
  const route = useRoute();
  const router = useRouter();
  const id = route.query?.id ? route.query?.id : route.params?.id;
  const _appname = route.query?.name ? route.query?.name : route.params?.name;
  console.log("appname", _appname);
  console.log("route.query", route.query);
  function toDetail(
    index: number | string | string[] | number[],
    appName: number | string | string[] | number[]
  ) {
    // 保存信息到标签页
    useMultiTagsStoreHook().handleTags("push", {
      path: `/app/appDetail`,
      name: "AppDetail",
      query: { id: String(index), name: appName },
      meta: {
        title: `详情信息 - [${appName}]`,
        // 最大打开标签数
        dynamicLevel: 1
      }
    });
    // 路由跳转
    router.push({
      name: "AppDetail",
      query: { id: String(index), name: appName }
    });
  }

  function initToDetail() {
    onBeforeMount(() => {
      if (id) toDetail(id, _appname);
    });
  }

  return { toDetail, initToDetail, id, _appname, router };
}
