<template>
  <div style="position: relative;">
    <Row :gutter="16">
      <Col span="24">
        <Card :bordered="false">
          <p slot="title">任务信息</p>
          <Table :columns="task_detail_columns" :data="task_detail_data"></Table>
          <br />
          <div>当前任务状态：</div>
          <br />
          <Steps :current="state" :status="status" style="position: relative;left: 15%;">
            <Step title="等待进行" content="在任务队列中等待"></Step>
            <Step :title="title" :content="content"></Step>
            <!-- <Step title="漏洞检测" content="漏洞检测"></Step> -->
            <Step title="完成" content="扫描已完成"></Step>
          </Steps>
        </Card>
      </Col>
    </Row>

    <!-- <br> -->

    <!-- <Row :gutter="16">
      <Col span="24 ">
        <Card :bordered="false">
          <p slot="title">任务状态</p>
          <p>

            <div>
            </div>
          </p>
        </Card>
    </Col>-->

    <!-- <Col span="6" offset="1">
      <Card :bordered="false">
        <Circle :percent="80">
          <span class="demo-Circle-inner" style="font-size:24px">80%</span>
        </Circle>
      </Card>
      </Col>
    </Row>
    -->

    <br />

    <Row :gutter="16" v-if="vulPieData.length > 0">
      <Col span="24">
        <Card :bordered="false">
          <p slot="title">漏洞概览</p>
          <div class="chart-wrapper">
            <div id="vulPie" ref="vulPie"></div>
            <div style="display:inline-block;width: 50%;vertical-align: top">
              <Table
                size="default"
                stripe
                border
                :max-height="480"
                :columns="vul_type_columns"
                :data="vulPieData"
                no-data-text="未发现暴露的漏洞信息"
              ></Table>
            </div>
          </div>
        </Card>
      </Col>
    </Row>

    <br />

    <Row :gutter="16" v-if="servicePieData.length > 0">
      <Col span="24">
        <Card :bordered="false">
          <p slot="title">服务概览</p>
          <div class="chart-wrapper">
            <div id="servicePie" ref="servicePie"></div>
            <div style="display:inline-block;width: 50%;vertical-align: top">
              <Table
                size="default"
                stripe
                border
                :max-height="473"
                :columns="service_type_columns"
                :data="servicePieData"
                no-data-text="未发现暴露的服务信息"
              ></Table>
            </div>
          </div>
        </Card>
      </Col>
    </Row>

    <br />

    <Row :gutter="16">
      <Col span="24">
        <Card :bordered="false">
          <p slot="title">主机信息</p>
          <Table stripe border :columns="hosts_columns" :data="hosts_data" footer :max-height="510">
            <template slot-scope="{ row }" slot="action">
              <Button
                type="primary"
                size="small"
                style="margin-right: 5px"
                :to="'/tasklist/hostdetail/'+ row.task_id+'/'+row.ip"
              >详情</Button>
            </template>
          </Table>
        </Card>
      </Col>
    </Row>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  mounted () {},
  data () {
    return {
      state: 0,
      spinShow: true,
      status: 'wait',
      timer: null,
      title: '正在扫描',
      content: '正在扫描',
      task_detail_columns: [
        {
          title: '任务ID',
          key: 'id'
        },
        {
          title: '任务名称',
          key: 'name'
        },
        {
          title: '模式',
          key: 'mode'
        },
        {
          title: '优先级',
          key: 'priority'
        },
        {
          title: '创建时间',
          key: 'date_created'
        },
        {
          title: '结束时间',
          key: 'date_finished'
        }
      ],
      task_detail_data: [
        // {
        //   name: '6月10日内网扫描',
        //   mode: '推荐端口模式',
        //   priority: '中',
        //   date_created: '2016-10-03',
        //   date_finished: '2016-10-03'
        // }
      ],
      vulPie: null,
      vulPie2: null,
      servicePie: null,
      servicePieData: [],
      vulPieData: [],
      service_type_columns: [
        {
          title: '服务名称',
          key: 'name'
        },
        {
          title: '个数',
          key: 'value'
        }
      ],
      service_type_data: [
        {
          service: 'http',
          count: 80
        },
        {
          service: 'http',
          count: 80
        },
        {
          service: 'http',
          count: 80
        },
        {
          service: 'http',
          count: 80
        },
        {
          service: 'http',
          count: 80
        },
        {
          service: 'http',
          count: 80
        }
      ],
      vul_type_columns: [
        {
          title: '漏洞名称',
          key: 'name'
        },
        {
          title: '个数',
          key: 'value'
        }
      ],
      vul_type_data: [
        {
          service: 'sql',
          count: 80
        },
        {
          service: 'sql',
          count: 80
        },
        {
          service: 'sql',
          count: 80
        },
        {
          service: 'sql',
          count: 80
        },
        {
          service: 'sql',
          count: 80
        },
        {
          service: 'sql',
          count: 80
        }
      ],
      hosts_columns: [
        {
          title: 'IP地址',
          align: 'center',
          width: 130,
          key: 'ip',
          render: (h, params) => {
            let color = null
            if (params.row.risk_value >= 7.0 && params.row.risk_value <= 10.0) {
              color = 'red'
            } else if (
              params.row.risk_value >= 5.0 &&
              params.row.risk_value < 7.0
            ) {
              color = 'orange'
            } else {
              color = 'black'
            }

            return h(
              'label',
              {
                style: {
                  color: color
                }
              },
              params.row.ip
            )
          }
        },
        {
          title: '服务（个）',
          align: 'center',
          children: [
            {
              title: 'Web类',
              align: 'center',
              key: 'web_count'
            },
            {
              title: '文件传输类',
              align: 'center',
              key: 'ftp_count'
            },
            {
              title: '远程连接类',
              align: 'center',
              key: 'remote_count'
            },
            {
              title: '数据库类',
              align: 'center',
              key: 'db_count'
            },
            {
              title: '其它',
              align: 'center',
              key: 'other_count'
            },
            {
              title: '合计',
              align: 'center',
              key: 'service_count'
            }
          ]
        },
        {
          title: '漏洞风险（个）',
          align: 'center',
          children: [
            {
              title: '高',
              align: 'center',
              key: 'high_risk_count',
              render: (h, params) => {
                return h(
                  'strong',
                  {
                    style: {
                      color: 'red'
                    }
                  },
                  params.row.high_risk_count
                )
              }
            },
            {
              title: '中',
              align: 'center',
              key: 'mid_risk_count',
              render: (h, params) => {
                return h(
                  'strong',
                  {
                    style: {
                      color: 'orange'
                    }
                  },
                  params.row.mid_risk_count
                )
              }
            },
            {
              title: '低',
              align: 'center',
              key: 'low_risk_count'
            },
            {
              title: '合计',
              align: 'center',
              key: 'risk_count',
              render: (h, params) => {
                return h(
                  'strong',
                  {
                    // style: {
                    //   color: "orange",
                    // },
                  },
                  params.row.high_risk_count
                )
              }
            }
          ]
        },
        {
          title: '主机风险值',
          align: 'center',
          key: 'risk_value'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          width: 70
        }
      ],
      hosts_data: [
        {
          task_id: 1,
          ip: '1.1.1.1',
          web_count: 5,
          ftp_count: 2,
          remote_count: 1,
          db_count: 2,
          other_count: 0,
          service_count: 10,
          high_risk_count: 10,
          mid_risk_count: 5,
          low_risk_count: 5,
          risk_count: 20,
          risk_value: 7.0
        },
        {
          task_id: 1,
          ip: '2.2.2.2',
          web_count: 5,
          ftp_count: 2,
          remote_count: 1,
          db_count: 2,
          other_count: 0,
          service_count: 10,
          high_risk_count: 10,
          mid_risk_count: 5,
          low_risk_count: 5,
          risk_count: 20,
          risk_value: 10.0
        },
        {
          task_id: 1,
          ip: '1.1.1.1',
          web_count: 5,
          ftp_count: 2,
          remote_count: 1,
          db_count: 2,
          other_count: 0,
          service_count: 10,
          high_risk_count: 10,
          mid_risk_count: 5,
          low_risk_count: 5,
          risk_count: 20,
          risk_value: 3.0
        },
        {
          task_id: 1,
          ip: '1.1.1.1',
          web_count: 5,
          ftp_count: 2,
          remote_count: 1,
          db_count: 2,
          other_count: 0,
          service_count: 10,
          high_risk_count: 10,
          mid_risk_count: 5,
          low_risk_count: 5,
          risk_count: 20,
          risk_value: 7.0
        },
        {
          task_id: 1,
          ip: '1.1.1.1',
          web_count: 5,
          ftp_count: 2,
          remote_count: 1,
          db_count: 2,
          other_count: 0,
          service_count: 10,
          high_risk_count: 10,
          mid_risk_count: 5,
          low_risk_count: 5,
          risk_count: 20,
          risk_value: 5.0
        },
        {
          task_id: 1,
          ip: '1.1.1.1',
          web_count: 5,
          ftp_count: 2,
          remote_count: 1,
          db_count: 2,
          other_count: 0,
          service_count: 10,
          high_risk_count: 10,
          mid_risk_count: 5,
          low_risk_count: 5,
          risk_count: 20,
          risk_value: 5.0
        },
        {
          task_id: 1,
          ip: '1.1.1.1',
          web_count: 5,
          ftp_count: 2,
          remote_count: 1,
          db_count: 2,
          other_count: 0,
          service_count: 10,
          high_risk_count: 10,
          mid_risk_count: 5,
          low_risk_count: 5,
          risk_count: 20,
          risk_value: 10.0
        }
      ].sort(function (a, b) {
        return b.risk_value - a.risk_value
      })
    }
  },
  created () {
    this.request()
  },
  methods: {
    request () {
      this.$axios.get('/task/result/' + this.$route.params.id).then(res => {
        // this.$axios.get('/task/result/58/').then(res =>
        this.spinShow = false
        console.log(res.data.data)

        let flag = false
        let state = res.data.data.task.state
        if (state === '任务开始') {
          this.state = 0
          this.status = 'process'
        } else if (state === '任务完成') {
          flag = true
          this.state = 2
          this.status = 'finish'
        } else {
          this.state = 1
          if (state === '任务运行中') {
            this.title = '任务运行中'
            this.status = 'process'
          } else if (state === '任务暂停') {
            flag = true
            this.title = '任务暂停'
            this.status = 'error'
            this.content = '任务暂停'
          } else if (state === '任务撤销') {
            flag = true
            this.title = '任务撤销'
            this.status = 'error'
            this.content = '任务撤销'
          } else if (state === '任务异常终止') {
            flag = true
            this.title = '任务异常终止'
            this.content = '任务异常终止'
            this.status = 'error'
          }
        }
        this.task_detail_data.pop()
        this.task_detail_data.push(res.data.data.task)
        this.hosts_data = res.data.data.task.hosts
        this.servicePieData = this.convertData(res.data.data.task.service_types)
        this.vulPieData = this.convertData(res.data.data.task.vul_types)
        if (this.vulPieData.length > 0) {
          this.initVulPie()
        }
        if (this.servicePieData.length > 0) {
          this.initServicePie()
        }
        if (!flag) {
          this.timer = setTimeout(() => {
            this.request()
          }, 8000)
        }
      })
    },
    convertData (data) {
      let arr = []
      let num = 0
      // let val = 0
      for (let key in data) {
        if (key !== 'count' && num < 20) {
          num++
          let obj = {
            value: data[key],
            name: key
          }
          arr.push(obj)
        }
      }
      // arr.push({
      //   value: val,
      //   name: '其他'
      // })
      return arr
    },
    initVulPie () {
      this.$nextTick(() => {
        this.vulPie = echarts.init(this.$refs.vulPie)
        this.vulPie.setOption({
          // backgroundColor: "#2c343c",
          // title: {
          //   text: '漏洞类型统计',
          //   left: 'center',
          //   top: 10,
          //   textStyle: {
          //     color: '#aaa'
          //   }
          // },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          series: [
            {
              name: '漏洞类型',
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              data: this.vulPieData,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        })
      })
    },
    initServicePie () {
      this.$nextTick(() => {
        this.servicePie = echarts.init(this.$refs.servicePie)
        this.servicePie.setOption({
          // backgroundColor: "#2c343c",
          // title: {
          //   text: '服务类型统计',
          //   left: 'center',
          //   top: 10,
          //   textStyle: {
          //     color: '#aaa'
          //   }
          // },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          series: [
            {
              name: '服务类型',
              type: 'pie',
              radius: '55%',
              center: ['50%', '55%'],
              data: this.servicePieData,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        })
      })
    },
    show (row) {
      this.$router.push({ path: `/hostdetail/${row.task_id}/${row.ip}` })
    }
  },
  beforeDestroy () {
    this.$once('hook:beforeDestroy', () => {
      clearInterval(this.timer)
    })
  }
}
</script>

<style scoped>
#vulPie {
  height: 400px;
  width: 50%;
  display: inline-block;
  /* float: left; */
}

.chart-wrapper {
  text-align: left;
}

#servicePie {
  height: 450px;
  width: 50%;
  display: inline-block;
  /* float: left; */
}
</style>
