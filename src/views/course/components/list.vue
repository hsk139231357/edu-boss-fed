<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" ref="form" :model="form" class="demo-form-inline">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name" placeholder="角色名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="idLoadingFlag">查询</el-button>
            <el-button @click="onReset" :disabled="idLoadingFlag">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-button @click="handleAdd">添加角色</el-button>
      <el-table
        :data="resources"
        :border="true"
        style="width: 100%;margin-top: 30px"
        v-loading="idLoadingFlag"
      >
        <el-table-column
          type="index"
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述">
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="添加时间">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="$router.push({
              name: 'alloc-menu',
              params: {
                roleId: scope.row.id
              }
            })">分配菜单</el-button>
            <el-button type="text" size="small" @click="$router.push({
              name: 'alloc-menu',
              params: {
                roleId: scope.row.id
              }
            })">分配资源</el-button>
            <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="form.current"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        style="margin-top: 30px"
        :disabled="idLoadingFlag"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
      :visible.sync="dialogVisible"
      width="30%">
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'
import { getRoles, deleteRole, createOrUpdate } from '@/services/role'

export default Vue.extend({
  name: 'courseListIndex',
  data () {
    return {
      resources: [],
      formInline: {
        user: '',
        region: ''
      },
      form: {
        name: '',
        current: 1,
        size: 10
      },
      totalCount: 0,
      idLoadingFlag: true,
      dialogVisible: false,
      roleId: null,
      isEdit: false
    }
  },
  methods: {
    onSubmit () {
      this.form.current = 1
      this.loadRoleInfo()
    },
    onReset () {
      // 重置
      (this.$refs.form as Form).resetFields()
      this.form.current = 1
      this.loadRoleInfo()
    },
    async loadRoleInfo () {
      this.idLoadingFlag = true
      try {
        const { data } = await getRoles(this.form)
        this.resources = data.data.records
        this.totalCount = data.data.total
      } catch (e) {} finally {
        this.idLoadingFlag = false
      }
    },
    handleSizeChange (val: number) {
      // console.log(`每页 ${val} 条`)
      this.form.size = val
      this.form.current = 1
      this.loadRoleInfo()
    },
    handleCurrentChange (val: number) {
      // console.log(`当前页: ${val}`)
      this.form.current = val
      this.loadRoleInfo()
    },
    onSuccess () {
      this.dialogVisible = false
      this.loadRoleInfo()
    },
    onCancel () {
      this.dialogVisible = false
    },
    handleAdd () {
      this.isEdit = false
      this.dialogVisible = true
    },
    handleEdit (role: any) {
      this.isEdit = true
      this.roleId = role.id
      this.dialogVisible = true
    },
    async handleDelete (role: any) {
      await deleteRole(role.id)
      this.loadRoleInfo()
    }
  },
  created () {
    this.loadRoleInfo()
  }
})
</script>

<style lang="scss" scoped></style>
