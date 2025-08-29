<script setup lang="ts">
import { HandleResponseErr, HandleResponseCode } from "../../../../api/utils";
import { ref, onMounted } from "vue";
import ReTreeLine from "@/components/ReTreeLine";
import { ElTree } from "element-plus";
import { debounce } from "@pureadmin/utils"; //节流
import { GetAPiTree } from "@/api/appApi";
import { GetCasbinPolicyList, UpdateCasbinApi, casbinInfo } from "@/api/casbin";
defineOptions({
  name: "Apis"
});

// 接收父组件信息
const props = defineProps({
  row: {
    type: Object
  }
});

// 菜单树
const dataProps = {
  children: "children", //数据中的子集字段名
  label: "name" //数据中展示的名字
};
const treeLoaded = ref(false);
const dataTree = ref([]);
const selectCehckedKeys = ref([]);
const treeRef = ref<InstanceType<typeof ElTree>>();
const needConfirm = ref(false);

// 为api树构建uniqueId
function bulidTreeUnqiueIds(treeData: any) {
  const newTree = [];
  treeData.forEach(app => {
    app.children.forEach(api => {
      api.unqiueId = "p:" + api.path + "m:" + api.method;
    });
    newTree.push(app);
  });
  return newTree;
}
// 为默认选择项构建unqiueId列表
function bulidUniqueIdList(list: any[]) {
  if (list.length === 0) {
    return;
  }
  const unqiueIdList = [];
  list.forEach(api => {
    const uniqueId = "p:" + api.path + "m:" + api.method;
    unqiueIdList.push(uniqueId);
  });
  return unqiueIdList;
}
async function initAppApiTree() {
  //获取菜单树基本结构
  const baseTreeResponse = await GetAPiTree();
  if (!HandleResponseErr(baseTreeResponse)) {
    return;
  }
  dataTree.value = bulidTreeUnqiueIds(baseTreeResponse.list);
  //获取角色已经选择的选项
  const policyResponse = await GetCasbinPolicyList({
    authorityId: props.row.id
  });
  if (!HandleResponseErr(policyResponse)) {
    return;
  }
  console.log("policyResponse.list", policyResponse.list);
  if (policyResponse.list.length > 0) {
    const defaultChecked = bulidUniqueIdList(policyResponse.list);
    console.log("defaultChecked", defaultChecked);
    treeRef.value!.setCheckedKeys(defaultChecked, false);
  }
  treeLoaded.value = true;
}
onMounted(() => {
  initAppApiTree();
});
const nodeChange = () => {
  needConfirm.value = true;
  selectCehckedKeys.value = treeRef.value.getCheckedNodes(false, true);
};

const confirm = async () => {
  if (needConfirm.value === true) {
    //组装选择的api接口里列表
    const casbinAPiInfos = [] as casbinInfo[];
    selectCehckedKeys.value.forEach(item => {
      if (item.path != undefined) {
        casbinAPiInfos.push({
          path: item.path,
          method: String(item.method)
        });
      }
    });
    console.log("casbinAPiInfos", casbinAPiInfos);
    const response = await UpdateCasbinApi({
      authorityId: props.row.id,
      casbinInfos: casbinAPiInfos
    });
    if (HandleResponseCode(response)) {
      needConfirm.value = false;
    }
  }
};
const onConfirm = debounce(confirm, 1000, true);
</script>

<template>
  <div>
    <div style="display: flex; justify-content: space-between">
      <div />
      <div>
        <el-button
          type="primary"
          style="width: 80px; margin-right: 2rem"
          :disabled="!needConfirm"
          @click="onConfirm()"
        >
          应用
        </el-button>
      </div>
    </div>
    <el-tree
      ref="treeRef"
      :data="dataTree"
      :show-checkbox="treeLoaded"
      node-key="unqiueId"
      default-expand-all
      @check="nodeChange"
      :props="dataProps"
    >
      <template v-slot:default="{ node }">
        <ReTreeLine :node="node" :showLabelLine="true">
          <template v-slot:node-label>
            <span class="text-sm">
              {{
                node.data.summary === "" ? node.data.path : node.data.summary
              }}
            </span>
          </template>
        </ReTreeLine>
      </template>
    </el-tree>
  </div>
</template>

<style scoped>
.flex-beteween {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.top {
  position: fixed;
}

.clearflex {
  *zoom: 1;
}

.clearflex:after {
  content: "";
  display: block;
  height: 0;
  visibility: hidden;
  clear: both;
}

.flex-end {
  display: flex;
  justify-content: space-between;
}

.fl-right {
  margin-right: 2rem;
  margin-bottom: 5px;
}
</style>
