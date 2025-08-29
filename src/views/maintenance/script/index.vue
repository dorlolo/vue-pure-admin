<template>
  <div>
    <!-- 筛选条件 -->
    <el-form :inline="true" :model="filterForm" class="demo-form-inline">
      <el-form-item label="项目">
        <el-input v-model="filterForm.project" placeholder="请输入项目名称" />
      </el-form-item>
      <el-form-item label="脚本名">
        <el-input v-model="filterForm.scriptName" placeholder="请输入脚本名" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="filterScripts">筛选</el-button>
      </el-form-item>
    </el-form>

    <!-- 创建按钮放到列表右上角 -->
    <div style="display: flex; justify-content: flex-end; margin-bottom: 10px">
      <el-button type="primary" @click="createScript">创建脚本</el-button>
    </div>

    <!-- 列表页 -->
    <el-table :data="pagedScripts" stripe>
      <el-table-column prop="project" label="项目" />
      <el-table-column prop="scriptName" label="脚本名" />
      <el-table-column prop="version" label="版本号" />
      <el-table-column prop="author" label="作者" />
      <el-table-column prop="lastExecutionTime" label="上一次执行时间" />
      <el-table-column prop="lastExecutor" label="上一次执行人" />
      <el-table-column prop="lastExecutionResult" label="上一次执行结果" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="executeScript(scope.row)"
            >执行</el-button
          >
          <el-button type="danger" size="small" @click="deleteScript(scope.row)"
            >删除</el-button
          >
          <el-button type="warning" size="small" @click="editScript(scope.row)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      style="justify-content: flex-end; margin-top: 20px"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="filteredScripts.length"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :current-page="currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 创建/编辑表单 -->
    <el-dialog v-model="dialogVisible" title="创建/编辑脚本">
      <el-form :model="formData" ref="formRef">
        <el-form-item label="项目" prop="project">
          <el-input v-model="formData.project" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="脚本名" prop="scriptName">
          <el-input v-model="formData.scriptName" placeholder="请输入脚本名" />
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model="formData.version" placeholder="请输入版本号" />
        </el-form-item>
        <el-form-item label="使用权限" prop="permission">
          <el-select v-model="formData.permission" placeholder="请选择使用权限">
            <el-option label="公开" value="public" />
            <el-option label="私有" value="private" />
          </el-select>
        </el-form-item>
        <el-form-item label="自定义参数" prop="scriptParams">
          <div>
            <el-button type="primary" @click="addScriptParam"
              >添加参数</el-button
            >
            <div
              v-for="(param, index) in formData.scriptParams"
              :key="param.key + '-' + index"
              class="params-item"
            >
              <el-input v-model="param.key" placeholder="键名" />
              <el-input v-model="param.value" placeholder="默认值" />
              <el-input v-model="param.placeholder" placeholder="提示" />
              <el-button type="danger" @click="removeScriptParam(index)"
                >删除</el-button
              >
            </div>
          </div>
        </el-form-item>
        <el-form-item label="脚本内容">
          <el-radio-group v-model="formData.scriptStorageType">
            <el-radio label="上传">上传</el-radio>
            <el-radio label="引用函数">引用</el-radio>
            <el-radio label="在线编辑">在线编辑</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formData.scriptStorageType === '上传'">
          <el-upload
            action="#"
            :on-change="handleFileChange"
            :before-upload="beforeUpload"
            :show-file-list="false"
          >
            <el-button type="primary">选择文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="formData.scriptStorageType === '引用函数'">
          <el-input
            v-model="formData.scriptContent"
            placeholder="请输入函数名"
          />
        </el-form-item>
        <el-form-item v-if="formData.scriptStorageType === '在线编辑'">
          <el-input
            type="textarea"
            v-model="formData.scriptContent"
            placeholder="请输入脚本内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveScript">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="excuteDialogVisible" :title="currentScript?.scriptName">
      <el-form :model="currentScript" v-if="currentScript">
        <el-form-item
          v-for="(param, index) in currentScript.scriptParams || []"
          :key="index"
          :label="param.key"
        >
          <el-input
            v-model="param.value"
            :placeholder="param.placeholder"
          />
        </el-form-item>
        <div v-if="!currentScript.scriptParams || currentScript.scriptParams.length === 0">
          <p>该脚本无需参数</p>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="excuteDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmParams">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
defineOptions({
  name: "ArtistinfoScript"
});
// 模拟数据
const scripts = reactive([
  {
    id: 1,
    project: "画家宝",
    scriptName: "设置短信验证码",
    version: "1.0",
    author: "徐俊杰",
    lastExecutionTime: "2025-03-14 10:00:00",
    lastExecutor: "徐俊杰",
    lastExecutionResult: "成功",
    permission: "public",
    scriptStorageType: "在线编辑",
    scriptContent: 'console.log("Hello, World!");',
    scriptParams: []
  },
  {
    id: 2,
    project: "画展",
    scriptName: "上传画家数据",
    version: "2.0",
    author: "耿阳",
    lastExecutionTime: "2025-03-13 15:30:00",
    lastExecutor: "耿阳",
    lastExecutionResult: "成功",
    permission: "private",
    scriptStorageType: "上传",
    scriptReference: "",
    scriptContent: "",
    scriptParams: []
  },
  {
    id: 3,
    project: "erp",
    scriptName: "发送App通知",
    version: "1.1",
    author: "陆嘉骅",
    lastExecutionTime: "2025-03-12 09:45:00",
    lastExecutor: "陆嘉骅",
    lastExecutionResult: "成功",
    permission: "public",
    scriptStorageType: "引用",
    scriptReference: "https://example.com/script3.js",
    scriptContent: "",
    scriptParams: []
  },
  {
    id: 4,
    project: "审批管理",
    scriptName: "更换手机号",
    version: "3.0",
    author: "宋闯",
    lastExecutionTime: "2025-03-11 14:20:00",
    lastExecutor: "宋闯",
    lastExecutionResult: "成功",
    permission: "private",
    scriptStorageType: "在线编辑",
    scriptContent: 'function greet() { console.log("Hello!"); } greet();',
    scriptParams: []
  },
  {
    id: 5,
    project: "画家宝",
    scriptName: "完整删除账号",
    version: "1.2",
    author: "王溢滔",
    lastExecutionTime: "2025-03-10 11:15:00",
    lastExecutor: "王溢滔",
    lastExecutionResult: "成功",
    permission: "private",
    scriptStorageType: "在线编辑",
    scriptContent: 'console.log("Delete account successfully!");',
    scriptParams: []
  },
  {
    id: 6,
    project: "画展",
    scriptName: "同步登录授权委托书",
    version: "2.1",
    author: "刘小巧",
    lastExecutionTime: "2025-03-09 14:40:00",
    lastExecutor: "刘小巧",
    lastExecutionResult: "成功",
    permission: "public",
    scriptStorageType: "引用",
    scriptReference: "https://example.com/script6.js",
    scriptContent: "",
    scriptParams: []
  },
  {
    id: 7,
    project: "erp",
    scriptName: "检测用户数据",
    version: "1.3",
    author: "徐俊杰",
    lastExecutionTime: "2025-03-08 10:30:00",
    lastExecutor: "徐俊杰",
    lastExecutionResult: "成功",
    permission: "private",
    scriptStorageType: "上传",
    scriptReference: "",
    scriptContent: "",
    scriptParams: []
  },
  {
    id: 8,
    project: "画家宝",
    scriptName: "验证用户身份",
    version: "1.4",
    author: "耿阳",
    lastExecutionTime: "2025-03-07 13:25:00",
    lastExecutor: "耿阳",
    lastExecutionResult: "成功",
    permission: "public",
    scriptStorageType: "在线编辑",
    scriptContent: 'console.log("User identity verified!");',
    scriptParams: []
  },
  {
    id: 9,
    project: "画展",
    scriptName: "更新画展信息",
    version: "2.2",
    author: "陆嘉骅",
    lastExecutionTime: "2025-03-06 16:10:00",
    lastExecutor: "陆嘉骅",
    lastExecutionResult: "成功",
    permission: "private",
    scriptStorageType: "上传",
    scriptReference: "",
    scriptContent: "",
    scriptParams: []
  },
  {
    id: 10,
    project: "erp",
    scriptName: "统计销售数据",
    version: "1.5",
    author: "宋闯",
    lastExecutionTime: "2025-03-05 09:55:00",
    lastExecutor: "宋闯",
    lastExecutionResult: "成功",
    permission: "public",
    scriptStorageType: "引用",
    scriptReference: "https://example.com/script10.js",
    scriptContent: "",
    scriptParams: []
  },
  {
    id: 11,
    project: "审批管理",
    scriptName: "批量审批申请",
    version: "3.1",
    author: "王溢滔",
    lastExecutionTime: "2025-03-04 15:40:00",
    lastExecutor: "王溢滔",
    lastExecutionResult: "成功",
    permission: "private",
    scriptStorageType: "在线编辑",
    scriptContent:
      'function batchApprove() { console.log("Batch approval processing..."); } batchApprove();',
    scriptParams: []
  },
  {
    id: 12,
    project: "画家宝",
    scriptName: "清理缓存数据",
    version: "1.6",
    author: "刘小巧",
    lastExecutionTime: "2025-03-03 11:30:00",
    lastExecutor: "刘小巧",
    lastExecutionResult: "成功",
    permission: "public",
    scriptStorageType: "在线编辑",
    scriptContent: 'console.log("Cache data cleared!");',
    scriptParams: []
  },
  {
    id: 13,
    project: "画展",
    scriptName: "生成画展海报",
    version: "2.3",
    author: "徐俊杰",
    lastExecutionTime: "2025-03-02 14:05:00",
    lastExecutor: "徐俊杰",
    lastExecutionResult: "成功",
    permission: "private",
    scriptStorageType: "上传",
    scriptReference: "",
    scriptContent: "",
    scriptParams: []
  },
  {
    id: 14,
    project: "erp",
    scriptName: "优化库存管理",
    version: "1.7",
    author: "耿阳",
    lastExecutionTime: "2025-03-01 10:20:00",
    lastExecutor: "耿阳",
    lastExecutionResult: "成功",
    permission: "public",
    scriptStorageType: "引用",
    scriptReference: "https://example.com/script14.js",
    scriptContent: "",
    scriptParams: []
  }
]);

// 筛选表单数据
const filterForm = reactive({
  project: "",
  scriptName: ""
});

// 过滤后的脚本列表
const filteredScripts = ref([]);

// 对话框显示状态
const dialogVisible = ref(false);

//执行按钮参数对话框显示状态
const excuteDialogVisible = ref(false);
//当前执行的脚本
const currentScript = ref(null);
// 表单数据
const formData = reactive({
  id: null,
  project: "",
  scriptName: "",
  version: "",
  author: "",
  permission: "public",
  scriptStorageType: "在线编辑",
  scriptReference: "",
  scriptContent: "",
  scriptParams: []
});

// 表单引用
const formRef = ref(null);

// 筛选脚本
const filterScripts = () => {
  filteredScripts.value = scripts.filter(script => {
    return (
      script.project.includes(filterForm.project) &&
      script.scriptName.includes(filterForm.scriptName)
    );
  });
};

// 执行脚本
const executeScript = script => {
  excuteDialogVisible.value = true;
  currentScript.value = script;
  console.log("excuteDialogVisible:", excuteDialogVisible.value);
  console.log("执行脚本:", script);
};

// 删除脚本
const deleteScript = script => {
  const index = scripts.findIndex(item => item.id === script.id);
  if (index !== -1) {
    scripts.splice(index, 1);
    filterScripts();
  }
};

// 编辑脚本
const editScript = script => {
  dialogVisible.value = true;
  formData.id = script.id;
  formData.project = script.project;
  formData.scriptName = script.scriptName;
  formData.version = script.version;
  formData.author = script.author;
  formData.permission = script.permission;
  formData.scriptStorageType = script.scriptStorageType;
  formData.scriptReference = script.scriptReference;
  formData.scriptContent = script.scriptContent;
  formData.scriptParams = script.scriptParams ? [...script.scriptParams] : [];
};

// 创建脚本
const createScript = () => {
  dialogVisible.value = true;
  formData.id = null;
  formData.project = "";
  formData.scriptName = "";
  formData.version = "";
  formData.author = "";
  formData.permission = "public";
  formData.scriptStorageType = "在线编辑";
  formData.scriptReference = "";
  formData.scriptContent = "";
  formData.scriptParams = [];
};

// 保存脚本
const saveScript = () => {
  if (formData.id) {
    // 编辑
    const index = scripts.findIndex(item => item.id === formData.id);
    if (index !== -1) {
      scripts[index] = { 
        ...formData,
        scriptParams: formData.scriptParams ? [...formData.scriptParams] : []
      };
    }
  } else {
    // 创建
    formData.id = Date.now();
    scripts.push({ 
      ...formData,
      scriptParams: formData.scriptParams ? [...formData.scriptParams] : []
    });
  }
  dialogVisible.value = false;
  filterScripts();
};

// 添加脚本参数
const addScriptParam = () => {
  formData.scriptParams.push({ key: "", value: "", placeholder: "" });
};

// 删除脚本参数
const removeScriptParam = index => {
  formData.scriptParams.splice(index, 1);
};

// 处理文件上传
const handleFileChange = file => {
  console.log("文件上传:", file);
};

// 上传前钩子
const beforeUpload = file => {
  console.log("上传前:", file);
  return true;
};

// 初始化筛选
filterScripts();

// 分页相关数据
const currentPage = ref(1);
const pageSize = ref(10);

// 分页后的数据
const pagedScripts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredScripts.value.slice(start, end);
});

// 处理每页条数变化
const handleSizeChange = val => {
  pageSize.value = val;
  currentPage.value = 1;
};

// 处理当前页变化
const handleCurrentChange = val => {
  currentPage.value = val;
};

// 确认执行参数
const confirmParams = () => {
  console.log("执行脚本参数:", currentScript.value);
  // 这里可以添加实际的脚本执行逻辑
  excuteDialogVisible.value = false;
};
</script>

<style lang="scss" scoped>
.params-item {
  display: flex;
  margin: 3px 10px;
}
</style>
