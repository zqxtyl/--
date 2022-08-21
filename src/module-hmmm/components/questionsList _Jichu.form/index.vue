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
         <el-button type="success" icon="el-icon-edit" circle :plain="true" @click="goToNew(scope.row)"></el-button>
         <el-button type="danger" icon="el-icon-delete" circle :plain="true" @click="onRemove(scope.row)"></el-button>
         <el-button type="warning" icon="el-icon-check" circle :plain="true" @click="onHandpick(scope.row)"></el-button>
  
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页插槽 -->
    <slot name="page" class="page"></slot>

    <!-- 点击弹框 -->
    <detailDialog :visible.sync="dialogTableVisible"   :id="id"/>

    <!-- 点击删除显示弹窗 -->

    <!-- 基础题库的列表 -->

  </div>
</template>

<script>
import {  remove, choiceAdd } from '@/api/hmmm/questions'
import question from '@/constant/questions'
import detailDialog from './questionDialog.vue'
export default {
  name:'questionList',
  data() {
    return {
      detailList:{},
      dialogTableVisible:false,
      deleteDialog: true,
      checkboxNumber:[],
      id:0
      
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
    this.id = val.id;
    
    this.dialogTableVisible = true;
    },
    //删除当前行
   async onRemove(val) {
    try {
      await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })   
         const res = await remove({
    id:val.id
   })
   console.log(res);
    
    this.$emit('updateList')  
    } catch (error) {
      console.log(error);
    }
   
    },
    // 加入精选
   async onHandpick(val) {
    try {
      await this.$confirm('此操作将该题目加入精选, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '加入精选成功!'
          });
        })   
         const res = await choiceAdd({
    id:val.id,
    choiceState:1
   })
   console.log(res);
    
    this.$emit('updateList')  
    } catch (error) {
      console.log(error);
    }
    },
    // 跳转到试题录入
    goToNew(val) {
      console.log(val);
      this.$router.push({
        name:'questions-new',
        query:{
          id:val.id
        }
      });
    }

  },
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
  .page {
    margin-top: 10px;
  }
}
</style>
