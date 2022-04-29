<template>
  <div class="menu">
    <el-card class="box-card">
      <div solt="header" class="clearfix">
        <span>{{ isEdit ? '编辑菜单' : '添加菜单' }}</span>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="菜单名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input v-model="form.href"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select v-model="form.parentId" placeholder="请选择菜单">
            <el-option
              label="无上级菜单"
              :value="-1"
            ></el-option>
            <el-option
              v-for="menuItem in parentMenuList"
              :key="menuItem.id"
              :label="menuItem.name"
              :value="menuItem.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="前端图标">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group v-model="form.shown">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number
            v-model="form.orderNum"
            @change="handleChange"
            :min="1"
            :max="10"
            label="描述文字"
          ></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button
            v-if="!isEdit"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { saveOrUpdate, getEditMenuInfo } from '@/services/menu'

export default Vue.extend({
  name: 'createOrEditIndex',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        parentId: -1,
        name: '',
        href: '',
        icon: '',
        orderNum: 0,
        description: '',
        shown: false
      },
      parentMenuList: {}
    }
  },
  methods: {
    async onSubmit () {
      // 编辑时需要添加id，编辑时，此处的form是包含了id的，因为此时的form从接口获取
      // 创建时form从data获取，不包含id所以为创建
      const { data } = await saveOrUpdate(this.form)
      console.log(data)
      if (data.code === '000000') {
        this.$message.success('创建成功')
        this.$router.back()
      }
    },
    handleChange () {
      console.log(123)
    },
    async menuInfo () {
      const { data } = await getEditMenuInfo(this.$route.params.id || -1)
      if (data.data.menuInfo) {
        this.form = data.data.menuInfo
      }
      this.parentMenuList = data.data.parentMenuList
    }
  },
  created () {
    this.menuInfo()
  }
})
</script>

<style lang="scss" scoped></style>
