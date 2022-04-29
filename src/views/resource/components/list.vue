<template>
  <div class="resource-list">
    <el-card class="box-card">
      <el-form :inline="true" ref="form" :model="form" class="demo-form-inline">
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="form.name" placeholder="资源名称"></el-input>
        </el-form-item>
        <el-form-item label="资源路径" prop="url">
          <el-input v-model="form.url" placeholder="资源路径"></el-input>
        </el-form-item>
        <el-form-item label="资源分类" prop="categoryId">
          <el-select v-model="form.categoryId" clearable placeholder="资源分类">
            <el-option
              v-for="item in resourceCategory"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :disabled="idLoadingFlag">查询</el-button>
          <el-button @click="onReset" :disabled="idLoadingFlag">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="clearfix">
        <el-button @click.native="$router.push({ name: 'menu-create' })">添加菜单</el-button>
      </div>
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
          label="资源名称">
        </el-table-column>
        <el-table-column
          prop="url"
          label="资源路径">
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'
import { getResourcePages, getResourceCategory } from '@/services/resource'

export default Vue.extend({
  name: 'resourceListIndex',
  data () {
    return {
      resources: [],
      formInline: {
        user: '',
        region: ''
      },
      form: {
        name: '',
        url: '',
        categoryId: null, // 筛选条件
        current: 1,
        size: 10
      },
      totalCount: 0,
      resourceCategory: [],
      idLoadingFlag: true
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
        const { data } = await getResourcePages(this.form)
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
    async loadResourceCategory () {
      const { data } = await getResourceCategory()
      console.log(data.data)
      this.resourceCategory = data.data
    }
  },
  created () {
    this.loadResourceInfo()
    this.loadResourceCategory()
  }
})
</script>

<style lang="scss" scoped></style>
