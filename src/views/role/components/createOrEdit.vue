<template>
  <div>
    <el-form :model="roles">
      <el-form-item label="角色名称">
        <el-input v-model="roles.name"></el-input>
      </el-form-item>
      <el-form-item label="角色编码">
        <el-input v-model="roles.code"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="roles.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { createOrUpdate, getRoleById } from '@/services/role'

export default Vue.extend({
  name: 'createOrEditRoleIndex',
  props: {
    roleId: {
      type: [String, Number]
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      roles: {
        code: '',
        name: '',
        description: ''
      }
    }
  },
  methods: {
    async confirm () {
      await createOrUpdate(this.roles)
      this.$message.success('添加成功')
      this.$emit('success')
    },
    cancel () {
      this.$message.success('取消添加')
      this.$emit('cancel')
    },
    async loadRoleInfo () {
      if (this.isEdit) {
        const { data } = await getRoleById(this.roleId)
        this.roles = data.data
      }
    }
  },
  created () {
    this.loadRoleInfo()
  }
})
</script>

<style lang="scss" scoped></style>
