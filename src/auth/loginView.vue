<template>
  <div class="loginView">
    <div class="loginView-container">
      <div class="loginView-container-left">
        <img
          src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimage109.360doc.com%2FDownloadImg%2F2025%2F04%2F0321%2F296122601_4_20250403090445718&refer=http%3A%2F%2Fimage109.360doc.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1758320118&t=4ebd6b72e8c8f1a35aa8d56b2d4927ed"
        />
      </div>
      <div class="loginView-container-right">
        <div></div>
        <div class="loginView-login">
          <el-form
            ref="ruleFormRef"
            :model="form"
            label-width="auto"
            class="loginView-login-form"
            :rules="rules"
          >
            <el-tabs v-model="activeName" @tab-change="handleClick" class="tabs">
              <el-tab-pane label="密码登录" name="username">
                <div class="loginView-login-form">
                  <el-form-item prop="username">
                    <el-input v-model="form.username" placeholder="手机号/邮箱/用户名" />
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input
                      v-model="form.password"
                      placeholder="密码"
                      type="password"
                      show-password
                    />
                  </el-form-item>
                </div>
              </el-tab-pane>
              <el-tab-pane label="验证码登录" name="phone">
                <el-form-item prop="phoneEmail">
                  <el-input v-model="form.phoneEmail" placeholder="手机号/邮箱" />
                </el-form-item>
                <el-form-item prop="code">
                  <el-input
                    v-model="form.code"
                    placeholder="验证码"
                    type="password"
                    show-password
                  />
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
            <div class="loginView-login-form-forget">
              <span>{{ activeName === 'username' ? '忘记密码' : '' }}</span>
            </div>

            <el-form-item>
              <el-button
                class="form-submit"
                type="primary"
                @click="onsubmitForm(ruleFormRef)"
                :loading="loading"
              >
                立即登录</el-button
              ></el-form-item
            >
          </el-form>
        </div>
        <div></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
// import * as phoneEmailRegex from '@/utils/index'

interface RuleForm {
  username: string
  password: string
  phoneEmail: string
  code: string
}
const ruleFormRef = ref<FormInstance>()

const activeName = ref('username')
const loading = ref(false)

const form = reactive<RuleForm>({
  username: '',
  password: '',
  phoneEmail: '',
  code: '',
})
const requiredRule: boolean = activeName.value ?? activeName.value === 'username' ? true : false
const rules = reactive<FormRules<RuleForm>>({
  username: [{ required: requiredRule, message: '请输入手机号/邮箱/用户名', trigger: 'blur' }],
  password: [{ required: requiredRule, message: '请输入密码', trigger: 'blur' }],
  phoneEmail: [
    { required: requiredRule, message: '请输入手机号/邮箱', trigger: 'blur' },
    {
      // pattern: phoneEmailRegex,
      message: '请输入正确的手机号',
      trigger: 'blur',
    },
  ],
  code: [{ required: requiredRule, message: '请输入验证码', trigger: 'blur' }],
})

const handleClick = () => {
  console.log(activeName.value)
  //切换登录方式重置表单
  ruleFormRef.value?.resetFields()
}
//提交
const onsubmitForm = async (formEl: FormInstance | undefined) => {
  console.log(loading.value, form, ruleFormRef)
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!', form)
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>
<style scoped lang="scss">
.loginView {
  display: flex;
  background-color: $backgroundColor;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  min-height: 700px;
  min-width: 1280px;
}
.loginView-container {
  width: 1000px;
  height: 500px;
  background-color: #fff;
  display: flex;
  border-radius: 15px;
  overflow: hidden;
}
.loginView-container-left,
.loginView-container-right {
  width: 50%;
  height: 100%;
}
.loginView-container-left {
  img {
    width: 100%;
    height: 100%;
  }
}
.loginView-container-right {
  div {
    width: 100%;
  }
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.loginView-login {
  padding: 0 64px;
  width: 100%;
  display: block;
  box-sizing: border-box;
}
::v-deep .el-tabs__nav-wrap:after {
  background-color: #ffffff;
}
::v-deep .el-tabs__nav-scroll {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
::v-deep .el-tabs__active-bar {
  background-color: $buttonColor;
}
::v-deep .el-tabs__item {
  color: $textColor;
  font-size: 16px;
}
::v-deep .is-active {
  color: $activeColor;
}
::v-deep .el-tabs__item:hover {
  color: $activeColor;
}
::v-deep .el-tabs__active-bar {
  background-color: $textColor;
}
::v-deep .el-tabs__content {
  margin-top: 20px;
}
.loginView-login-form-forget {
  font-size: 14px;
  color: $textColor;
  text-align: right;
  height: 20px;
  span {
    cursor: pointer;
  }
}
::v-deep .el-input__wrapper {
  box-shadow: none;
  border-bottom: 2px solid $borderColor;
  border-radius: 0;
}

.form-submit {
  margin-top: 20px;
  height: 40px;
  width: 100%;
  border-radius: 10px;
  background-color: $buttonColor;
  border: none;
}
.form-submit:hover {
  background-color: $buttonColor;
  border: none;
}
.form-submit::before {
  background-color: $buttonLoadingColor;
}
</style>
