import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.VUE_APP_ROUTER_PRO_URL || process.env.BASE_URL,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
      meta: {
        requireLogin: false
      }
    },
    {
      path: '/',
      redirect: '/tasklist',
      component: () => import(/* webpackChunkName: "layout" */ '@/views/Home.vue'),
      children: [
        {
          path: '/sendtask',
          name: 'sendtask',
          component: () => import(/* webpackChunkName: "sendtask" */ '@/views/task/SendTask.vue')
        },
        {
          path: '/tasklist',
          name: 'tasks',
          component: () => import(/* webpackChunkName: "tasks" */ '@/views/task/TaskList.vue')
        },
        {
          path: '/tasklist/taskdetail/:id',
          name: 'taskdetail',
          component: () => import(/* webpackChunkName: "taskdetail" */ '@/views/task/TaskDetail.vue')
        },
        {
          path: '/addreport',
          name: 'addreport',
          component: () => import(/* webpackChunkName: "addreport" */ '@/views/report/AddReport.vue')
        },
        {
          path: '/tasklist/hostdetail/:pid/:ip',
          name: 'hostdetail',
          component: () => import(/* webpackChunkName: "hostdetail" */ '@/views/task/HostDetail.vue')
        },
        {
          path: '/reportlist',
          name: 'reports',
          component: () => import(/* webpackChunkName: "reports" */ '@/views/report/ReportList.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  store.commit('clearToken') // 取消请求
  if (to.path.startsWith('/login')) {
    localStorage.removeItem('gm-user')
    localStorage.removeItem('username')
    next()
  } else {
    let token = localStorage.getItem('gm-user')
    if (token === null || token === '') {
      next('/login')
    } else {
      next()
    }

    // let token = localStorage.getItem('Authorization')
    // let role = localStorage.getItem('role')
    // if (token === null || token === '' || role === '') {
    //   next('/login')
    // } else {
    //   if (to.meta.roles) {
    //     if (to.meta.roles.length !== 0) {
    //       for (let i = 0; i < to.meta.roles.length; i++) {
    //         if (role === to.meta.roles[i]) {
    //           next()
    //           break
    //         } else {
    //           next('/login')
    //         }
    //       }
    //     }
    //   } else {
    //     next()
    //   }
    // }
  }
})

export default router
