<script setup lang="ts">
import {
  getBaseMenuTree,
  getAuthorityMenus,
  setAuthorityMenu
} from "@/api/appMenu";
// import { AuthorityType } from "@/api/authority";
import { HandleResponseErr, HandleResponseCode } from "../../../../api/utils";
import { ref, onMounted } from "vue";
import ReTreeLine from "@/components/ReTreeLine";
import { ElTree } from "element-plus";
import { debounce } from "@pureadmin/utils"; //节流
import { filterParent } from "@/utils/tree";
defineOptions({
  name: "Menus"
});

// 接收父组件信息
const props = defineProps({
  row: {
    type: Object
  }
});
// 菜单树
const dataProps = {
  children: "children",
  label: "path"
};
const treeLoaded = ref(false);
const menuTree = ref([]);
const selectCehckedKeys = ref([]);
const treeRef = ref<InstanceType<typeof ElTree>>();
const needConfirm = ref(false);
//初始化权限菜单
async function initAuhtorityMenu() {
  console.log("初始化 authorityId:", props.row.authorityId);
  //取菜单树
  const baseMenuResponse = await getBaseMenuTree();
  if (!HandleResponseErr(baseMenuResponse)) {
    return;
  }
  //获取角色当前拥有的菜单
  menuTree.value = baseMenuResponse.list;
  console.log("菜单列表取值 menuTree", menuTree.value);
  const authorityMenuResponse = await getAuthorityMenus({
    authorityId: props.row.authorityId
  });
  if (!HandleResponseErr(authorityMenuResponse)) {
    return;
  }
  //设置默认选中项
  if (authorityMenuResponse.list.length > 0) {
    const defaultChecked = filterParent(authorityMenuResponse.list);
    console.log("defaultChecked", defaultChecked);
    treeRef.value!.setCheckedKeys(defaultChecked, false);
  }
  treeLoaded.value = true;
}
onMounted(() => {
  initAuhtorityMenu();
});
const nodeChange = () => {
  needConfirm.value = true;
  selectCehckedKeys.value = treeRef.value.getCheckedNodes(false, true);
  console.log("selected", selectCehckedKeys.value);
};
const confirm = async () => {
  if (needConfirm.value === true) {
    const response = await setAuthorityMenu({
      authorityId: props.row.id,
      menus: selectCehckedKeys.value
    });
    if (HandleResponseCode(response)) {
      needConfirm.value = false;
    }
  }
};
const onConfirm = debounce(confirm, 1000, true);
</script>

<template>
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
    :data="menuTree"
    :show-checkbox="treeLoaded"
    node-key="id"
    default-expand-all
    @check="nodeChange"
    :props="dataProps"
  >
    <template v-slot:default="{ node }">
      <ReTreeLine :node="node" :showLabelLine="true">
        <template v-slot:node-label>
          <span class="text-sm">
            {{ node.data.meta.title }}
          </span>
        </template>
      </ReTreeLine>
    </template>
  </el-tree>
</template>

<style scoped></style>
