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
            <el-form-item label="学科" prop="subjectID">
              <el-select
                clearable
                v-model="formData.subjectID"
                placeholder="请选择"
                allow-create=""
                @change="subjectChange"
              >
                <el-option
                  v-for="item in subList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="二级目录" prop="catalogID">
              <el-select v-model="formData.catalogID" placeholder="请选择">
                <el-option
                  v-for="item in dirList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="标签" prop="tags">
              <el-select v-model="formData.tags" placeholder="请选择">
                <el-option
                  v-for="item in tagsList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="关键字" prop="keyword">
              <el-input
                v-model="formData.keyword"
                placeholder="根据题干搜索"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="试题类型" prop="questionType">
              <el-select v-model="formData.questionType" placeholder="请选择">
                <el-option
                  v-for="item in questionType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6"
            ><el-form-item label="难度" prop="difficulty ">
              <el-select v-model="formData.difficulty" placeholder="请选择">
                <el-option
                  v-for="item in difficulty"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="方向" prop="direction">
              <el-select v-model="formData.direction" placeholder="请选择">
                <el-option
                  v-for="item in direction"
                  :key="item"
                  :value="item"
                  :label="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="录入人" prop="creatorID">
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
            <el-form-item label="题目备注" prop="remarks">
              <el-input v-model="formData.remarks"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="企业简称" prop="shortName">
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
              <el-button @click="onReset">重置</el-button>
              <el-button type="primary" @click="searchList">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 标签栏 -->
      <el-tabs v-model="activeName" type="card" @tab-click="changeCheckState">
        <el-tab-pane label="全部" name="first"> </el-tab-pane>
        <el-tab-pane label="待审核" name="second"></el-tab-pane>
        <el-tab-pane label="已审核" name="third"></el-tab-pane>
        <el-tab-pane label="已拒绝" name="fourth"></el-tab-pane>
      </el-tabs>
      <!-- //全部表格  -->
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
        <el-table-column
          prop="subjectID"
          label="学科"
          :formatter="formatSubject"
        ></el-table-column>
        <el-table-column prop="catalog" label="目录"></el-table-column>
        <el-table-column
          prop="questionType"
          label="题型 "
          :formatter="formatQuestionType"
        ></el-table-column>
        <el-table-column
          prop="question"
          label="题干"
          width="200"
          :formatter="formatQuestion"
        ></el-table-column>
        <el-table-column
          prop="addDate"
          label="录入时间"
          width="160"
          :formatter="formatDate"
        ></el-table-column>
        <el-table-column
          prop="difficulty"
          label="难度"
          :formatter="formatDifficulty"
        ></el-table-column>
        <el-table-column
          prop="creator"
          label="录入人"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="chkState"
          label="审核状态"
          width="80"
          :formatter="formatCheckState"
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
          prop="publishState"
          label="发布状态"
          width="80"
          :formatter="formatPubState"
        ></el-table-column>
        <el-table-column label="操作" fixed="right" width="200" align="center">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="onPreview(row.id)"
              >预览</el-button
            >
            <el-button
              type="text"
              size="small"
              :disabled="row.chkState !== 0"
              @click="onCheck(row)"
              >审核</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="
                $router.push({
                  name: 'questions-new',
                  query: {
                    id: row.id,
                  },
                })
              "
              >修改</el-button
            >
            <el-button type="text" size="small" @click="onPublish(row)">{{
              row.publishState === 1 ? "下架" : "上架"
            }}</el-button>
            <el-button
              type="text"
              size="small"
              :disabled="row.publishState === 1"
              @click="onRemove(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <page-tool
        :total="total"
        :paginationPage="pages"
        :paginationPagesize="pageInfo.pagesize"
        @pageChange="pageChange"
        @pageSizeChange="pageSizeChange"
      ></page-tool>
    </el-card>
    <!-- 审核弹出层？ -->
    <questionsCheckVue
      :dialogVisible.sync="dialogVisible"
      @onConfirm="checkBtn"
    />
    <!-- 预览弹出层 -->
    <questionsPreview
      :showpreviewDia.sync="showpreviewDia"
      :currentQuestionId="currentQuestionId"
    />
  </div>
</template>

<script>
import questionsPreview from "../components/questions-preview.vue";
import questionsCheckVue from "../components/questions-check.vue";
import pageTool from "../../module-dashboard/components/pageTool.vue";
import { direction, chkType, publishType } from "@/api/hmmm/constants";
import { citys, provinces } from "../../api/hmmm/citys";
import { simple as subSimple } from "@/api/hmmm/subjects.js";
import {
  simple as dirSimple,
  list as dirAllList,
} from "@/api/hmmm/directorys.js";
import { simple as tagsSimple } from "@/api/hmmm/tags.js";
import { simple as userSimple } from "@/api/base/users.js";
import {
  choice,
  choiceCheck,
  choicePublish,
  remove,
} from "../../api/hmmm/questions";
import { html2Text, parseTime, parseTimeByString } from "../../filters";
export default {
  data() {
    return {
      currentQuestionId: "", //当前点击id
      showpreviewDia: false, //预览弹出层
      activeName: "first",
      columnId: null, //当前行id
      dialogVisible: false, //审核弹出层
      subList: [], //学科
      provinces: [], //城市
      citys: [], //城市下属区县
      dirList: [], //目录
      tagsList: [], //标签
      userList: [], //用户列表
      position: "right",
      //试题类型
      questionType: [
        { label: "单选", value: 1 },
        { label: "多选", value: 2 },
        { label: "简答", value: 3 },
      ],
      //试题难度
      difficulty: [
        { label: "简单", value: 1 },
        { label: "一般", value: 2 },
        { label: "困难", value: 3 },
      ],
      direction, //方向
      chkType,
      publishType,
      //表单
      formData: {
        subjectID: "", //学科
        difficulty: "", //难度
        questionType: "", //试题类型,
        tags: "", //标签
        province: "", //企业所在省份
        city: "", //企业所在城市
        keyword: "", //关键字
        remarks: "", //题目备注
        shortName: "", //企业简称
        direction: "", //方向
        creatorID: "", //录入人
        catalogID: "", //目录
        chkState: "", //审核 状态
      },
      selectForm: {},
      pageInfo: {
        page: 1,
        pagesize: 10,
      },
      total: 0,
      pages: 0,
      rules: {},
      //表格
      tableData: [],
      tableLength: this.tableData,
    };
  },
  components: {
    pageTool,
    questionsCheckVue,
    questionsPreview,
  },
  watch: {
    tableLength(val) {
      immediate: true;
      console.log(val);
    },
  },
  methods: {
    async getChoiceList(form) {
      const { data } = await choice({
        ...this.pageInfo,
        ...form,
      });

      console.log(data);
      this.total = data.counts;
      this.pages = data.page;
      // this.pageInfo.page = data.page;
      // this.pageInfo.pagesize = data.pagesize;
      // this.changeCheckState();
      // this.tableData = data.items;

      // if (this.activeName === "second") {
      //   //待审核
      //   const awaitCheck = data.items.filter((item) => item.chkState === 0);
      //   this.tableData = awaitCheck;
      //   // console.log(awaitCheck);
      // } else if (this.activeName === "third") {
      //   const passCheck = data.items.filter((item) => item.chkState === 1);
      //   this.tableData = passCheck;
      // } else if (this.activeName === "fourth") {
      //   const rejectCheck = data.items.filter((item) => item.chkState === 2);
      //   this.tableData = rejectCheck;
      // } else {
      //   // this.tableData = this.tableData;
      // }
      this.tableData = data.items;
      if (this.tableData.length === 0 && this.pageInfo.page !== "1") {
        this.pageInfo.page -= 1;
        this.getChoiceList();
      }
    },
    pageChange(pageNum) {
      this.pageInfo.page = pageNum;
      this.getChoiceList();
      this.changeCheckState();
    },
    pageSizeChange(pageSize) {
      this.pageInfo.pagesize = pageSize;
      this.getChoiceList();
      this.changeCheckState();
    },
    async getSubList() {
      const { data } = await subSimple();
      this.subList = data;
    },
    //处理学科
    formatSubject(row, column, cellValue, index) {
      // console.log(cellValue);
      const subject = this.subList.find((item) => item.value === cellValue);
      return subject?.label;
    },
    //处理题型
    formatQuestionType(row, column, cellValue, index) {
      const findItem = this.questionType.find(
        (item) => item.value == cellValue
      );
      return findItem ? findItem.label : " 未知";
    },
    //处理时间
    formatDate(row, column, cellValue, index) {
      const time = parseTimeByString(cellValue);
      return time;
    },
    //处理题干
    formatQuestion(row, column, cellValue, index) {
      // console.log(cellValue.innerText);
      return html2Text(cellValue);
    },
    //处理难度
    formatDifficulty(row, column, cellValue, index) {
      const findItem = this.difficulty.find((item) => item.value == cellValue);
      return findItem ? findItem.label : "未知";
    },
    //处理审核状态
    formatCheckState(row, column, cellValue, index) {
      const findItem = this.chkType.find((item) => item.value === cellValue);
      return findItem ? findItem.label : "未知";
    },
    //处理发布状态publishType
    formatPubState(row, column, cellValue, index) {
      // const findItem
      // console.log(row);
      if (row.chkState === 0 || row.chkState === 2) {
        return "待发布";
      } else if (row.chkState === 1 && cellValue === 0) {
        return "已下架";
      } else if (row.chkState === 1 && cellValue === 1) {
        return "已发布";
      }
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
    //搜索
    searchList() {
      //把需要的搜索内容添加进去
      for (const key in this.formData) {
        if (this.formData[key]) {
          console.log(key);
          this.selectForm[key] = this.formData[key];
          console.log(this.selectForm);
        }
      }
      this.getChoiceList(this.selectForm);
      this.selectForm = {};
    },
    //重置
    onReset() {
      this.$refs.form.resetFields();
      this.formData.city = "";
      // this.formData = {};
      this.formData = {
        subjectID: "", //学科
        difficulty: "", //难度
        questionType: "", //试题类型,
        tags: "", //标签
        province: "", //企业所在省份
        city: "", //企业所在城市
        keyword: "", //关键字
        remarks: "", //题目备注
        shortName: "", //企业简称
        direction: "", //方向
        creatorID: "", //录入人
        catalogID: "", //目录
        chkState: "", //审核 状态
      };
      this.formData.difficulty = "";
    },
    //审核
    onCheck(val) {
      console.log(val);
      this.dialogVisible = true;
      this.columnId = val.id;
    },
    //确认审核
    async checkBtn(val) {
      // if (!val.chkRemarks) {
      //   return this.$message.warning("请输入审核意见");
      // }
      await choiceCheck({
        id: this.columnId,
        ...val,
      });
      this.$message.success("审核成功");
      this.getChoiceList();
    },
    //上下架
    async onPublish(val) {
      const pubText = val.publishState === 1 ? "下架" : "上架";
      this.$confirm("是否" + pubText + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await choicePublish({
          id: val.id,
          publishState: val.publishState === 0 ? 1 : 0,
        });
        this.$message.success("操作成功");
        this.getChoiceList();
      });
    },
    onRemove(val) {
      this.$confirm("是否刪除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await remove({
          id: val.id,
        });
        this.$message.success("刪除成功");
        this.getChoiceList();
      });
    },

    //切换状态标签栏
    changeCheckState(val) {
      console.log(this.activeName, val);
      if (this.activeName === "second") {
        this.getChoiceList({
          chkState: 0,
        });
        //待审核
        const awaitCheck = this.tableData.filter((item) => item.chkState === 0);
        this.tableData = awaitCheck;
        // console.log(awaitCheck);
      } else if (this.activeName === "third") {
        this.getChoiceList({
          chkState: 1,
        });
        const passCheck = this.tableData.filter((item) => item.chkState === 1);
        this.tableData = passCheck;
      } else if (this.activeName === "fourth") {
        this.getChoiceList({
          chkState: 2,
        });
        const rejectCheck = this.tableData.filter(
          (item) => item.chkState === 2
        );
        this.tableData = rejectCheck;
      } else {
        this.getChoiceList();
        this.tableData = this.tableData;
      }
    },

    //预览弹窗
    onPreview(id) {
      this.showpreviewDia = true;
      this.currentQuestionId = id;
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
