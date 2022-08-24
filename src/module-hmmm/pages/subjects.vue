<template>
  <div class="container">
    <el-card>
      <!-- 搜索和按钮 -->
      <el-row type="flex">
        <el-col>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="学科名称">
              <el-input v-model="inp"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="onShow">清除</el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="onSearch" type="primary">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col>
          <el-row type="flex" justify="end">
            <el-button type="success" icon="el-icon-edit" @click="showAdd"
              >新增学科</el-button
            >
          </el-row>
        </el-col>
      </el-row>
      <!-- 提示条 -->
      <el-alert
        :closable="false"
        :title="`数据一共 ${this.page.counts} 条`"
        type="info"
        show-icon
      >
      </el-alert>
      <!-- 表格区域 -->
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="subjectName" label="学科名称"> </el-table-column>
        <el-table-column prop="username" label="创建者"> </el-table-column>
        <el-table-column prop="addDate" label="创建日期" width="200">
          <template slot-scope="{ row }">
            {{ row.addDate | parseTimeByString }}
          </template>
        </el-table-column>
        <el-table-column
          prop="isFrontDisplay"
          label="前台是否显示"
          :formatter="formatFormOfEmployment"
        >
        </el-table-column>
        <el-table-column prop="twoLevelDirectory" label="二级目录">
        </el-table-column>
        <el-table-column prop="tags" label="标签"> </el-table-column>
        <el-table-column prop="totals" label="题目数量"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="220">
          <template v-slot:default="data">
            <el-button type="text" size="small" @click="directorysJump(data)">
              学科分类
            </el-button>
            <el-button type="text" size="small" @click="tagsJump(data)">
              学科标签
            </el-button>
            <el-button type="text" size="small" @click="onAmend(data)">
              修改
            </el-button>
            <el-button type="text" size="small" @click="onRemove(data.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row type="flex" justify="end">
        <el-pagination
          @current-change="currentChange"
          background
          :current-page="page.page"
          :page-size="page.pagesize"
          layout="prev, pager, next,sizes,jumper"
          :total="page.counts"
          :page-sizes="[10, 20, 30, 50]"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </el-row>
    </el-card>
    <SubJects
      ref="edits"
      :visible.sync="showAddsubjects"
      @add-success="getSubJects"
      :currentabc="currentabc"
      :editsList="editsList"
    ></SubJects>
  </div>
</template>

<script>
import SubJects from "../components/subjects-add";
import { list, remove } from "@/api/hmmm/subjects.js";
export default {
  name: "subjects",
  components: {
    SubJects,
  },
  data() {
    return {
      labelName: "学科",
      tableData: [],
      inp: "",
      page: {
        page: 1,
        pagesize: 10,
      },
      showAddsubjects: false,
      currentabc: false,
      editsList: {},
      loading: true,
    };
  },

  // watch: {
  //   tableData: {
  //     immediate: true,
  //     handler(val) {
  //       console.log(this.subjectID);
  //       console.log(val.length);
  //       if (val.length > 0 && this.subjectID === null) {
  //         this.loading = false;
  //       } else if (this.subjectID !== null) {
  //         this.loading = false;
  //       }
  //     },
  //   },
  // },

  created() {
    this.getSubJects();
  },

  methods: {
    //渲染学科列表
    async getSubJects() {
      this.loading = false;
      const { data } = await list(this.page);
      // console.log(data);
      this.tableData = data.items;
      // console.log(this.tableData);
      this.page.counts = data.counts;
      this.page.pages = data.pages;
    },
    //获取当前页数并重新渲染
    currentChange(val) {
      this.page.page = val;
      this.getSubJects();
    },
    //获取当条前数并重新渲染
    handleSizeChange(val) {
      this.page.pagesize = val;
      this.getSubJects();
    },
    //对前台是否显示进行处理
    formatFormOfEmployment(row, column, cellValue, index) {
      if (cellValue === 1) return "是";
      if (cellValue === 0) return "否";
      return "未知";
    },
    //根据id删除一项学科
    async onRemove(id) {
      await this.$confirm("此操作将永久删除该学科, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
      await remove({
        id: id,
      });
      this.$message.success("删除成功");
      this.getSubJects();
    },
    //点击显示新增弹层
    async showAdd() {
      this.currentabc = false;
      this.editsList = {};
      this.showAddsubjects = true;
    },
    //点击清空
    onShow() {
      this.inp = "";
    },
    //修改学科
    async onAmend(val) {
      this.currentabc = true;
      this.showAddsubjects = true;
      this.editsList = val;
    },
    //搜索学科
    async onSearch() {
      const res = await list({
        subjectName: this.inp,
        page: this.page.page,
        pagesize: this.page.pagesize,
      });
      this.tableData = res.data.items;
    },
    //学科分类跳转
    directorysJump(val) {
      console.log(val.row);
      this.$router.push({
        path: "/subjects/directorys",
        query: val.row,
      });
    },
    //学科标签跳转
    tagsJump(val) {
      this.$router.push({
        path: "/subjects/tags",
        query: val.row,
      });
    },
  },
};
</script>

<style scoped lang="less">
.el-pagination {
  padding-top: 30px;
}
</style>