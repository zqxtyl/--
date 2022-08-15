<template>
  <div class="form">
    <!-- 基础题库的列表 -->
    <slot />
    <el-table
      class="table"
      :data="tableData"
      stripe
      style="width: 100%; text-align: center"
    >
      <el-table-column
        :prop="item.column_name"
        :label="item.column_comment"
        v-for="(item, index) in tableHead"
        :key="index"
      >
      </el-table-column>
      <el-table-column prop="questionType" label="题型" :formatter="formQuestionType" > 
      </el-table-column>
      
      <el-table-column prop="question" label="题干"> 
        <template slot-scope="{ row }">
              <p v-html="row.question"></p>
            </template>
         </el-table-column>
      
      <el-table-column prop="addDate" label="录入时间">
        <template slot-scope="{ row }">
              {{ row.addDate | formatTimeDay }}
            </template>
         </el-table-column>
      <el-table-column prop="difficulty" label="难度" :formatter="formDifficulty"> </el-table-column>

      <!-- 操作区域 -->
      <el-table-column fixed="right" label="操作" width="200px">
        <template slot-scope="scope">
          
         <el-button type="primary" icon="el-icon-view" circle :plain="true" @click="onDetails(scope.row)"></el-button>
         <el-button type="success" icon="el-icon-edit" circle :plain="true"></el-button>
         <el-button type="danger" icon="el-icon-delete" circle :plain="true"></el-button>
         <el-button type="warning" icon="el-icon-check" circle :plain="true"></el-button>
  
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页插槽 -->
    <slot name="page" class="page"></slot>

    <!-- 点击弹框 -->
    <detailDialog :visible.sync="dialogTableVisible" :detailList="detailList"/>
    <!-- 基础题库的列表 -->
  </div>
</template>

<script>
import { detail } from '@/api/hmmm/questions'
import question from '@/constant/questions'
import detailDialog from './questionDialog.vue'
export default {
  name:'questionList',
  data() {
    return {
      detailList:{},
      dialogTableVisible:false,
    };
  },
  components:{
    detailDialog
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

  created() {},

  methods: {
    // 修改难度 
    formDifficulty(row, column, cellValue, index) {
      const findItem =  question.difficulty.find(item=> item.id == cellValue)
      return findItem ? findItem.value : '未知'
    },
    // 修改题型
    formQuestionType(row, column, cellValue, index) {
       const findItem =  question.questionType.find(item=> item.id == cellValue)
      return findItem ? findItem.value : '未知'
    },

    // 点击按钮查看详情
   async onDetails(val) {
    console.log(val.id);
    const res = await detail({
      id:val.id
    })
    this.detailList = res.data
    console.log(this.detailList);
    this.dialogTableVisible = true;
    }

  },
};
</script>

<style scoped lang="less">
.form {
  margin-top: 30px;
  padding: 20px;
  width: 100%;
  height: 800px;
  background-color: #fff;
  .table {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .page {
    margin-top: 10px;
  }
}
</style>
