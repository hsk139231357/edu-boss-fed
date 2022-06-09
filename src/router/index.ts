import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import layout from '@/layout/index.vue'
import store from '@/store'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/',
    component: layout,
    meta: {
      requiresAuth: true
    }, // meta默认就是空对象，也可以只写在父路由上，只要副路由包含校验信息，子路由就不再需要了
    children: [
      {
        name: 'home',
        path: '',
        component: () => import('@/views/home/index.vue'),
        meta: {
          requiresAuth: true
        } // meta默认就是空对象
      },
      {
        name: 'advert',
        path: '/advert',
        component: () => import('@/views/advert/index.vue'),
        meta: {
          requiresAuth: false
        }
      },
      {
        name: 'advert-space',
        path: '/advert-space',
        component: () => import('@/views/advert-space/index.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        name: 'course',
        path: '/course',
        component: () => import('@/views/course/index.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        name: 'menu',
        path: '/menu',
        component: () => import('@/views/menu/index.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        name: 'resource',
        path: '/resource',
        component: () => import('@/views/resource/index.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        name: 'role',
        path: '/role',
        component: () => import('@/views/role/index.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        name: 'user',
        path: '/user',
        component: () => import('@/views/user/index.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        name: 'menu-create',
        path: 'menu/create',
        component: () => import('@/views/menu/create.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        name: 'menu-edit',
        path: 'menu/edit',
        component: () => import('@/views/menu/edit.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        name: 'alloc-menu',
        path: 'role/:roleId/alloc-menu',
        component: () => import('@/views/role/alloc-menu.vue'),
        props: true, // 将路由路径参数映射到组件的 props 数据中
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/course/create',
        name: 'course-create',
        component: () => import(/* webpackChunkName: 'course-create' */ '@/views/course/create.vue')
      },
      {
        path: '/course/:courseId/edit',
        name: 'course-edit',
        component: () => import(/* webpackChunkName: 'course-edit' */ '@/views/course/edit.vue'),
        props: true
      },
      {
        path: '/course/:courseId/section',
        name: 'course-section',
        component: () => import(/* webpackChunkName: 'course-section' */ '@/views/course/section.vue'),
        props: true
      }
    ]
  },
  {
    name: '404',
    path: '*',
    component: () => import('@/views/error-page/404.vue')
  }
]

const router = new VueRouter({
  routes
})

// 全局前置守卫：任何页面的访问都要经过这里
// to：要去哪里的路由信息
// from：从哪里来的路由信息
// next：通行的标志
router.beforeEach((to, from, next) => {
  // to.matched 是一个数组，匹配到的是路由记录
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user) {
      next({
        name: 'login',
        // 保存我们所在的位置，以便以后再来
        query: { redirect: to.fullPath }
      })
    } else {
      next() // 允许通过
    }
  } else {
    next()
  }
})

export default router
