<template>
  <Row :gutter="16">
    <Col span="24">
      <Card :bordered="false">
        <p slot="title">生成报告</p>
        <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
          <FormItem label="报告名称：" prop="name">
            <Input type="text" v-model.trim="formCustom.name"></Input>
          </FormItem>
          <FormItem label="最近任务：">
            <Select v-model="model1" style="width:200px" @on-change="getOption">
              <Option :value="50">50个</Option>
              <Option :value="100">100个</Option>
              <Option :value="200">200个</Option>
            </Select>
          </FormItem>
          <FormItem label="选择任务：" prop="task_id">
            <Select v-model="formCustom.task_id" style="width:200px" :loading="loading">
              <Option
                v-for="task in task_list"
                :value="task.id"
                :key="task.id"
              >{{ task.id + '-' +task.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="报告格式：" prop="format">
            <RadioGroup v-model="formCustom.format">
              <Radio label="excel">EXCEL</Radio>
              <Radio label="html">HTML</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="async('formCustom')" style="float:left">生成</Button>
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
    const validateReportName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入报告名称'))
      } else {
        callback()
      }
    }

    const validateTaskID = (rule, value, callback) => {
      console.log(value)
      if (value === '') {
        callback(new Error('请选择需要导出报表的任务'))
      } else {
        callback()
      }
    }

    const validateFormat = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择报表的输出'))
      } else {
        callback()
      }
    }

    return {
      loading: false,
      options: [],
      task_list: [],
      model1: 50,
      formCustom: {
        name: '',
        task_id: '',
        format: 'excel'
      },
      ruleCustom: {
        name: [{ validator: validateReportName, trigger: 'blur' }],
        task_id: [{ validator: validateTaskID, trigger: 'blur' }],
        format: [{ validator: validateFormat, trigger: 'blur' }]
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.loading = true
      this.$axios
        .get('/task/list?state=finish&brief=1&page=1&pageSize=' + this.model1)
        .then(response => {
          this.task_list = response.data.data.task_list
          this.formCustom.task_id = response.data.data.task_list[0].id
          this.loading = false
          console.log(this.task_list)
        })
    },
    getOption (val) {
      console.log(val)
      this.model1 = val
      this.init()
    },
    query_task (query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          const taskList = this.task_list.map(task => {
            return {
              value: task.name,
              label: task.name
            }
          })
          console.log(taskList)
          this.options = taskList.filter(
            item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          )
        }, 200)
      } else {
        this.options = []
      }
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
                .post('/report/generate', Qs.stringify(this.formCustom))
                .then(response => {
                  console.log(response.data)

                  setTimeout(() => {
                    this.$Modal.remove()
                    if (response.data.status_code === 200) {
                      this.$Message.success('报告生成中')
                    } else {
                      this.$Message.error(response.data.reason)
                    }
                  }, 1000)

                  this.$router.push('/reportlist')
                })
            },
            cancelText: '再改改'
          })
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>
