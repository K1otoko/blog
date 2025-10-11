<template>
  <div class="adminHome">
    <el-container class="container">
      <el-aside width="200px">
        <el-menu router :default-active="route.path" class="menu">
          <el-menu-item index="/admin/home" route="/admin/home">首页</el-menu-item>
          <el-menu-item index="/admin/article" route="/admin/article">文章管理</el-menu-item>
          <el-menu-item index="/admin/category" route="/admin/category">分类管理</el-menu-item>
          <el-menu-item index="/admin/user" route="/admin/user">用户管理</el-menu-item>
          <el-menu-item index="/admin/comment" route="/admin/comment">评论管理</el-menu-item>
          <el-menu-item index="/admin/setting" route="/admin/setting">系统设置</el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header"><HeaderView /></el-header>
        <el-main class="main"
          ><div class="main-content"><RouterView /></div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import HeaderView from './component/headerView.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
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
  border-right: 1px solid $borderColor;
  padding: 60px 18px 0;
  box-shadow: 5px 0 10px -5px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
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
  background-color: #fff;
}
.main {
  background-color: $backgroundColor;
  padding: 24px;
}
.main-content {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 18px;
  padding: 24px;
  box-sizing: border-box;
}
</style>
