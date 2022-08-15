<template>
  <el-card>
    <!-- 搜索和按钮 -->
    <el-row type="flex">
      <el-col>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="学科名称">
            <el-input v-model="inpu"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select placeholder="请选择">
              <el-option label="启用" value="shanghai"></el-option>
              <el-option label="禁用" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="onShow">清除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col>
        <el-row type="flex" justify="end">
          <el-button type="success" icon="el-icon-edit">新增目录</el-button>
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
      <el-table-column type="index" label="序号" width="50"> </el-table-column>
      <el-table-column prop="subjectName" label="所属学科"> </el-table-column>
      <el-table-column prop="directoryName" label="目录名称"> </el-table-column>
      <el-table-column prop="username" label="创建者"> </el-table-column>
      <el-table-column prop="addDate" label="创建日期" width="200">
        <template slot-scope="{ row }">
          {{ row.addDate | parseTimeByString }}
        </template>
      </el-table-column>
      <el-table-column prop="totals" label="面试题数量"> </el-table-column>
      <el-table-column
        prop="state"
        label="状态"
        :formatter="formatFormOfEmployment"
      >
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="220">
        <template slot-scope="{ row }">
          <el-button type="text" size="small"> 禁用 </el-button>
          <el-button type="text" size="small"> 修改 </el-button>
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
</template>

<script>
import { list, remove } from "@/api/hmmm/directorys.js";
export default {
  name: "subjects",
  data() {
    return {
      tableData: [],
      inpu: '',
      page: {
        page: 1,
        pagesize: 10,
        counts: 0,
        pages: 0,
      },
    };
  },

  created() {
    this.getDirectorys();
  },

  methods: {
    //渲染目录列表
    async getDirectorys() {
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
      this.getDirectorys();
    },
    //获取当条前数并重新渲染
    handleSizeChange(val) {
      this.page.pagesize = val;
      this.getDirectorys();
    },
    //对后台返回的状态数据进行处理
    formatFormOfEmployment(row, column, cellValue, index) {
      if (cellValue === 1) return "已启用";
      if (cellValue === 0) return "已禁用";
      return "未知";
    },
    //根据id删除一项目录
    async onRemove(id) {
      await this.$confirm("此操作将永久删除该目录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
      await remove({ id });
      this.$message.success("删除成功");
      this.getSubJects();
    },
    //点击清空
    onShow() {
      this.inpu = "";
    },
  },
};
</script>

<style scoped lang="less">
.el-pagination {
  padding-top: 30px;
}
</style>
