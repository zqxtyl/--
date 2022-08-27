<template>
  <div class="app">
    负责人：张千禧
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
</template>

<script>
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
