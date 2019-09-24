<template>
  <div>
    <Row :gutter="16">
      <Col span="24">
        <Card :bordered="false">
          <p slot="title">报告列表</p>
          <Table border :columns="report_list" :data="report_list_data" :loading="loading">
            <template slot-scope="{ row }" slot="name">
              <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row }" slot="action">
              <Button
                :disabled="row.progress !== 100"
                style="margin-right:10px"
                type="primary"
                size="small"
                @click="download(row)"
              >下载</Button>
              <Button type="error" size="small" @click="remove(row)">删除</Button>
            </template>
          </Table>
          <div style="margin-top:10px;text-align: right;">
            <Page
              size="small"
              :total="paginator.totalCount"
              :page-size="paginator.pageSize"
              :current="paginator.page"
              show-elevator
              show-sizer
              show-total
              @on-change="pageChange"
              @on-page-size-change="pageSizeChange"
            />
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: true,
      timer: null,
      paginator: {
        page: 1,
        pageSize: 10,
        totalCount: 10
      },
      report_list: [
        {
          title: '报告ID',
          key: 'id',
          align: 'center'
        },
        {
          title: '报告名称',
          key: 'report_name',
          width: 150,
          align: 'center'
        },
        {
          title: '报表格式',
          key: 'report_type',
          align: 'center'
        },
        {
          title: '进度',
          key: 'progress',
          align: 'center',
          render: (h, params) => {
            if (params.row.progress === '') {
              params.row.progress = 0
            }
            return h('div', [
              h('Progress', {
                props: {
                  status: 'active',
                  percent: params.row.progress
                }
              })
            ])
          }
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      report_list_data: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.$axios
        .get(
          '/report/list?page=' +
            this.paginator.page +
            '&pageSize=' +
            this.paginator.pageSize
        )
        .then(response => {
          this.loading = false
          console.log(response)

          this.report_list_data = response.data.data.report_list
          this.paginator.page = response.data.data.page
          this.paginator.pageSize = response.data.data.pageSize
          // // this.paginator.pageCount = response.data.data.pageCount
          this.paginator.totalCount = response.data.data.totalCount
          if (
            response.data.data.report_list[0].progress < 100 ||
            response.data.data.report_list[0].progress === ''
          ) {
            this.timer = setTimeout(() => {
              this.init()
            }, 5000)
          }
        })
    },
    show (index) {
      this.$Modal.info({
        title: 'User Info',
        content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
      })
    },
    remove (row) {
      this.$Modal.confirm({
        title: '重要提示',
        content: '<p>确认要删除任务吗？</p>',
        onOk: () => {
          this.$axios.delete('/report/delete/' + row.id).then(response => {
            console.log(response)
            if (response.data.message === 'success') {
              this.$Message.info('删除成功')
              this.init()
            } else {
              this.$Message.info(response.data.message)
            }
          })
        },
        onCancel: () => {
          this.$Message.info('Clicked cancel')
        }
      })
    },
    download (row) {
      this.$axios
        .get('/report/download/' + row.id, { responseType: 'arraybuffer' })
        .then(response => {
          console.log(response.data)
          console.log(row)
          if (row.report_type === 'html') {
            let blob1 = new Blob([response.data], {
              type: 'application/zip'
            })
            let aTag = document.createElement('a')
            aTag.download = row.report_name + '报告'
            aTag.href = URL.createObjectURL(blob1)
            aTag.click()
            URL.revokeObjectURL(aTag.href)
          } else {
            let blob = new Blob([response.data], {
              type: 'application/vnd.ms-excel'
            })
            let aTag = document.createElement('a')
            aTag.download = row.report_name + '报告'
            aTag.href = URL.createObjectURL(blob)
            aTag.click()
            URL.revokeObjectURL(aTag.href)
          }

          // let blob = new Blob([response.data], {
          //   type: 'application/vnd.ms-excel'
          // })
          // let objectUrl = URL.createObjectURL(blob)
          // // objectUrl.download = 'aaaa.excel'
          // window.location.href = objectUrl
          // if (response.data.message === 'success') {
          //   this.$Message.info('正在下载')
          //   this.init()
          // } else {
          //   this.$Message.info(response.data.message)
          // }
        })
        .catch(error => {
          this.$Message.error(error + '')
        })
    },
    pageChange (page) {
      this.paginator.page = page
      this.init()
    },
    pageSizeChange (pageSize) {
      this.paginator.pageSize = pageSize
      this.init()
    }
  },
  beforeDestroy () {
    this.$once('hook:beforeDestroy', () => {
      clearInterval(this.timer)
    })
  }
}
</script>
