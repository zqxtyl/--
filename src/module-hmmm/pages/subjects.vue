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
                <el-button @click="onSearch" type="primary"
                  >搜索</el-button
                >
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
      <el-table :data="tableData" style="width: 100%">
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
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              @click="$router.push('directorys')"
            >
              学科分类
            </el-button>
            <el-button type="text" size="small" @click="$router.push('tags')">
              学科标签
            </el-button>
            <el-button type="text" size="small" @click="onAmend(row.id)">
              修改
            </el-button>
            <el-button type="text" size="small" @click="onRemove(row.id)">
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
      :visible.sync="showAddsubjects"
      @add-success="getSubJects"
    ></SubJects>
  </div>
</template>

<script>
import SubJects from "../components/subjects-add";
import { detail, list, remove, simple } from "@/api/hmmm/subjects.js";
export default {
  name: "subjects",
  components: {
    SubJects,
  },
  data() {
    return {
      tableData: [],
      inp: "",
      page: {
        page: 1,
        pagesize: 10,
        counts: 0,
        pages: 0,
      },
      showAddsubjects: false,
    };
  },

  created() {
    this.getSubJects();
  },

  methods: {
    //渲染学科列表
    async getSubJects() {
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
    showAdd() {
      this.showAddsubjects = true;
    },
    //点击清空
    onShow() {
      this.inp = "";
    },
    //修改学科
    async onAmend(val) {
      this.showAddsubjects = true;
      console.log(val);
    },
    //搜索学科
    async onSearch() {
    this.subjectName = this.inp
    const res = await list(this.subjectName, this.page.page, this.page.pagesize)
    console.log(this.inp);
    console.log(this.page);
    console.log(res);
    },
  },
};
</script>

<style scoped lang="less">
.el-pagination {
  padding-top: 30px;
}
</style>
