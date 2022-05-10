<template>
  <div class="user">
    <el-card>
      <div clot="header">
        <span>分配权限</span>
      </div>
      <el-tree
        ref="menu-tree"
        :data="MenuData"
        :props="defaultProps"
        :default-checked-keys="checkedKeys"
        node-key="id"
        show-checkbox
        default-expand-all
      ></el-tree>
      <div style="margin-top: 20px">
        <el-button @click="clearData">清空</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu'
import { Tree } from 'element-ui'

export default Vue.extend({
  name: 'allocMenuIndex',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      MenuData: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  methods: {
    async loadMenuList () {
      const { data } = await getMenuNodeList()
      this.MenuData = data.data
    },
    async loadCheckedList () {
      const { data } = await getRoleMenus(this.roleId)
      this.checkedKeys = []
      this.getCheckKeys(data.data)
    },
    getCheckKeys (menus: any) {
      menus.forEach((ev: any) => {
        if (ev.selected) {
          // this.checkedKeys.push((ev.id as never))
          this.checkedKeys = [...this.checkedKeys, ev.id] as any
        }
        if (ev.subMenuList) {
          this.getCheckKeys(ev.subMenuList)
        }
      })
    },
    async onSave () {
      const menuList = (this.$refs['menu-tree'] as Tree).getCheckedKeys()
      const { data } = await allocateRoleMenus({
        roleId: this.roleId,
        menuId: menuList
      })
      this.$router.back()
    },
    clearData () {
      (this.$refs['menu-tree'] as Tree).setCheckedKeys([])
    }
  },
  created () {
    this.loadMenuList()
    this.loadCheckedList()
  }
})
</script>

<style lang="scss" scoped></style>
