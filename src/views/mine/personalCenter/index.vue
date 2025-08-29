<script setup lang="ts">
import { ref } from "vue";
import userLine from "@iconify-icons/ri/user-line";
import colseLine from "@iconify-icons/ri/close-line";
import keyLine from "@iconify-icons/ri/key-line";
import idCardFill from "@iconify-icons/ep/postcard"; // 工号
import department from "@iconify-icons/ep/office-building"; // 部门
import calendar from "@iconify-icons/ri/calendar-line";
import phone from "@iconify-icons/ri/phone-line"; // 手机
import email from "@iconify-icons/ri/mail-line"; // 邮箱
import gender from "@/assets/svg/venus-mars.svg?component";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

defineOptions({
  name: "PersonalCenter"
});
interface Honor {
  id: number;
  title: string;
  date: string;
  description: string;
  icon: string;
  color: string;
}

interface Training {
  id: number;
  title: string;
  date: string;
  duration: string;
  type: string;
  status: string;
}

interface Project {
  id: number;
  name: string;
  role: string;
  period: string;
  description: string;
  technologies: string[];
}

const userInfo = ref({
  nickname: "张三",
  employeeId: "EMP20240001",
  account: "zhangsan123",
  department: "研发部",
  position: "高级开发工程师",
  entryDate: "2022-01-15",
  gender: "男",
  phone: "13800138000",
  email: "zhangsan@example.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan"
});

const trainings = ref<Training[]>([
  {
    id: 1,
    title: "前端架构设计",
    date: "2024-01",
    duration: "24小时",
    type: "技术培训",
    status: "已完成"
  },
  {
    id: 2,
    title: "项目管理认证",
    date: "2023-12",
    duration: "40小时",
    type: "管理培训",
    status: "进行中"
  },
  {
    id: 3,
    title: "敏捷开发实践",
    date: "2023-11",
    duration: "16小时",
    type: "技术培训",
    status: "已完成"
  }
]);

const projects = ref<Project[]>([
  {
    id: 1,
    name: "企业资源管理系统升级",
    role: "技术负责人",
    period: "2023.10 - 2024.01",
    description: "负责系统架构设计和核心模块开发，提升系统性能30%",
    technologies: ["Vue3", "TypeScript", "Node.js"]
  },
  {
    id: 2,
    name: "供应链协同平台",
    role: "高级开发工程师",
    period: "2023.05 - 2023.09",
    description: "开发库存管理和订单处理模块，实现流程自动化",
    technologies: ["React", "Python", "PostgreSQL"]
  }
]);

const honors = ref<Honor[]>([
  {
    id: 1,
    title: "优秀员工",
    date: "2023-12",
    description: "年度优秀员工称号",
    icon: "trophy",
    color: "#FFD700"
  },
  {
    id: 2,
    title: "技术创新奖",
    date: "2024-01",
    description: "在项目中展现出色的创新能力",
    icon: "medal",
    color: "#87CEEB"
  }
]);

const skills = ref([
  { name: "Vue.js", level: 90 },
  { name: "TypeScript", level: 85 },
  { name: "Node.js", level: 80 },
  { name: "DevOps", level: 75 }
]);

// 弹窗状态
const showAvatarModal = ref(false);
const showPasswordModal = ref(false);
const showProfileModal = ref(false);

// 修改密码表单
const passwordForm = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
});

// 处理头像上传
const handleAvatarUpload = () => {
  // 这里实现头像上传逻辑
  showAvatarModal.value = false;
};

// 处理密码修改
const handlePasswordChange = () => {
  // 这里实现密码修改逻辑
  showPasswordModal.value = false;
};

// 处理个人信息修改
const handleProfileUpdate = () => {
  // 这里实现个人信息更新逻辑
  showProfileModal.value = false;
};
</script>

<template>
  <div class="personal-center">
    <div class="layout-container">
      <!-- 左侧个人信息 -->
      <div class="left-panel">
        <div class="info-card">
          <div class="avatar-section">
            <div class="avatar-container">
              <img :src="userInfo.avatar" alt="用户头像" class="avatar" />
              <button class="avatar-edit-btn" @click="showAvatarModal = true">
                <font-awesome-icon icon="camera" />
              </button>
            </div>
            <h2>{{ userInfo.nickname }}</h2>
            <div class="position-tag">{{ userInfo.position }}</div>
            <div class="quick-actions">
              <button class="action-btn" @click="showPasswordModal = true">
                <!-- <font-awesome-icon icon="key" /> -->
                <IconifyIconOffline
                  :icon="keyLine"
                  class="large-icon"
                  style="color: green"
                />
                修改密码
              </button>
              <button class="action-btn" @click="showProfileModal = true">
                <!-- <font-awesome-icon icon="edit" /> -->
                <IconifyIconOffline
                  :icon="idCardFill"
                  class="large-icon"
                  style="color: #0044e9"
                />
                编辑资料
              </button>
            </div>
          </div>

          <div class="info-section">
            <div class="info-group">
              <h3>基本信息</h3>
              <div class="info-item">
                <!-- <font-awesome-icon icon="id-badge" class="info-icon" /> -->
                <IconifyIconOffline :icon="idCardFill" class="info-icon" />
                <span class="label">工号：</span>
                <span>{{ userInfo.employeeId }}</span>
              </div>
              <div class="info-item">
                <!-- <font-awesome-icon icon="user" class="info-icon" /> -->
                <IconifyIconOffline :icon="userLine" class="info-icon" />
                <span class="label">账号：</span>
                <span>{{ userInfo.account }}</span>
              </div>
              <div class="info-item">
                <!-- <font-awesome-icon icon="building" class="info-icon" /> -->
                <IconifyIconOffline :icon="department" class="info-icon" />
                <span class="label">部门：</span>
                <span>{{ userInfo.department }}</span>
              </div>
              <div class="info-item">
                <!-- <font-awesome-icon icon="calendar" class="info-icon" /> -->
                <IconifyIconOffline :icon="calendar" class="info-icon" />
                <span class="label">入职日期：</span>
                <span>{{ userInfo.entryDate }}</span>
              </div>
            </div>

            <div class="info-group">
              <h3>联系方式</h3>
              <div class="info-item">
                <!-- <font-awesome-icon icon="venus-mars" class="info-icon" /> -->
                <component :is="useRenderIcon(gender)" class="info-icon" />
                <span class="label">性别：</span>
                <span>{{ userInfo.gender }}</span>
              </div>
              <div class="info-item">
                <!-- <font-awesome-icon icon="phone" class="info-icon" /> -->
                <IconifyIconOffline :icon="phone" class="info-icon" />
                <span class="label">手机：</span>
                <span>{{ userInfo.phone }}</span>
              </div>
              <div class="info-item">
                <!-- <font-awesome-icon icon="envelope" class="info-icon" /> -->
                <IconifyIconOffline :icon="email" class="info-icon" />
                <span class="label">邮箱：</span>
                <span>{{ userInfo.email }}</span>
              </div>
            </div>

            <div class="info-group">
              <h3>技能评估</h3>
              <div class="skill-bars">
                <div
                  v-for="skill in skills"
                  :key="skill.name"
                  class="skill-item"
                >
                  <div class="skill-info">
                    <span class="skill-name">{{ skill.name }}</span>
                    <span class="skill-percentage">{{ skill.level }}%</span>
                  </div>
                  <div class="skill-bar">
                    <div
                      class="skill-progress"
                      :style="{ width: skill.level + '%' }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧内容 -->
      <div class="right-panel">
        <div class="training-card">
          <h2>培训记录</h2>
          <div class="training-list">
            <div
              v-for="training in trainings"
              :key="training.id"
              class="training-item"
            >
              <div class="training-header">
                <h3>{{ training.title }}</h3>
                <span
                  class="training-status"
                  :class="
                    training.status === '已完成' ? 'completed' : 'in-progress'
                  "
                >
                  {{ training.status }}
                </span>
              </div>
              <div class="training-info">
                <span class="training-type">{{ training.type }}</span>
                <span class="training-duration">{{ training.duration }}</span>
                <span class="training-date">{{ training.date }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="project-card">
          <h2>项目经历</h2>
          <div class="project-list">
            <div
              v-for="project in projects"
              :key="project.id"
              class="project-item"
            >
              <div class="project-header">
                <h3>{{ project.name }}</h3>
                <span class="project-role">{{ project.role }}</span>
              </div>
              <div class="project-period">{{ project.period }}</div>
              <p class="project-description">{{ project.description }}</p>
              <div class="project-tech">
                <span
                  v-for="tech in project.technologies"
                  :key="tech"
                  class="tech-tag"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="honor-wall">
          <h2>荣誉墙</h2>
          <div class="honor-list">
            <div
              v-for="honor in honors"
              :key="honor.id"
              class="honor-item"
              :style="{ backgroundColor: `${honor.color}10` }"
            >
              <div class="honor-icon" :style="{ backgroundColor: honor.color }">
                <font-awesome-icon :icon="honor.icon" />
              </div>
              <div class="honor-content">
                <h3>{{ honor.title }}</h3>
                <p class="date">{{ honor.date }}</p>
                <p class="description">{{ honor.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改头像弹窗 -->
    <div v-if="showAvatarModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>修改头像</h3>
          <button class="close-btn" @click="showAvatarModal = false">
            <font-awesome-icon icon="times" />
          </button>
        </div>
        <div class="modal-body">
          <div class="upload-area">
            <font-awesome-icon icon="camera" class="upload-icon" />
            <p>点击或拖拽图片上传</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showAvatarModal = false">
            取消
          </button>
          <button class="btn btn-primary" @click="handleAvatarUpload">
            确定
          </button>
        </div>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <div v-if="showPasswordModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>修改密码</h3>
          <button class="close-btn" @click="showPasswordModal = false">
            <!-- <font-awesome-icon icon="times" /> -->
            <IconifyIconOffline :icon="colseLine" />
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>原密码</label>
            <el-input type="password" v-model="passwordForm.oldPassword" />
          </div>
          <div class="form-group">
            <label>新密码</label>
            <el-input type="password" v-model="passwordForm.newPassword" />
          </div>
          <div class="form-group">
            <label>确认新密码</label>
            <el-input type="password" v-model="passwordForm.confirmPassword" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showPasswordModal = false">
            取消
          </button>
          <button class="btn btn-primary" @click="handlePasswordChange">
            确定
          </button>
        </div>
      </div>
    </div>

    <!-- 编辑资料弹窗 -->
    <div v-if="showProfileModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>编辑个人资料</h3>
          <el-button class="close-btn" @click="showProfileModal = false">
            <!-- <font-awesome-icon icon="times" /> -->
            <IconifyIconOffline :icon="colseLine" />
          </el-button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>昵称</label>
            <input type="text" v-model="userInfo.nickname" />
          </div>
          <div class="form-group">
            <label>手机号码</label>
            <input type="tel" v-model="userInfo.phone" />
          </div>
          <div class="form-group">
            <label>邮箱</label>
            <input type="email" v-model="userInfo.email" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showProfileModal = false">
            取消
          </button>
          <button class="btn btn-primary" @click="handleProfileUpdate">
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (width <= 768px) {
  .layout-container {
    grid-template-columns: 1fr;
  }
}

.personal-center {
  max-width: 1200px;
  padding: 20px;
  margin: 0 auto;
}

.layout-container {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 20px;
}

.left-panel,
.right-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card,
.training-card,
.project-card,
.honor-wall {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 10%);
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 20px;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
}

.avatar-container {
  position: relative;
  margin-bottom: 15px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 60px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
}

.avatar-edit-btn {
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: white;
  cursor: pointer;
  background: #1890ff;
  border: none;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}

.quick-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.action-btn {
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 6px 12px;
  color: #1890ff;
  cursor: pointer;
  background: white;
  border: 1px solid #1890ff;
  border-radius: 4px;
  transition: all 0.3s;
}

.action-btn:hover {
  color: white;
  background: #1890ff;
}

.position-tag {
  padding: 4px 12px;
  margin-top: 8px;
  font-size: 0.9em;
  color: #1890ff;
  background: #e6f7ff;
  border-radius: 12px;
}

.info-group {
  margin-bottom: 24px;
}

.info-group h3 {
  padding-bottom: 8px;
  margin-bottom: 12px;
  font-size: 1.1em;
  color: #2c3e50;
  border-bottom: 1px solid #eee;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 0.95em;
}

.info-icon {
  width: 16px;
  margin-right: 10px;
  color: #666;
}

.label {
  width: 80px;
  color: #666;
}

.skill-bars {
  padding: 10px 0;
}

.skill-item {
  margin-bottom: 15px;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.9em;
}

.skill-bar {
  height: 6px;
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 3px;
}

.skill-progress {
  height: 100%;
  background: #1890ff;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.training-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.training-item {
  padding: 15px;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 8px;
}

.training-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.training-header h3 {
  margin: 0;
  font-size: 1.1em;
  color: #2c3e50;
}

.training-status {
  padding: 4px 8px;
  font-size: 0.9em;
  border-radius: 4px;
}

.training-status.completed {
  color: #52c41a;
  background: #f6ffed;
}

.training-status.in-progress {
  color: #1890ff;
  background: #e6f7ff;
}

.training-info {
  display: flex;
  gap: 15px;
  font-size: 0.9em;
  color: #666;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.project-item {
  padding: 20px;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 8px;
}

.project-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.project-header h3 {
  margin: 0;
  font-size: 1.1em;
  color: #2c3e50;
}

.project-role {
  font-size: 0.9em;
  color: #1890ff;
}

.project-period {
  margin-bottom: 10px;
  font-size: 0.9em;
  color: #666;
}

.project-description {
  margin-bottom: 15px;
  line-height: 1.5;
  color: #444;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  padding: 4px 8px;
  font-size: 0.85em;
  color: #666;
  background: #f0f2f5;
  border-radius: 4px;
}

.honor-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.honor-item {
  display: flex;
  align-items: flex-start;
  padding: 15px;
  border-radius: 8px;
  transition: transform 0.2s;
}

.honor-item:hover {
  transform: translateX(5px);
}

.large-icon {
  width: 18px; /* 图标宽度 */
  height: 18px; /* 图标高度 */
}

.honor-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-right: 15px;
  border-radius: 20px;
}

.honor-icon svg {
  width: 20px;
  height: 20px;
  color: white;
}

.honor-content {
  flex: 1;
}

.honor-content h3 {
  margin: 0 0 5px;
  font-size: 1.1em;
  color: #2c3e50;
}

.honor-content .date {
  margin-bottom: 5px;
  font-size: 0.9em;
  color: #666;
}

.honor-content .description {
  margin: 0;
  font-size: 0.95em;
  line-height: 1.4;
  color: #444;
}

/* Modal Styles */
.modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 50%);
}

.modal-content {
  width: 400px;
  max-width: 90%;
  background: white;
  border-radius: 8px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  font-size: 1.2em;
  color: #666;
  cursor: pointer;
  background: none;
  border: none;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 15px 20px;
  border-top: 1px solid #eee;
}

.upload-area {
  padding: 30px;
  text-align: center;
  cursor: pointer;
  border: 2px dashed #ddd;
  border-radius: 8px;
}

.upload-icon {
  margin-bottom: 10px;
  font-size: 2em;
  color: #1890ff;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}

.form-group input {
  box-sizing: border-box;
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn {
  padding: 8px 16px;
  font-size: 0.9em;
  cursor: pointer;
  border-radius: 4px;
}

.btn-primary {
  color: white;
  background: #1890ff;
  border: none;
}

.btn-secondary {
  color: #666;
  background: white;
  border: 1px solid #ddd;
}
</style>
