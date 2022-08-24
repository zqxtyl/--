<template>
  <div class="container">
    <el-card>
      <!-- 跳转后的面包屑 -->
      <el-breadcrumb
        separator=">"
        class="el-card__header"
        v-if="$route?.query?.id"
      >
        <el-breadcrumb-item :to="{ path: '/subjects/list' }"
          ><span style="color: #000">学科管理</span></el-breadcrumb-item
        >
        <el-breadcrumb-item>{{ $route.query.subjectName }}</el-breadcrumb-item>
        <el-breadcrumb-item>目录</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 搜索和按钮 -->
      <el-row type="flex">
        <el-col>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="学科名称">
              <el-input v-model="inpu"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="states" placeholder="请选择">
                <el-option
                  v-for="item in OptionsStatus"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                ></el-option>
                <!-- <el-option label="启用" value="shanghai"></el-option>
              <el-option label="禁用" value="beijing"></el-option> -->
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button @click="onShow">清除</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="directorysSearch"
                >搜索</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
        <el-col>
          <el-row type="flex" justify="end">
            <el-button
              type="text"
              icon="el-icon-back"
              v-if="isShowBackBtn"
              @click="$router.push('/subjects/list')"
              >返回学科</el-button
            >
            <el-button type="success" icon="el-icon-edit" @click="showAdd"
              >新增目录</el-button
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
        <el-table-column prop="subjectName" label="所属学科"> </el-table-column>
        <el-table-column prop="directoryName" label="目录名称">
        </el-table-column>
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
            <el-button type="text" size="small" @click="changeState(row)">
              {{ ["启用", "禁用"][row.state] }}
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="onAmend(row)"
              :disabled="row.state === 1"
            >
              修改
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="onRemove(row.id)"
              :disabled="row.state === 1 || row.totals !== 0"
            >
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
    <!-- 弹层区域 -->
    <Directorys
      ref="edits"
      :visible.sync="showAddDirectorys"
      @add-success="getDirectorys"
      :currentabc="currentabc"
      :editsList="editsList"
      :subjectID="page.subjectID"
    ></Directorys>
  </div>
</template>

<script>
import { list, remove, changeState } from "@/api/hmmm/directorys.js";
import baseApi from "@/api/base/baseApi";
import Directorys from "../components/directorys-add";
export default {
  name: "directorys",
  data() {
    return {
      labelName: "目录",
      isFromSubject: false,
      tableData: [],
      inpu: "",
      states: "",
      OptionsStatus: baseApi.status,
      page: {
        page: 1,
        pagesize: 10,
        directoryName: "",
        subjectID: null,
        states: null,
      },
      showAddDirectorys: false,
      currentabc: false,
      editsList: {},
    };
  },

  components: {
    Directorys,
  },

  computed: {
    //控制返回学科的显示与隐藏
    isShowBackBtn() {
      return this.labelName !== "学科" && this.isFromSubject === true;
    },
  },

  watch: {
    "page.subjectID"(val) {
      if (val === undefined) {
        this.isFromSubject = false;
      } else {
        this.isFromSubject = true;
      }
    },
  },

  created() {
    this.page.subjectID = Number(this.$route?.query?.id);
    // console.log(this.$route.query);
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
    //目录状态
    async changeState(val) {
      console.log(val);
      val.state = val.state === 0 ? 1 : 0;
      await changeState({
        id: val.id,
        state: val.state,
      });
      this.$message.success("修改成功");
      this.getDirectorys();
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
      this.getDirectorys();
    },
    //点击清空
    onShow() {
      this.inpu = "";
      this.states = "";
    },
    //搜索事件
    directorysSearch() {
      this.page.directoryName = this.inpu;
      if (this.states !== "") {
        this.page.states = this.states;
      } else {
        this.page.states = null;
      }
      this.page.page = 1;
      this.page.pageSize = 10;
      this.getDirectorys();
    },
    //点击显示新增弹层
    showAdd() {
      this.currentabc = false;
      this.editsList = {};
      this.showAddDirectorys = true;
    },
    //修改学科
    onAmend(val) {
      this.currentabc = true;
      this.showAddDirectorys = true;
      this.editsList = val;
    },
  },
};
</script>

<style scoped lang="scss">
.el-pagination {
  padding-top: 30px;
}
.el-card__header {
  padding: 18px 20px;
  border-bottom: 1px solid #ebeef5;
  -webkit-box-sizing: border-box;
}
</style>