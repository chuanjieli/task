<template>
  <div style="position:relative">
    <Row :gutter="16">
      <Col span="24">
        <Card :bordered="false">
          <p slot="title">主机概况</p>
          <Button size="small" type="primary" slot="extra" @click="$router.go(-1)">返回</Button>
          <Table border :columns="host_detail_columns" :data="host_detail_data"></Table>
        </Card>
      </Col>
    </Row>

    <br />

    <Row :gutter="16" v-if="vul_list_data.length > 0">
      <Col span="24">
        <Card :bordered="false">
          <p slot="title">漏洞信息</p>
          <Table border :columns="vul_list_columns" :data="vul_list_data"></Table>
        </Card>
      </Col>
    </Row>

    <br />

    <Row :gutter="16" v-if="service_list_data.length > 0">
      <Col span="24">
        <Card :bordered="false">
          <p slot="title">服务信息</p>
          <Table border :columns="service_list_columns" :data="service_list_data"></Table>
          <expandRow style="display: none;"></expandRow>
        </Card>
      </Col>
    </Row>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import expandRow from '@/components/VulDetail.vue'
export default {
  components: { expandRow },
  mounted () {},
  data () {
    return {
      params: {},
      spinShow: true,
      host_detail_columns: [
        {
          title: 'IP地址',
          minWidth: 180,
          align: 'center',
          key: 'ip'
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
          title: '扫描起始时间',
          align: 'center',
          width: 100,
          key: 'date_created'
        },
        {
          title: '扫描结束',
          align: 'center',
          width: 100,
          key: 'date_finished'
        }
      ],
      vul_list_columns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row,
                title: '漏洞'
              }
            })
          }
        },
        {
          title: '端口号',
          align: 'center',
          key: 'port'
        },
        {
          title: '协议',
          align: 'center',
          key: 'protocol',
          render (h, params) {
            var pro = ''

            if (params.row.protocol === 1) {
              pro = 'TCP'
            } else {
              pro = 'UDP'
            }
            return h('span', pro)
          }
        },
        {
          title: '服务',
          align: 'center',
          key: 'service'
        },
        {
          title: '漏洞',
          align: 'center',
          key: 'vul_name'
        },
        {
          title: '风险级别',
          align: 'center',
          key: 'risk_level'
        }
      ],
      service_list_columns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row,
                title: '服务'
              }
            })
          }
        },
        {
          title: '端口号',
          align: 'center',
          key: 'port'
        },
        {
          title: '协议',
          align: 'center',
          key: 'protocol',
          render (h, params) {
            var pro = ''

            if (params.row.protocol === 1) {
              pro = 'TCP'
            } else {
              pro = 'UDP'
            }
            return h('span', pro)
          }
        },
        {
          title: '服务',
          align: 'center',
          key: 'service'
        },
        {
          title: '归属地',
          align: 'center',
          key: 'location'
        },
        {
          title: '更新时间',
          align: 'center',
          key: 'update_time'
        }
      ],
      host_detail_data: [],
      vul_list_data: [
        {
          port: 80,
          protocol: 'TCP',
          service: 'http',
          vul_name: 'index_of_free',
          vul_detail: 'Access index of free.',
          risk_level: '高',
          solution: '更新固件'
        }
      ],
      service_list_data: [
        {
          port: 80,
          protocol: 'TCP',
          service: 'http',
          location: 'index_of_free',
          update_time: '高'
        }
      ]
    }
  },
  created () {
    this.params = this.$route.params
    this.request()
    console.log(this.$route.params)
  },
  methods: {
    request () {
      this.$axios
        .get('/task/' + this.params.pid + '/host/' + this.params.ip)
        .then(res => {
          this.spinShow = false
          // this.$axios.get('/task/58/host/10.1.4.120').then(res => {
          this.host_detail_data.push(res.data.data.host_detail.host)
          this.service_list_data = res.data.data.host_detail.services
          this.vul_list_data = res.data.data.host_detail.vuls
          console.log(this.host_detail_data)
        })
    }
  }
}
</script>
