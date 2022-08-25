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
                <i class="el-icon-edit"></i>新增权限组</el-button
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
            :tableData="permissionsList"
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

    <permissionAdd
      :visible.sync="dialogFormVisible"
      text="新增"
      pageTitle="权限"
    ></permissionAdd>
    <permissionEdit
      :visible.sync="editFormVisible"
      ref="detail"
    ></permissionEdit>
  </div>
</template>

<script>
import permissionAdd from "../components/permissions-add.vue";
import permissionEdit from "../components/edit";
import inform from "../components/formper/index.vue";
import { list, remove } from "@/api/base/permissions.js";
export default {
  data() {
    return {
      isShowButton: false,
      input: "",
      dialogFormVisible: false,
      editFormVisible: false,
      pageTitle: "新增权限组",
      page: {
        page: 1,
        pagesize: 10,
        counts: 0,
        pages: 0,
      },
      permissionsList: [],
      tableHead: [
        { column_name: "title", column_comment: "用户名" },
        { column_name: "create_date", column_comment: "日期" },
      ],
    };
  },

  components: {
    permissionAdd,
    inform,
    permissionEdit,
  },

  created() {
    this.getPermissionsList();
  },

  methods: {
    userAddFn() {
      this.dialogFormVisible = true;
    },
    async getPermissionsList() {
      const res = await list(this.page);
      console.log(res);
      this.permissionsList = res.data.list;
      this.page.counts = res.data.counts;
      this.page.pages = res.data.pages;
      if (this.permissionsList.length > 1) {
        return (this.isShowButton = true);
      }
    },
    clearFn() {
      this.input = "";
      this.getPermissionsList();
    },
    async searchFn() {
      const res = await list({
        page: this.page.page,
        pagesize: this.page.pagesize,
        username: this.input,
      });
      console.log(res);
      this.permissionsList = res.data.list;
    },
    currentChange(val) {
      this.page.page = val;
      this.getPermissionsList();
    },
    handleSizeChange(val) {
      this.page.pagesize = val;
      this.getPermissionsList();
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
      this.getPermissionsList();
    },
  },
};
</script>

<style scoped lang="less"></style>
