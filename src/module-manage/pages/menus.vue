<template>
  <div class="app">
    负责人：张千禧
    <div class="header">
      <div style="margin-left: 770px">
        <el-button icon="el-icon-edit" size="mini" type="success" @click="addFn"
          >添加菜单</el-button
        >
      </div>
      <TableTree
        @removeUser="removeUser"
        :data="List"
        :columns="columns"
        :defaultExpandAll="true"
        :treeStructure="true"
        @handleUpdate="handleUpdate"
      />

      <menuAdd ref="opPud" 
      :text="user.text" 
      :pageTitle="user.pageTitle" 
      @handleCloseModal='handleCloseModal'
      />
    </div>
  </div>
</template>

<script>
import { list, remove } from "@/api/base/menus";
import menuAdd from "@/module-manage/components/menuAdd";
import TableTree from "../components/TableTree.vue";
export default {
  data() {
    return {
      List: [],
      newList: [],
      columns: [
        { prop: "title", text: "标题", value: "title" },
        { text: "权限", prop: "code", value: "code" },
      ],
      user: { text: "新增", pageTitle: "权限组" },
    };
  },

  created() {
    this.getList();
  },

  methods: {
    async getList() {
      const { data } = await list();
      // console.log(data);
      this.List = data;
    },
    //删除
    async removeUser(obj) {
      // console.log(user.row.id);
      await this.$confirm("确定删除？");
      await remove({
        id: obj.row.id,
      });
      this.$message.success("删除成功");
      this.getList();
    },
    addFn() {
      this.user.text = "新增";
      this.$refs.opPud.dialogFormV();
      this.$refs.opPud.handleResetForm()
    },
    handleUpdate({ id }) {
      this.user.text = "编辑";
      this.$refs.opPud.hanldeEditForm(id);
      this.$refs.opPud.dialogFormV();
    },
    handleCloseModal(){
      this.$refs.opPud.dialogFormH()
      this.$refs.opPud.handleResetForm();
      this.getList();
    }
  },
  components: {
    menuAdd,
    TableTree,
  },
};
</script>

<style scoped lang="less">
.app {
  background-color: #f0f2f5;
  padding-left: 15px;
  padding-right: 15px;
  .header {
    padding: 15px;
    background-color: #fff;
  }
}
</style>
