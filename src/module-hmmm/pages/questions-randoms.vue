<template>
  <div class="container">
    <el-card class="box-card">
      <el-row type="flex" class="title">
        <el-col
          ><span class="header"
            ><span class="keyword">关键字：</span><el-input
              v-model="keyword"
              placeholder="请输入内容"
              class="keyword"
            ></el-input></span
        ></el-col>
        <el-col>
          <el-row type="flex" justify="end">
            <el-button @click="keyword = ''">清除</el-button>
            <el-button type="primary" @click="searchList">搜索</el-button>
          </el-row>
        </el-col>
      </el-row>
      <!-- 警告文案 -->
      <el-alert
        :title="`数据一共 ${counts} 条`"
        type="info"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 列表 -->
      <el-table
        class="table"
        :data="randonList"
        stripe
        style="width: 100%; text-align: center"
      >
        <el-table-column prop="id" label="编号"> </el-table-column>
        <el-table-column
          prop="questionType"
          label="题型"
          :formatter="formQuestionType"
        >
        </el-table-column>
        <el-table-column label="题目编号" width="240px">
          <template slot-scope="{ row }">
            <div v-for="item in row.questionIDs" :key="item.number" class="a" @click="detailList(item.id)">
              <a href="#"> {{ item.number }}</a>
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
          <template slot-scope="{ row }">
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              :plain="true"
              @click="removeRandoms(row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-row type="flex" justify="end">
        <el-pagination
          background
          @size-change="onPageSizeChange"
          @current-change="onPageChange"
          :current-page="Number(pages.page)"
          :total="randonList.counts"
          :page-size="Number(pages.size)"
          :page-sizes="[5, 10, 20, 50]"
          layout="prev, pager, next,sizes, jumper"
        >
        </el-pagination>
      </el-row>
      <!-- 弹框 -->
      <detailDialog :visible.sync="dialogTableVisible" :id="id"/>
    </el-card>
  </div>
</template>

<script>
import { randoms, removeRandoms } from "../../api/hmmm/questions";
import detailDialog from '../components/questionsList _Jichu.form/questionDialog.vue'
import question from "@/constant/questions";
export default {
  data() {
    return {
      keyword: "",
      dialogTableVisible:false,
      randonList: [],
      pages: {
        page: 1,
        size: 10,
      },
      counts: 1,
      total: 1,
      detailClickList:{},
      
      id:0
    };
  },
  components: {
    detailDialog
  },
  created() {
    this.randomsList();
  },
  methods: {
    // 获取列表
    async randomsList() {
      const { data } = await randoms({
        page: this.pages.page,
        pagesize: this.pages.size,
        keyword:this.keyword
      });
      // console.log(data);
      this.randonList = data.items;
      this.counts = data.counts;
      console.log(this.randonList);
    },
    // 	每页条数 改变
    async onPageSizeChange(val) {
      console.log(val);
      await this.$nextTick();
      this.pages.size = val;
      this.randomsList();
    },
    // 改变页码时
    onPageChange(val) {
      console.log(val);
      this.pages.page = val;
      this.randomsList();
    },
    // 修改题型
    formQuestionType(row, column, cellValue, index) {
      const findItem = question.questionType.find(
        (item) => item.id == cellValue
      );
      return findItem ? findItem.value : "未知";
    },
    // 删除
    //删除组题
    async removeRandoms({ id }) {
      console.log(id);
      await this.$confirm("此操作将永久删除该组题,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
      await removeRandoms({ id });
      this.$message.success("删除成功");
      this.randomsList();
    },
    // 搜索
    searchList() {
      this.randomsList()
    },
    // 点击详情
   async detailList(id) {
      console.log(id);
    this.id=id
      
      this.dialogTableVisible = true
    }
  },
};
</script>

<style scoped lang="less">
.header {
  display: flex;
  height: 32px;
  line-height: 32px;
}
.input {
  width: 218px;
  height: 32px;
}
.title {
  margin-bottom: 25px;
}
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
}
.a {
  color: blue;
}
.keyword{
  width: 80px;
}
/deep/.el-input__inner{
  width: 360px;
}
</style>
