<template>
  <div class="headerView">
    <div class="logo">1</div>
    <div class="avatar">
      <el-badge :value="12">
        <el-icon><Bell /></el-icon>
      </el-badge>
      <div class="avatar-info">
        <el-avatar
          :size="30"
          :src="'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
        />

        <div class="avatar-info-text">
          <span class="avatar-name">索朝阳</span>
          <el-tooltip effect="light" content="19033203829@163.com" placement="bottom">
            <span class="avatar-email">19033203829@163.com</span>
          </el-tooltip>
        </div>
      </div>
      <el-dropdown trigger="click">
        <el-icon class="el-icon--right"><arrow-down /></el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>登出</el-dropdown-item>
            <el-dropdown-item>关于</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ArrowDown, Bell } from '@element-plus/icons-vue'
</script>
<style scoped lang="scss">
.headerView {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
}
.avatar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.avatar-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 10px 0 30px;
}
.el-icon--right {
  cursor: pointer;
}
.avatar-info-text {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  padding: 0 10px;
}
.avatar-name {
  font-weight: 600;
}
.avatar-email {
  font-size: 12px;
  width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: $textColor;
}
</style>
