import { ref, onMounted } from "vue"; //onMounted
import { getApiList, getApiDetail, ApiType } from "@/api/appApi";
import { HandleResponseErr, defineUrlApi } from "@/api/utils";
import { message } from "@/utils/message";
import { http } from "@/utils/http";
import { DocReload } from "@/api/swagger"; //GetApiParams
import { HandleResponseCode } from "@/api/utils";

export function useApiDebug() {
  const loading = ref(false);
  const searchWords = ref("");
  const apiList = ref([]);
  const tagList = ref([]); //所有存在的标签列表
  const dataLoading = ref(true);
  const pageSize = ref(0);
  const host = ref("http://localhost:8088");
  // 使用关键字查询api
  const handlerSearch = async () => {
    console.log("查询api ,searchWords:", searchWords.value);
    // getApiList();
    // tagList.value = [];
    try {
      const result = await getApiList({
        keywords: searchWords.value,
        page: 1,
        pageSize: -1
      });
      console.log("getApiList_result:", result);
      if (result.code != 0) {
        message(result.notice, { type: "error" });
        return;
      }
      apiList.value = result.list ? result.list : [];
      console.log("查询结果:", apiList.value);
      // pagination.value = {
      //   ...pagination.value,
      //   total: result.pageInfo.total
      // };

      //初始化标签选择器
      // const isFirstItem = true; //首个标签默认展示api
      // if (tagList.value.length === 0) {
      // }
      tagList.value = [];
      apiList.value.forEach(api => {
        if (api.tags != null || api.tags != undefined) {
          api.tags.forEach(tag => {
            let isEx = false;
            for (let i = 0; i < tagList.value.length; i++) {
              if (tagList.value[i].name === tag.name) {
                isEx = true;
                break;
              }
            }
            if (isEx === false) {
              tag.open = true;
              tag.checked = true;
              tagList.value.push(tag);
            }
          });
        }
      });
      //第一个标签总是默认打开
      // tagList.value[0].checked = true;
      //判断是否需要添加其它标签
      if (tagList.value.length > 0) {
        tagList.value[0].open = true;
      }
      let hasOtherTag = false;
      for (let i = 0; i < apiList.value.length; i++) {
        if (
          apiList.value[i].tags === undefined ||
          apiList.value[i].tags === null ||
          apiList.value[i].tags.length === 0
        ) {
          hasOtherTag = true;
        }
      }
      if (hasOtherTag) {
        tagList.value.push({
          name: "其它",
          id: 0,
          color: "",
          bg: "",
          checked: true,
          open: true
        });
      }
    } catch (e) {
      message("查询失败:" + e, { type: "error" });
    } finally {
      console.log("tags:", tagList.value);
      setTimeout(() => {
        dataLoading.value = false;
      }, 500);
    }
  };
  const mockRequest = async (host: string, api) => {
    console.log("模拟接口请求");
    if (!host.endsWith("/")) {
      host += "/api/";
    } else {
      host += "api/";
    }
    const address = defineUrlApi(api.version, api.path); //host +
    console.log("请求地址", address);
    const result = await http.request<any>(api.method, address);
    console.log(result);
  };
  onMounted(async () => {
    console.log("页面初始化");
    pageSize.value = 10;
    await handlerSearch();
  });
  // const openBlockIds = ref([]);
  const openBlockMap = ref(new Map<number, ApiType>());
  const openBlockChange = async id => {
    console.log("openBlockChange", id);
    // if (!openBlockIds.value.includes(id)) {
    //   openBlockIds.value.push(id);
    // } else {
    //   const ids = [];
    //   openBlockIds.value.forEach(v => {
    //     if (v !== id) {
    //       ids.push(v);
    //     }
    //   });
    //   openBlockIds.value = ids;
    // }
    if (!openBlockMap.value.has(id)) {
      const res = await getApiDetail({ id: id });
      if (HandleResponseErr(res)) {
        //获取api请求参数
        if (res.data.parameters != undefined && res.data.parameters != null) {
          openBlockMap.value.set(id, res.data);
          console.log("openBlockMap", openBlockMap);
        }
        // if (res.data.parameters != null && res.data.parameters.length > 0) {
        //   res.data.parameters.forEach(async param => {
        //     if param.paramRef != null && param.paramRef != "") {
        //       const parameters = await GetApiParams([param.paramRef]);
        //       param.properties = parameters.data.list;
        //     }
        //   }
        //   parameters = await GetApiParams([]);
        //   openBlockMap.value.set(id, res.data);
        // }
      }
      console.log("openBlockData:", openBlockMap.value.get(id)?.method);
    } else {
      const tempMap = new Map<number, ApiType>();
      openBlockMap.value.forEach((value, key) => {
        if (key !== id) {
          tempMap.set(key, value);
        }
      });
      openBlockMap.value = tempMap;
    }
  };
  const apiBlockShow = id => {
    // return openBlockIds.value.includes(id);
    return openBlockMap.value.has(id);
  };

  //所有的标签列表
  const TagOpenStatusChange = thisTag => {
    if (thisTag.open === true) {
      thisTag.open = false;
      console.log("标签开启状态从开启变为关闭", thisTag.open);
    } else {
      thisTag.open = true;
      console.log("标签开启状态从关闭变为开启", thisTag.open);
    }
  };
  const TagCheckedStatusChange = thisTag => {
    if (thisTag.checked === true) {
      thisTag.checked = false;
    } else {
      thisTag.checked = true;
    }
    // if (
    //   tagCheckedLIst.value === null ||
    //   tagCheckedLIst.value === undefined ||
    //   tagCheckedLIst.value.length === 0
    // ) {
    //   console.log("checkedTagStatusChange:111");
    //   tagCheckedLIst.value.push(thisTag);
    // } else {
    //   let find = false;
    //   for (let i = 0; i < tagCheckedLIst.value.length; i++) {
    //     // console.log("tagCheckedLIst item:", tagCheckedLIst.value[i]);
    //     if (tagCheckedLIst.value[i].name === thisTag.name) {
    //       find = true;
    //       delete tagCheckedLIst.value[i];
    //     }
    //     tagCheckedLIst.value = tagCheckedLIst.value.filter(
    //       val => val !== undefined
    //     );
    //   }
    //   if (!find) {
    //     tagCheckedLIst.value.push(thisTag);
    //   }
    // }
  };

  //标签是否存在
  const tagExist = (tags, findTtag: string) => {
    if (
      (tags === null || tags === undefined || tags.length === 0) &&
      findTtag === "其它"
    ) {
      return true;
    } else {
      for (let i = 0; i < tags.length; i++) {
        if (tags[i].name === findTtag) {
          return true;
        }
      }
    }
    // console.log(tags, "中没有找到", findTtag);
    return false;
  };
  const changeTagToDeepClass = $event => {
    $event.currentTarget.className = "tag-deep-class";
  };
  const changeTagToLightClass = $event => {
    $event.currentTarget.className = "tag-light-class";
  };

  async function docReload() {
    console.log("docReload");
    const res = await DocReload();
    HandleResponseCode(res);
  }
  return {
    handlerSearch,
    searchWords,
    loading,
    tagList,
    apiList,
    tagExist,
    host,
    mockRequest,
    apiBlockShow,
    openBlockChange,
    TagOpenStatusChange,
    TagCheckedStatusChange,
    changeTagToDeepClass,
    changeTagToLightClass,
    docReload,
    openBlockMap
  };
}
