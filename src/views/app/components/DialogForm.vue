<script setup lang="ts">
import { ref, watch, inject } from "vue";
import { message } from "@/utils/message";
import { FormInstance } from "element-plus";
import { updateApp } from "@/api/app";

const SELECT_OPTIONS = [
  { label: "系统模块", value: 1 },
  { label: "业务模块", value: 2 }
];

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => {
      return {};
    }
  }
});

const ruleFormRef = ref<FormInstance>();

const { getAppListData } = inject("getAppListData") as {
  getAppListData: () => void;
};

const formVisible = ref(false);
const formData = ref(props.data);

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async valid => {
    if (valid) {
      const result = await updateApp(formData.value);
      if (result.code === 0) {
        message("提交成功", { type: "success" });
        getAppListData();
      } else {
        message("提交失败", { type: "error" });
      }
      formVisible.value = false;
      resetForm(formEl);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const closeDialog = () => {
  formVisible.value = false;
  resetForm(ruleFormRef.value);
};

const emit = defineEmits(["update:visible"]);
watch(
  () => formVisible.value,
  val => {
    emit("update:visible", val);
  }
);

watch(
  () => props.visible,
  val => {
    formVisible.value = val;
  }
);

watch(
  () => props.data,
  val => {
    formData.value = val;
  }
);

const rules = {
  name: [{ required: true, message: "请输入模块名称", trigger: "blur" }]
};
</script>

<template>
  <el-dialog
    v-model="formVisible"
    title="编辑信息"
    :width="680"
    draggable
    :before-close="closeDialog"
  >
    <!-- 表单内容 -->
    <el-form
      ref="ruleFormRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="模块名称" prop="name">
        <el-input
          v-model="formData.name"
          :style="{ width: '480px' }"
          placeholder="请输入模块名称"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="模块描述" prop="description">
        <el-input
          v-model="formData.description"
          :style="{ width: '480px' }"
          placeholder="请输入模块描述"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="模块类型" prop="appType">
        <el-select
          v-model="formData.appType"
          clearable
          :style="{ width: '480px' }"
          :disabled="true"
        >
          <el-option
            v-for="(item, index) in SELECT_OPTIONS"
            :key="index"
            :value="item.value"
            :label="item.label"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联表" prop="table">
        <el-input
          v-model="formData.table"
          :style="{ width: '480px' }"
          placeholder="请输入关联表名称"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="依赖模块" style="font-weight: 700">
        <el-tag
          v-if="
            formData.depends === undefined ||
            formData.depends === null ||
            formData.depends.length === 0
          "
          class="el-tag is-closable el-tag--info el-tag--light mx-1"
          >无</el-tag
        >
        <el-tag
          v-for="(depApp, i) of formData.depends"
          :key="i"
          effect="light"
          size="default"
          >{{ depApp.name }}</el-tag
        >
      </el-form-item>
      <el-form-item label="模块状态" prop="usageState">
        <el-radio-group v-model="formData.usageState">
          <el-radio :label="1">已启用</el-radio>
          <el-radio :label="2">已停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序等级" prop="sort">
        <el-input-number
          v-model="formData.sort"
          :style="{ width: '120px' }"
          placeholder="请输入排序索引值"
        />
      </el-form-item>
      <!-- <el-form-item label="备注" prop="mark">
        <el-input
          v-model="textareaValue"
          type="textarea"
          :style="{ width: '480px' }"
          placeholder="请输入内容"
        />
      </el-form-item> -->
    </el-form>
    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>
