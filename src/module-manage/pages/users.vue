<template>
  <div>
    <div>
      <el-card shadow="always" style="margin: 20px">
        <el-row :gutter="20">
          <el-col :span="5"
            ><div class="grid-content bg-purple">
              <el-input placeholder="根据用户名搜索" v-model="input">
              </el-input>
            </div>
          </el-col>
          <el-col :span="1"
            ><div class="grid-content bg-purple">
              <el-button size="small" @click="clearFn">清空</el-button>
            </div></el-col
          >
          <el-col :span="1" style="margin-left: 20px"
            ><div class="grid-content bg-purple">
              <el-button type="primary" size="small" @click="searchFn"
                >搜索</el-button
              >
            </div></el-col
          >
          <el-col :span="2" :offset="14"
            ><div class="grid-content bg-purple">
              <el-button @click="userAddFn" type="success" size="small">
                <i class="el-icon-edit"></i>新增用户</el-button
              >
            </div></el-col
          >
        </el-row>
        <el-row style="margin-top: 20px">
          <el-alert
            :title="`共${this.page.counts}条记录`"
            type="info"
            show-icon
            :closable="false"
          >
          </el-alert>
        </el-row>
        <el-row style="margin-top: -30px">
          <inform
            :tableHead="tableHead"
            :tableData="taskList"
            :paginationPage="page.page"
          >
            <template v-slot:options="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                plain
                circle
                @click="onDetails(scope)"
              ></el-button>
              <el-button
                v-if="isShowButton"
                type="danger"
                icon="el-icon-delete"
                plain
                circle
                @click="onRemove(scope)"
              ></el-button>
            </template>
            <template v-slot:page>
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
            </template>
          </inform>
        </el-row>
      </el-card>
    </div>

    <userAdd
      @add-success="getuserList"
      :visible.sync="addFormVisible"
    ></userAdd>
    <userEdit :visible.sync="editFormVisible" ref="detail"></userEdit>
  </div>
</template>

<script>
import userAdd from "../components/add";
import userEdit from "../components/edit";
import inform from "../components/form/index.vue";
import { list, remove } from "@/api/base/users.js";
export default {
  data() {
    return {
      // data: {},
      isShowButton: false,
      input: "",
      addFormVisible: false,
      editFormVisible: false,
      pageTitle: "新增用户",
      page: {
        page: 1,
        pagesize: 10,
        counts: 0,
        pages: 0,
      },
      taskList: [],
      tableHead: [
        { column_name: "email", column_comment: "邮箱" },
        { column_name: "phone", column_comment: "联系电话" },
        { column_name: "username", column_comment: "用户名" },
        { column_name: "permission_group_title", column_comment: "权限组名称" },
        { column_name: "role", column_comment: "角色" },
      ],
    };
  },

  components: {
    userAdd,
    inform,
    userEdit,
  },

  created() {
    this.getuserList();
  },

  methods: {
    userAddFn() {
      this.addFormVisible = true;
    },
    async getuserList() {
      const res = await list(this.page);
      console.log(res);
      this.taskList = res.data.list;
      this.page.counts = res.data.counts;
      this.page.pages = res.data.pages;
      if (this.taskList.length > 1) {
        return (this.isShowButton = true);
      }
    },
    clearFn() {
      this.input = "";
      this.getuserList();
    },
    async searchFn() {
      const res = await list({
        page: this.page.page,
        pagesize: this.page.pagesize,
        username: this.input,
      });
      console.log(res);
      this.taskList = res.data.list;
    },
    currentChange(val) {
      this.page.page = val;
      this.getuserList();
    },
    handleSizeChange(val) {
      this.page.pagesize = val;
      this.getuserList();
    },
    async onDetails(val) {
      // const id = val.scope.row.id;
      console.log(val);
      this.editFormVisible = true;
      const data = val.scope.row;
      console.log(this.$refs.detail);
      this.$refs.detail.getUserDetail(data);
    },
    async onRemove(val) {
      const data = val.scope.row;
      await remove(data);
      this.$message.success("删除成功");
      this.getuserList();
    },
  },
};
</script>

<style scoped lang="less"></style>
