<template>
  <div class="adminHome">
    <el-container class="container">
      <el-aside width="200px">
        <el-menu router="true" default-active="1" class="menu">
          <el-menu-item index="1" route="/admin/home">首页</el-menu-item>
          <el-menu-item index="2" route="/admin/article">文章管理</el-menu-item>
          <el-menu-item index="3" route="/admin/user">用户管理</el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header"><HeaderView /></el-header>
        <el-main><RouterView /> </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import HeaderView from './component/headerView.vue'
</script>
<style scoped lang="scss">
.menu .is-active {
  color: $activeColor;
  font-weight: 500;
}
.adminHome,
.container {
  height: 100vh;
  width: 100vw;
}
.header {
  border-bottom: 1px solid $borderColor;
}
.menu {
  height: 100%;
  border-right: none;
  padding: 60px 18px 0;
  background-color: $backgroundColor;
}
.menu li {
  font-size: 16px;
  border-radius: 18px;
  height: 50px;
  text-align: center;
  justify-content: center;
  margin-bottom: 10px;
  color: $textColor;
}
.menu li:hover {
  background-color: $backgroundColor;
}
</style>
