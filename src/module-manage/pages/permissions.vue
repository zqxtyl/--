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
  <div class="app">
    <div class="header">
      <el-form :inline="true" class="title">
        <el-form-item>
          <el-input
            v-model="page.keyword"
            style="width: 300px"
            placeholder="根据用户名搜索"
          />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" @click="remove">清除</el-button>
          <el-button size="mini" type="primary" @click="onSearch"
            >搜索</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            style="margin-left: 750px"
            @click="addFn"
            >新增用户</el-button
          >
        </el-form-item>
      </el-form>
      <div class="iconf">
        <div class="titleicon">
          <i class="el-icon-info"></i>共{{ page.counts }}条数据
        </div>
      </div>
      <el-table
        ref="multipleTable"
        :data="List"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column type="selection" width="350"> </el-table-column>
        <el-table-column prop="title" label="用户名" width="300">
        </el-table-column>
        <el-table-column label="日期" sortable show-overflow-tooltip>
          <template v-slot="{ row }">{{
            row.create_date | parseTimeByString
          }}</template>
        </el-table-column>
        <el-table-column width="200" label="操作">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="isEdit(row)"
            ></el-button>
            <el-button
              type="danger"
              @click="deleteFn(row)"
              icon="el-icon-delete"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pageIndex">
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
    </div>
    <!-- 新建编辑 -->
    <!-- <el-dialog :visible="isShow">
      <el-tree
        :data="shux"
        show-checkbox
        default-expand-all
        :default-expanded-keys="[0]"
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
        :default-checked-keys="formBase.permissions"
      >
      </el-tree>
    </el-dialog> -->
    <permissionsAdd
      :text="user.text"
      :pageTitle="user.pageTitle"
      @newDataes="newDataes"
      ref="add"
    />
    <permissionsAdd
      :text="users.text"
      :pageTitle="users.pageTitle"
      ref="isedit"
      @newDataes="newDataIsedit"
    />

  </div>
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
=======
import { list, remove, add, detail } from "@/api/base/permissions";
import { list as newList } from "@/api/base/menus";
import permissionsAdd from "../components/permissionAdd.vue";
export default {
  data() {
    return {
      List: [],
      page: {
        page: 1,
        pagesize: 10,
        keyword: "",
        counts: 0,
      },
      shux: [],
      defaultProps: {
        label: "title",
        children: "childs",
      },
      isShow: true,
      user: {
        text: "新增",
        pageTitle: "权限组",
      },
      users: {
        text: "编辑",
        pageTitle: "权限组",
      },
    };
  },

  created() {
    this.getList();
    this.getSXList();
  },

  methods: {
    async getList() {
      const { data } = await list(this.page);
      console.log(data);
      this.List = data.list;
      this.page.counts = data.counts;
    },
    currentChange(val) {
      this.page.page = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.page.pagesize = val;
      this.getList();
    },
    remove() {
      this.page.keyword = "";
    },
    async onSearch() {
      const { data } = await list({
        title: this.page.keyword,
      });
      this.List = data.list;
      this.page.counts = data.counts;
      // console.log(data);
    },
    async deleteFn(obj) {
      await remove({
        id: obj.id,
      });
      this.$message.success("删除成功");
      this.getList();
    },
    async getSXList() {
      const { data } = await newList();
      // console.log(data);
      this.shux = data;
    },
    addFn() {
      this.$refs.add.dialogFormVisible = true;
    },
    //添加
    async newDataes(val) {
      this.$message.success("添加成功");
      this.$refs.add.dialogFormVisible = false;
      this.getList();
    },
    async isEdit(obj) {
      // console.log(obj);
      const { data } = await detail({
        id: obj.id,
      });
      console.log(data);
      this.$refs.isedit.formBase = data;
      this.$refs.isedit.dialogFormVisible = true;
    },
    newDataIsedit(val) {
      this.$message.success("修改成功");
      this.$refs.isedit.dialogFormVisible = false;
      this.getList();
    },
  },
  components: {
    permissionsAdd,
  },
};
</script>

<style scoped lang="less">
.app {
  background-color: #f0f2f5;
  padding-left: 10px;
  padding-right: 10px;
  .header {
    background-color: #fff;
    .title {
      margin-top: 15px;
      padding-top: 15px;
      padding-left: 5px;
    }
    .iconf {
      background-color: #fff;
      width: 1300px;
      height: 35px;
      .titleicon {
        margin-left: 15px;
        padding: 10px;
        background-color: #f4f4f5;
        color: #909399;
      }
    }
  }
  .pageIndex {
    margin-left: 800px;
  }
}
</style>
>>>>>>> task
