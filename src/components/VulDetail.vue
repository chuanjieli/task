
<style scoped>
.expand-row {
  margin-bottom: 16px;
}
ul,
li {
  list-style: none;
  margin: 10px;
  word-wrap: break-word;
  word-break: normal;
}
</style>
<template>
  <div>
    <Row class="expand-row">
      <Col span="24">
        <Card>
          <h4>{{title}}细节</h4>
          <ul>
            <li v-for="(item,i) in row" :key="i">{{i + ' : ' + item }}</li>
          </ul>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  props: {
    row: Object,
    title: String
  }
}
</script>
