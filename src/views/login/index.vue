<template>
  <div class="login">
    <el-form
      class="login-form"
      ref="form"
      :model="form"
      label-width="80px"
      label-position="top"
      :rules="rules"
    >
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-btn"
          type="primary"
          @click="onSubmit"
          :loading="isLoading"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { login } from '@/services/user'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'loginIndex',
  data () {
    return {
      form: {
        phone: '18201288771', // 18201288771
        password: '111111'
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请选择活动区域', trigger: 'change' },
          { min: 6, max: 18, message: '长度在6-18个字符', trigger: 'blur' }
        ]
      },
      isLoading: false
    }
  },
  methods: {
    async onSubmit () {
      try {
        // 表单验证
        await (this.$refs.form as Form).validate()
        this.isLoading = true
        const { data } = await login(this.form)
        if (data.state !== 1 && data.state !== 200) {
          this.$message.error(data.message)
        } else {
          this.$store.commit('setUser', data.content)
          this.$router.push(this.$route.query.redirect as string || '/')
          // this.$router.push({
          //   name: 'home'
          // })
          this.$message.success('登录成功')
        }
      } catch (e) {
        console.log(e)
      }
      this.isLoading = false
    }
  }
})
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form {
  width: 300px;
  background: #fff;
  padding: 20px;
  border-radius: 5px;
}
.login-btn {
  margin-top: 20px;
  width: 100%;
}
</style>
