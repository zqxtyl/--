<template>
  <div class="container">
    负责人：牛天草
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>精选题库</span>
      </div>
      <!-- 第一行 -->
      <el-form
        size="small"
        label-width="100px"
        ref="form"
        :model="formData"
        :rules="rules"
      >
        <el-row>
          <el-col :span="24">
            <el-row type="flex" justify="end" style="margin-bottom: 20px">
              <el-button type="success" class="el-icon-edit" size="small"
                >新增试题</el-button
              >
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-form-item label="学科">
              <el-select
                v-model="formData.subjectID"
                placeholder="请选择"
                allow-create=""
                @change="subjectChange"
              >
                <el-option
                  v-for="item in subList"
                  :key="item.label"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="二级目录">
              <el-select v-model="formData.catalogID" placeholder="请选择">
                <el-option
                  v-for="item in dirList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="标签">
              <el-select v-model="formData.tags" placeholder="请选择">
                <el-option
                  v-for="item in tagsList"
                  :key="item"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="关键字">
              <el-input
                v-model="formData.keywords"
                placeholder="根据题干搜索"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="试题类型">
              <el-select v-model="formData.questionType" placeholder="请选择">
                <el-option label="区域一" value="shanghai"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6"
            ><el-form-item label="难度">
              <el-select v-model="formData.difficulty" placeholder="请选择">
                <el-option label="区域一" value="shanghai"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="方向">
              <el-select v-model="formData.direction" placeholder="请选择">
                <el-option label="区域一" value="shanghai"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="录入人 ">
              <el-select v-model="formData.creatorID" placeholder="请选择">
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.username"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="题目备注">
              <el-input v-model="formData.remarks"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="企业简称">
              <el-input v-model="formData.shortName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="城市:" prop="province">
              <el-col :span="12">
                <el-select
                  placeholder="请选择"
                  v-model="formData.province"
                  @change="getCityByProvince"
                >
                  <el-option
                    :label="item"
                    v-for="item in provinces"
                    :key="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-select placeholder="请选择" v-model="formData.city">
                  <el-option
                    :label="item"
                    v-for="item in citys"
                    :key="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button>重置</el-button>
              <el-button type="primary">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- //表格  -->
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        header-row-class-name="table"
      >
        <el-table-column
          prop="number"
          label="试题编号"
          width="130"
        ></el-table-column>
        <el-table-column prop="subjectID" label="学科"></el-table-column>
        <el-table-column prop="catalogID" label="目录"></el-table-column>
        <el-table-column prop="questionType" label="题型 "></el-table-column>
        <el-table-column
          prop="question"
          label="题干"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="addDate"
          label="录入时间"
          width="150"
          :formatter="formatDate"
        ></el-table-column>
        <el-table-column prop="difficulty" label="难度"></el-table-column>
        <el-table-column
          prop="creator"
          label="录入人"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="chkState"
          label="审核状态"
          width="80"
        ></el-table-column>
        <el-table-column
          prop="chkRemarks"
          label="审核意见"
          width="90"
        ></el-table-column>
        <el-table-column
          prop="chkUser"
          label="审核人"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="chkState"
          label="发布状态"
          width="80"
        ></el-table-column>
        <el-table-column label="操作" fixed="right" width="200" align="center">
          <template>
            <el-button type="text" size="small">预览</el-button>
            <el-button type="text" size="small">审核</el-button>
            <el-button type="text" size="small">修改</el-button>
            <el-button type="text" size="small">上架</el-button>
            <el-button type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { citys, provinces } from "../../api/hmmm/citys";
import { simple as subSimple } from "@/api/hmmm/subjects.js";
import { simple as dirSimple } from "@/api/hmmm/directorys.js";
import { simple as tagsSimple } from "@/api/hmmm/tags.js";
import { simple as userSimple } from "@/api/base/users.js";
import { choice } from "../../api/hmmm/questions";
export default {
  data() {
    return {
      subList: [], //学科
      provinces: [], //城市
      citys: [], //城市下属区县
      dirList: [], //目录
      tagsList: [], //标签
      userList: [], //用户列表
      position: "right",
      //表单
      formData: {
        subjectID: "", //学科
        difficulty: "", //难度
        questionType: "", //试题类型,
        tags: "", //标签
        province: "", //企业所在省份
        city: "", //企业所在城市
        keywords: "", //关键字
        remarks: "", //题目备注
        shortName: "", //企业简称
        direction: "", //方向
        creatorID: "", //录入人
        catalogID: "", //目录
        chkState: "", //审核 状态
      },
      rules: {},
      //表格
      tableData: [],
    };
  },
  methods: {
    async getChoiceList() {
      const { data } = await choice({
        page: 1,
        pagesize: 10,
      });
      this.tableData = data.items;
    },
    async getSubList() {
      const { data } = await subSimple();
      this.subList = data;
    },
    //处理时间
    formatDate(row, column, cellValue, index) {
      console.log(cellValue);
    },
    async subjectChange(value) {
      this.formData.catalogID = "";
      const { data } = await dirSimple({
        subjectID: value,
      });
      const res = await tagsSimple({
        subjectID: value,
      });
      this.tagsList = res.data;
      this.dirList = data;
    },
    //获取省市下面区县
    getCityByProvince() {
      // console.log(val);
      this.formData.city = "";
      console.log(this.formData.province);
      this.citys = citys(this.formData.province);
    },
    //用户列表
    async getuserList() {
      const { data } = await userSimple();
      // console.log(res);
      this.userList = data;
    },
  },
  created() {
    this.getChoiceList();
    this.getSubList();
    this.provinces = provinces();
    this.getuserList();
  },
};
</script>

<style scoped lang="less">
.container {
  margin: 20px;
  .table {
    text-align: center;
    background-color: #ccc;
  }
}
</style>
