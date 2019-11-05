<template>
  <Row :gutter="16">
    <Col span="24">
      <Card :bordered="false">
        <p slot="title">添加任务</p>
        <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="90">
          <FormItem label="任务名称：" prop="name">
            <Input type="text" v-model.trim="formCustom.name"></Input>
          </FormItem>
          <FormItem label="扫描目标：" prop="ip_list">
            <span slot="label" style="position:relative">
              扫描目标：
              <Poptip
                style="position:absolute;bottom: -25px;left: 15px;"
                placement="right"
                word-wrap
                width="250"
                trigger="hover"
                content="多个IP范围或独立IP之间可用英文 ' , ' 例：
                  192.168.0.1
                  192.168.1.1-254
                  192.168.1.1/24
                  192.168.1.*
                  192.168.1-10.*
                "
              >
                <Icon type="ios-help-circle-outline" size="20" />
              </Poptip>
            </span>
            <Input
              type="textarea"
              v-model="formCustom.ip_list"
              :autosize="{minRows: 2,maxRows: 5,minCols:100,}"
              placeholder
              @change="ip_list_change"
              width="450"
              style="display:inline-block;"
            ></Input>
          </FormItem>
          <FormItem label="优先级：">
            <Radio-group v-model="formCustom.priority">
              <Radio label="1" value="1">低</Radio>
              <Radio label="5" value="5">中</Radio>
              <Radio label="11" value="11">高</Radio>
            </Radio-group>
          </FormItem>
          <FormItem label="模式：">
            <Radio-group v-model="formCustom.mode" @on-change="showCustomPort()">
              <Poptip word-wrap width="150" trigger="hover" content="默认端口">
                <Radio label="N" value="N">默认模式</Radio>
              </Poptip>
              <Poptip
                word-wrap
                width="400"
                trigger="hover"
                content="推荐的端口有：
                    UDP：53,69,161；
                    TCP：21-25，80，110，139，443，1433，1521，2181，2222，3306，3389，4040，4786，5000，5432，5555，5672，5900，5901，6379，7001，7002，8000-8200，8443，8480，9000，9043，9200，11000，11211，15672，18080，19200，25000，25010，25020，25672，27017，35871，50010，50020，50030，50070，50075，50470，50475，60000，60010，60020，60030，65022"
              >
                <Radio label="S" value="S">推荐端口</Radio>
              </Poptip>
              <Poptip word-wrap width="150" trigger="hover" content="所有端口">
                <Radio label="A" value="A">所有端口</Radio>
              </Poptip>
              <Poptip word-wrap width="150" trigger="hover" content="自定义扫描端口">
                <Radio label="C" value="C">自定义端口</Radio>
              </Poptip>
            </Radio-group>
          </FormItem>
          <FormItem v-if="customPortFlag" prop="port_list">
            <span slot="label" style="position:relative">
              自定义端口：
              <Poptip
                style="position:absolute;bottom: -25px;left: 20px;"
                placement="right"
                word-wrap
                width="250"
                trigger="hover"
                content="多个端口之间用之间用英文 ' , ' ，例：80,22,23,443
                "
              >
                <Icon type="ios-help-circle-outline" size="20" />
              </Poptip>
            </span>
            <Input
              type="textarea"
              v-model="formCustom.port_list"
              :autosize="{minRows: 2,maxRows: 5}"
              placeholder
            ></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="async('formCustom')" style="float:left">配置完成</Button>
            <Button @click="handleReset('formCustom')" style="margin-left: 8px">重置</Button>
          </FormItem>
        </Form>
      </Card>
    </Col>
  </Row>
</template>

<script>
import Qs from 'qs'

export default {
  data () {
    // function isValidIP (ip) {
    //   // var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    //   var reg = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){2}/
    //   return reg.test(ip)
    // }
    const validateTaskName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入任务名称'))
      } else if (value.length > 50) {
        callback(new Error('任务名称太长'))
      } else {
        callback()
      }
    }
    const validateIPList = (rule, value, callback) => {
      value = value.trim()
      if (value === '') {
        callback(new Error('请输入需要扫描的IP'))
      } else {
        var reg = /^[0-9.,-/*]+$/
        var reg1 = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){2}/
        var reg2 = /(\.)[^\1]{3,}\1/g
        // var reg3 = /(\.)[^\1]{4,}\1/g
        if (reg.test(value)) {
          if (value.indexOf(',') !== -1) {
            let rawIpList = value.split(',')
            for (var i = 0; i < rawIpList.length; i++) {
              if (value.indexOf('-') !== -1) {
                if (reg1.test(rawIpList[i]) && reg2.test(rawIpList[i])) {
                  callback()
                } else {
                  callback(new Error('错误的IP'))
                }
              } else {
                if (reg1.test(rawIpList[i]) && reg2.test(rawIpList[i])) {
                  callback()
                } else {
                  callback(new Error('错误的IP'))
                }
              }
            }
          } else {
            if (value.indexOf('-') !== -1) {
              if (reg1.test(value) && reg2.test(value)) {
                callback()
              } else {
                callback(new Error('错误的IP'))
              }
            } else {
              if (reg1.test(value) && reg2.test(value)) {
                callback()
              } else {
                callback(new Error('错误的IP'))
              }
            }
          }
        } else {
          callback(new Error('存在非法字符'))
        }
      }
    }
    // const validateIPList = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入需要扫描的IP'))
    //   } else if (value.indexOf(',') !== -1) {
    //     let rawIpList = value.split(',')
    //     for (var i = 0; i < rawIpList.length; i++) {
    //       if (rawIpList[i].indexOf('-') !== -1) {
    //         let ipSegment = rawIpList[i].split('-')
    //         console.log(ipSegment)

    //         for (var j = 0; j < ipSegment.length; j++) {
    //           if (!isValidIP(rawIpList[i])) {
    //             callback(new Error('错误的IP'))
    //           } else {
    //             callback()
    //           }
    //         }
    //       } else {
    //         if (!isValidIP(rawIpList[i])) {
    //           callback(new Error('错误的IP'))
    //         } else {
    //           callback()
    //         }
    //       }
    //     }
    //   } else {
    //     let reg = /^[0-9.,-/*]+$/
    //     let reg1 = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){2}/
    //     let reg2 = /(\.)[^\1]{3,}\1/g
    //     let reg3 = /(\.)[^\1]{4,}\1/g
    //     console.log(reg2.test(value))
    //     console.log(reg3.test(value))

    //     if (reg.test(value) && reg1.test(value)) {
    //       callback()
    //     } else {
    //       callback(new Error('错误的IP1'))
    //     }
    //   }
    // }

    const validateMode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择扫描模式'))
      } else {
        callback()
      }
    }

    const validatePriority = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择该任务的优先级'))
      } else {
        callback()
      }
    }

    const validatePortList = (rule, value, callback) => {
      if (this.customPortFlag && value === '') {
        callback(new Error('请填写自定义端口'))
      } else {
        let reg = /^[0-9,]+$/
        if (reg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确格式'))
        }
      }
    }

    return {
      ip_list_columns: [
        {
          title: 'IP',
          key: 'IP'
        }
      ],
      ip_list_sample: [
        {
          IP: '255.255.255.255'
        },
        {
          IP: '1.1.1.1'
        }
      ],
      customPortFlag: false,
      formCustom: {
        name: '',
        ip_list: '',
        mode: 'N',
        priority: '1',
        port_list: ''
      },
      ruleCustom: {
        name: [{ validator: validateTaskName, trigger: 'blur' }],
        ip_list: [{ validator: validateIPList, trigger: 'blur' }],
        mode: [{ validator: validateMode, trigger: 'blur' }],
        priority: [{ validator: validatePriority, trigger: 'blur' }],
        port_list: [{ validator: validatePortList, trigger: 'blur' }]
      }
    }
  },
  methods: {
    ip_list_change (text) {
      console.log(text)
    },
    async (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Modal.confirm({
            title: '确认框',
            content: '<p>任务参数是否OK？</p>',
            loading: true,
            okText: '没问题',
            onOk: () => {
              this.$axios
                .post('/task/send', Qs.stringify(this.formCustom))
                .then(response => {
                  console.log(response.data)

                  this.$Modal.remove()
                  if (response.data.status_code === 200) {
                    this.$Message.success('任务已下发')
                  } else {
                    this.$Message.error(response.data.reason)
                  }

                  this.$router.push({
                    name: 'taskdetail',
                    params: { id: response.data.data.task_id }
                  })
                })
            },
            cancelText: '再改改'
          })
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    showCustomPort () {
      this.customPortFlag = this.$data.formCustom.mode === 'C'
    }
  }
}
</script>
