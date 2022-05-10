<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" ref="form" :model="form" class="demo-form-inline">
          <el-form-item label="手机号" prop="name">
            <el-input v-model="form.name" placeholder="资源名称"></el-input>
          </el-form-item>
          <el-form-item label="注册时间" prop="url">
            <el-date-picker
              v-model="value2"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="idLoadingFlag">查询</el-button>
            <el-button @click="onReset" :disabled="idLoadingFlag">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="resources"
        :border="true"
        style="width: 100%;margin-top: 30px"
        v-loading="idLoadingFlag"
      >
        <el-table-column
          prop="name"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="注册时间">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" size="small">分配角色</el-button>
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
      <el-dialog
        title="分配角色"
        :visible.sync="dialogVisible"
        width="30%">
        <el-select v-model="value1" multiple placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'
import { getUserPages } from '@/services/user'
import { getAllRoles, allocateUserRoles, getUserRoles } from '@/services/role'

export default Vue.extend({
  name: 'resourceListIndex',
  data () {
    return {
      options: [],
      value1: [],
      resources: [],
      formInline: {
        user: '',
        region: ''
      },
      dialogVisible: false,
      form: {
        name: '',
        url: '',
        categoryId: null, // 筛选条件
        current: 1,
        size: 10
      },
      totalCount: 0,
      value2: '',
      idLoadingFlag: true,
      currentUser: {}
    }
  },
  methods: {
    onSubmit () {
      this.form.current = 1
      this.loadResourceInfo()
    },
    onReset () {
      // 重置
      (this.$refs.form as Form).resetFields()
      this.form.current = 1
      this.loadResourceInfo()
    },
    async loadResourceInfo () {
      this.idLoadingFlag = true
      try {
        const { data } = await getUserPages(this.form)
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
      this.loadResourceInfo()
    },
    handleCurrentChange (val: number) {
      // console.log(`当前页: ${val}`)
      this.form.current = val
      this.loadResourceInfo()
    },
    async handleEdit (user: any) {
      this.currentUser = user
      const { data } = await getAllRoles()
      this.options = data.data

      let data1 = await getUserRoles(user.id)
      this.value1 = data1.data.data.map((ev: any) => ev.id)
      this.dialogVisible = true
    },
    async onConfirm () {
      const { data } = await allocateUserRoles({
        userId: (this.currentUser as any).id,
        roleIdList: this.value1
      })
      this.dialogVisible = false
    }
  },
  created () {
    this.loadResourceInfo()
  }
})
</script>

<style lang="scss" scoped></style>
