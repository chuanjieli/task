<template>
  <div style="height:calc(100vh - 84px)">
    <Row :gutter="16">
      <Col span="24">
        <Card :bordered="false">
          <p slot="title">任务列表</p>
          <Table border :columns="task_list" :data="task_list_data" :loading="loading">
            <template slot-scope="{ row }" slot="name">
              <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row }" slot="action">
              <!-- <Button type="primary" size="small" style="margin-right: 5px" @click="start(row)">开始</Button> -->
              <Button
                type="primary"
                size="small"
                :disabled="row.state == '任务完成' || row.state == '任务撤销' || row.state == '任务异常终止'"
                style="margin-right: 5px"
                @click="resume(row)"
              >{{row.state == '任务暂停'? '继续' : '暂停'}}</Button>
              <Button
                :disabled="row.state == '任务撤销' || row.state ==  '任务完成' || row.state == '任务异常终止'"
                type="primary"
                size="small"
                style="margin-right: 5px"
                @click="revoke(row)"
              >撤销</Button>
              <Button
                type="primary"
                size="small"
                style="margin-right: 5px"
                :to="'/tasklist/taskdetail/'+row.id"
              >详情</Button>
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
  created () {
    this.init()
  },
  data () {
    return {
      title: '继续',
      timer: null,
      loading: true,
      paginator: {
        page: 1,
        pageSize: 10,
        totalCount: 10
      },
      task_list: [
        {
          title: '任务ID',
          key: 'id',
          align: 'center',
          width: 75
        },
        {
          title: '任务名称',
          key: 'name',
          align: 'center',
          ellipsis: true,
          tooltip: true,
          width: 130
        },
        {
          title: '扫描模式',
          key: 'mode',
          align: 'center',
          minWidth: 140
        },
        {
          title: '优先级',
          key: 'priority',
          align: 'center',
          width: 75
        },
        {
          title: '状态',
          key: 'state',
          align: 'center',
          width: 100
        },
        {
          title: '进度',
          key: 'progress',
          width: 200,
          render: (h, params) => {
            let obj = {
              任务完成: 'success',
              任务异常终止: 'wrong',
              任务撤销: 'wrong',
              任务运行中: 'active',
              任务暂停: 'normal'
            }
            let status = obj[params.row.state]
            return h('div', [
              h('Progress', {
                props: {
                  status: status,
                  percent: params.row.progress
                }
              })
            ])
          }
        },
        {
          title: '创建时间',
          key: 'date_created',
          align: 'center',
          width: 100
        },
        {
          title: '结束时间',
          key: 'date_finished',
          align: 'center',
          width: 100
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          width: 220
        }
      ],
      task_list_data: []
    }
  },
  methods: {
    init () {
      this.$axios
        .get(
          '/task/list?brief=1&page=' +
            this.paginator.page +
            '&pageSize=' +
            this.paginator.pageSize
        )
        .then(response => {
          this.loading = false
          this.task_list_data = response.data.data.task_list
          this.paginator.page = response.data.data.page
          this.paginator.pageSize = response.data.data.pageSize
          this.paginator.pageCount = response.data.data.pageCount
          this.paginator.totalCount = response.data.data.totalCount
          let data = response.data.data.task_list
          let flag = false
          for (let i = 0; i < data.length; i++) {
            if (data[i].state === '任务运行中') {
              flag = true
            }
          }
          if (flag) {
            this.timer = setTimeout(() => {
              this.init()
            }, 3000)
          } else {
            clearTimeout(this.timer)
          }
        })
    },
    resume (row) {
      if (row.state === '任务暂停') {
        this.$axios.put('/task/resume/' + row.id).then(response => {
          console.log(response)
          if (response.data.message === 'success') {
            this.$Message.info('继续任务')
            this.init()
          } else {
            this.$Message.info(response.data.message)
          }
        })
      } else {
        this.$axios.put('/task/pause/' + row.id).then(response => {
          console.log(response)
          if (response.data.message === 'success') {
            this.$Message.info('已暂停任务')
            this.init()
          } else {
            this.$Message.info(response.data.message)
          }
        })
      }
    },
    revoke (row) {
      this.$Modal.confirm({
        title: '重要提示',
        content: '<p>确认要撤销任务吗？</p>',
        onOk: () => {
          this.$axios.put('/task/revoke/' + row.id).then(response => {
            console.log(response)
            if (response.data.message === 'success') {
              this.$Message.info('任务已撤销')
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
    show (row) {
      this.$router.push({ path: `/taskdetail/${row.id}` })
    },
    remove (row) {
      this.$Modal.confirm({
        title: '重要提示',
        content: '<p>确认要删除任务吗？</p>',
        onOk: () => {
          this.$axios.delete('/task/delete/' + row.id).then(response => {
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
      clearTimeout(this.timer)
    })
  }
}
</script>
