<template>
  <div class="login">
    <div class="login-con">
      <div class="image1"></div>
      <div class="image"></div>
      <div class="form-con">
        <Form ref="loginForm"
              :model="form"
              :rules="rules"
              @keydown.enter.native="handleSubmit()">
          <FormItem prop="userName">
            <Input v-model="form.userName"
                   placeholder="用户名"
                   style="background:#000 !important;">
            <span slot="prepend">
              <Icon :size="16"
                    type="ios-person"></Icon>
            </span>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input type="password"
                   v-model="form.password"
                   placeholder="密码">
            <span slot="prepend">
              <Icon :size="14"
                    type="md-lock"></Icon>
            </span>
            </Input>
          </FormItem>
          <!-- <FormItem prop="verify">
            <Input type="text" v-model="form.verify" placeholder="验证码" style="width:130px;">
              <span slot="prepend">
                <Icon :size="14" type="md-cube"></Icon>
              </span>
            </Input>
            <img
              src="http://106.13.41.122:8000/hedunwaf/get_valid_img.png/?1234"
              title="点击刷新"
              style="width: 109px;height: 32px;position: absolute;top: 0;right: 0;cursor:pointer"
              @click="refresh($event)"
            />
          </FormItem>-->
          <FormItem>
            <Button :disabled="disabled"
                    @click="handleSubmit"
                    type="primary"
                    long>登录</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>
<script>
import Qs from 'qs'
import CryptoJS from 'crypto-js'
import utils from '@/utils'
export default {
  name: 'LoginForm',
  // props: {
  //   userNameRules: {
  //     type: Array,
  //     default: () => {
  //       console.log()

  //       return [{ required: true, message: '账号不能为空', trigger: 'blur' }]
  //     }
  //   },
  //   passwordRules: {
  //     type: Array,
  //     default: () => {
  //       return [{ required: true, message: '密码不能为空', trigger: 'blur' }]
  //     }
  //   },
  //   verifyRules: {
  //     type: Array,
  //     default: () => {
  //       return [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
  //     }
  //   }
  // },
  data () {
    const validateUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('账号不能为空'))
      } else if (value.length > 12) {
        callback(new Error('账号最长12位'))
      } else {
        callback()
      }
    }

    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else if (value.length > 12) {
        callback(new Error('密码最长12位'))
      } else {
        callback()
      }
    }
    return {
      disabled: false,
      loginNum: 0,
      form: {
        userName: '',
        password: ''
      },
      rules: {
        userName: [{ validator: validateUserName, trigger: 'blur' }],
        password: [{ validator: validatePassword, trigger: 'blur' }]
      }
    }
  },
  // computed: {
  //   rules () {
  //     return {
  //       userName: this.userNameRules,
  //       password: this.passwordRules
  //     }
  //   }
  // },
  created () {
    var cipherText = CryptoJS.AES.encrypt(
      'my message',
      'secretkey123'
    ).toString()
    console.log(cipherText)
    let a = utils.getAES('123123')
    console.log(a)
    let b = utils.getDAes('1ytMFwAyvhuDk/U0NXRv8A==')
    console.log(b)
  },
  methods: {
    refresh (e) {
      let time = new Date().getTime()
      let src = e.target.src.substr(0, e.target.src.indexOf('?') + 1)
      e.target.src = src + time
    },
    handleSubmit () {
      this.$refs.loginForm.validate(valid => {
        if (valid && !this.disabled) {
          this.loginNum++
          this.disabled = true

          let data = Qs.stringify({
            username: utils.getAES(this.form.userName),
            password: utils.getAES(this.form.password)
          })
          if (this.loginNum < 6) {
            this.$axios
              .post('/user/login', data)
              .then(response => {
                console.log(response.data)
                if (response.data.message === 'success') {
                  localStorage.setItem('gm-user', JSON.stringify('loginok'))
                  localStorage.setItem(
                    'username',
                    JSON.stringify(this.form.userName)
                  )
                  this.$router.push({ path: '/' })
                } else {
                  setTimeout(() => {
                    this.disabled = false
                  }, 1000)
                  this.$Message.info(response.data.reason)
                }
              })
              .catch(error => {
                setTimeout(() => {
                  this.disabled = false
                }, 1000)
                console.log(error)
              })
          } else {
            this.$Message.info('输入次数过多，请稍后再试！')
            setTimeout(() => {
              this.disabled = false
              this.loginNum = 0
            }, 60000)
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: #323232;
  .image {
    width: 95px;
    height: 45px;
    margin: auto;
    background: url("../assets/title.png") no-repeat;
  }
  .image1 {
    width: 90px;
    height: 103px;
    background: url("../assets/logo3.png") no-repeat;
    background-size: cover;
    position: absolute;
    top: -70px;
    left: 50%;
    transform: translateX(-50%);
  }
  .login-con {
    position: absolute;
    padding: 40px 40px 20px;
    left: 50%;
    top: 40%;
    border-radius: 15px;
    transform: translate(-50%, -50%);
    width: 300px;
    background-color: #484c4e;
    .login-header {
      font-size: 16px;
      font-weight: 300;
      text-align: center;
      padding: 30px 0;
    }
    .form-con {
      padding: 10px 0 0;
    }
    .login-tip {
      font-size: 10px;
      position: absolute;
      color: #ed4014;
    }
  }
}
</style>
