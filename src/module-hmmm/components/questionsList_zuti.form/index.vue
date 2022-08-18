<template>
  <div class="form">
    <slot />
    <el-table
      class="table"
      :data="tableData"
      stripe
      style="width: 100%; text-align: center"
    >
      <el-table-column prop="id"  label="编号"> </el-table-column>
      <el-table-column prop="questionType" label="题型"> </el-table-column>
      <el-table-column label="题目编号" width="240px"> 
       <template slot-scope="{ row }">
            <div
             v-for="item in row.questionIDs"
              :key="item.number"
              class="a"
            >
            <a href="#"  > {{ item.number }}</a>
            </div>
          </template>
      </el-table-column>
      <el-table-column prop="addTime" label="录入时间"> </el-table-column>
      <el-table-column prop="totalSeconds" label="答题时间(s)">
      </el-table-column>
      <el-table-column prop="accuracyRate" label="正确率(%)">
      </el-table-column>
      <el-table-column prop="userName" label="录入人"> </el-table-column>

      <!-- 操作区域 -->
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <slot name="options" :scope="scope"></slot>
          <el-button type="danger" icon="el-icon-delete" circle plain="true"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页插槽 -->
    <slot name="page" class="page"></slot>
  </div>
</template>

<script>
export default {
  name:"randomList",
  data() {
    return {};
  },
  props: {
    tableData: {
      type: Array,
      required: true,
    },
    tableHead: {
      type: Array,
    },
  },

  created() {
    // console.log(this.tableData);
  },

  methods: {},
};
</script>

<style scoped lang="less">
.form {
  margin-top: 30px;
  padding: 20px;
  width: 100%;
  height: 100%;
  background-color: #fff;
  .table {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .a{
    color: blue;
  }
}
</style>
