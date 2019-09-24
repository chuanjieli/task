<style scoped>
.layout {
  position: relative;
  overflow: hidden;
}
.layout-logo {
  width: 135px;
  height: 60px;
  background: url('../assets/icon.png') no-repeat;
  background-size: cover;
  border-radius: 3px;
  position: relative;
  top: 0;
  left: -35px;
}
.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}
</style>
<template>
  <div class="layout">
    <Layout>
      <Header style="width: 100%;position:fixed;top:0;z-index:1000">
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo"></div>
          <div style="position: absolute;right:0;top: 0">
            <Dropdown @on-click="userConfig">
              <a href="javascript:void(0)" style="font-size:18px">
                <Icon type="md-person" size="22"></Icon>
                {{user}}
              </a>
              <DropdownMenu slot="list">
                <!-- <DropdownItem name="changePwd">修改密码</DropdownItem> -->
                <DropdownItem name="logout">退出登录</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Sider hide-trigger theme="dark" style="position:fixed;top:64px;z-index:1000;height: 100%;">
          <Menu :active-name="path" theme="dark" width="auto" :open-names="['1']">
            <Submenu name="1">
              <template slot="title">
                <Icon type="ios-navigate"></Icon>任务管理
              </template>
              <MenuItem name="tasklist" to="/tasklist">任务列表</MenuItem>
              <MenuItem name="sendtask" to="/sendtask">创建任务</MenuItem>
              <!-- <MenuItem name="task" to="/hostdetail/24/10.1.4.120">创建</MenuItem> -->
              <!-- <MenuItem name="1-3">Option 3</MenuItem> -->
            </Submenu>
            <Submenu name="2">
              <template slot="title">
                <Icon type="ios-keypad"></Icon>报告管理
              </template>
              <MenuItem name="addreport" to="/addreport">报告生成</MenuItem>
              <MenuItem name="reportlist" to="/reportlist">报告列表</MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Layout style>
          <Content style="padding:8px;margin-left:200px;padding-top:72px;position:relative;">
            <router-view></router-view>
            <Spin size="large" fix v-if="$store.state.spin"></Spin>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>
<script>
export default {
  name: 'home',
  data () {
    return {
      user: '',
      path: ''
    }
  },
  created () {
    this.user = JSON.parse(window.localStorage.getItem('username'))
    this.getPath()
  },
  methods: {
    userConfig (name) {
      console.log(name)

      if (name === 'logout') {
        this.$router.push('/login')
      } else {
        this.$router.push('/changepwd')
        console.log('changepwd')
      }
    },
    getPath () {
      let index = this.$route.path.indexOf('/', 1)
      if (index > 0) {
        this.path = this.$route.path.slice(1, index)
      } else {
        this.path = this.$route.path.slice(1)
      }
    }
  },
  watch: {
    $route: 'getPath'
  }
}
</script>
