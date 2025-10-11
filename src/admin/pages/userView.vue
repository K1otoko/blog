<template>
  <div class="userView">
    <div class="header">
      <div class="header-left">
        <el-button type="primary"> + 添加用户</el-button>
        <!-- <el-button type="info">
          <el-icon><Download /></el-icon> <span>导出数据</span></el-button
        > -->
      </div>
      <div class="header-right">
        <el-input :prefix-icon="Search" placeholder="请输入用户名或邮箱"></el-input>
      </div>
    </div>
    <div class="container">
      <el-table :data="userStore.userList">
        <el-table-column prop="name" label="Name" />
        <el-table-column prop="role" label="Role" />
        <el-table-column prop="username" label="username" />
        <el-table-column prop="phone" label="phone" />
        <el-table-column prop="email" label="email" />
        <el-table-column prop="createdAt" label="createdAt" />
        <el-table-column prop="lastLoginAt" label="lastLoginAt" />
        <el-table-column label="action">
          <template #default>
            <el-button type="primary">编辑</el-button>
            <el-button type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { Download, Search } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

onMounted(async () => {
  await userStore.getUserList()
  console.log(userStore.userList)
})
</script>
<style scoped lang="scss">
::v-deep .el-button {
  border: 0;
}
::v-deep .el-button--primary {
  background-color: $buttonColor;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.container {
  margin-top: 24px;
}
</style>
