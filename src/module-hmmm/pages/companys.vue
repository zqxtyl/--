<template>
  <div class="container">
    <div class="headers">
      <!-- 头部 -->
      <el-form :model="formBase" :inline="true" class="title">
        <el-form-item>
          <span>标签名称</span
          ><el-input
            style="width: 250px; margin-left: 15px"
            v-model="formBase.tags"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <span>城市</span
          ><el-select
            v-model="formBase.province"
            style="width: 250px; margin-left: 15px"
            placeholder="请选择"
            @keyup.enter="handleFilter"
            @change="handleProvince"
          >
            <el-option
              v-for="item in citySelect.province"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span>地区</span
          ><el-select
            v-model="formBase.city"
            style="width: 250px; margin-left: 15px"
            placeholder="请选择"
            @keyup.enter="handleFilter"
          >
            <el-option
              v-for="item in citySelect.cityDate"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span>企业简称</span
          ><el-input
            style="width: 250px; margin-left: 15px"
            v-model="formBase.shortName"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 25px">
          <span>状态</span
          ><el-select
            v-model="formBase.state"
            style="width: 250px; margin-left: 15px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 15px">
          <el-button size="mini" @click="removeFn">清除</el-button>
          <el-button size="mini" type="primary" @click="SearchFn"
            >搜索</el-button
          >
        </el-form-item>
        <el-form-item style="margin-left: 685px">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
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
      <!-- 表格 -->
      <el-table :data="List" v-loading="loading">
        <el-table-column label="序号" prop="id"></el-table-column>
        <el-table-column label="企业编号" prop="number"></el-table-column>
        <el-table-column label="企业简称" prop="shortName"></el-table-column>
        <el-table-column label="标签" prop="tags"></el-table-column>
        <el-table-column label="创建者" prop="creatorID"></el-table-column>
        <el-table-column label="创建日期">
          <template v-slot="{ row }">
            {{ row.addDate | parseTimeByString }}
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remarks"></el-table-column>
        <el-table-column label="状态" prop="state">
          <template v-slot="{ row }">
            {{ row.state ? "启用" : "禁用" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="isEdit(row)"
            ></el-button>
            <el-button
              :type="row.state ? 'warning' : 'success'"
              :icon="row.state ? 'el-icon-close' : 'el-icon-check'"
              @click="change(row)"
              circle
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="remove(row)"
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
    <!-- 组件 -->
    <AddCompanys
      :titleInfo="titleInfo"
      :formBase="formBase"
      :dialogFormVisible.sync="dialogFormVisible"
      @newDataes="newDataes"
    />
  </div>
</template>

<script>
import { list, detail, remove, changeStatus } from "@/api/hmmm/companys";
import { status } from "@/api/hmmm/constants";
import { provinces, citys } from "@/api/hmmm/citys.js";
import AddCompanys from "../components/addCompany.vue";
export default {
  name: "business",
  data() {
    return {
      formBase: {
        page: 1,
        pagesize: 10,
        tags: "",
        shortName: "",
        province: "",
        city: "",
        state: "",
        isFamous: 0,
      },
      List: [],
      page: {
        page: 1,
        pagesize: 10,
        counts: 0,
        pages: 0,
      },
      status,
      citySelect: {
        province: [],
        cityDate: [],
      },
      titleInfo: { text: "创建", pageTitle: "用户" },
      formBase: {},
      dialogFormVisible: false,
      loading: false,
      user: {},
    };
  },

  created() {
    this.getList();
    this.getCityData();
  },

  methods: {
    async getList() {
      this.loading = true;
      const { data } = await list(this.page);
      // console.log(data);
      this.List = data.items;
      this.page.counts = data.counts;
      this.page.pages = data.pages;
      // console.log(this.page.counts);
      this.loading = false;
    },
    currentChange(val) {
      this.page.page = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.page.pagesize = val;
      this.getList();
    },
    // 获取省
    getCityData: function () {
      this.citySelect.province = provinces();
    },
    // 选省获取到市
    handleProvince: function (e) {
      this.citySelect.cityDate = citys(e);
      this.formBase.city = this.citySelect.cityDate[0];
    },
    //清除
    removeFn() {
      this.formBase = {
        tags: "",
        shortName: "",
        province: "",
        city: "",
        state: "",
      };
    },
    //搜索
    async SearchFn() {
      const { data } = await list(this.formBase);
      // console.log(data);
      this.List = data.items;
      this.page.counts = data.counts;
    },
    //添加
    addFn() {
      this.dialogFormVisible = true;
    },
    newDataes(val) {
      // console.log(val);
      this.formBase = {
        page: 1,
        pagesize: 10,
        tags: "",
        shortName: "",
        province: "",
        city: "",
        state: "",
      };
      this.getList();
    },
    //编辑
    async isEdit(obj) {
      // console.log(obj);
      const { data } = await detail({
        id: obj.id,
      });
      this.formBase = data;
      //  console.log(data);
      this.dialogFormVisible = true;
    },
    //删除
    async remove(obj) {
      await remove({
        id: obj.id,
      });
      this.$message.success("删除成功");
      this.getList();
    },
    //修改状态
    async change(obj) {
      if (obj.state == 1) {
        //启用
        await this.$confirm("已成功禁止，确定继续吗");
        console.log("禁止");
        // alert('启用')
        const data = await changeStatus(obj.id, 0);
        this.$message.success("禁用成功");
        //   console.log(data);
      } else if (obj.state == 0) {
        await this.$confirm("已成功启用，确定继续吗");
        console.log("启动");
        // alert('禁止')
        const res = await changeStatus(obj.id, 1);
        //   console.log(res);
        this.$message.success("启用成功");
      }
      this.getList();
    },
  },
  components: {
    AddCompanys,
  },
};
</script>

<style scoped lang="less">
.container {
  background-color: #f0f2f5;
  .headers {
    width: 1300px;
    margin-left: 18px;
    .title {
      background-color: #fff;
      padding: 15px;
    }
    .iconf {
      background-color: #fff;
      width: 1300px;
      height: 35px;
      .titleicon {
        // margin-left: 15px;
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
