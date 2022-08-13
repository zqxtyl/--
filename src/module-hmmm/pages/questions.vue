<template>
  <div class="container">
    <el-card class="box-card">
      <!-- 头部 -->
      <el-row type="flex" class="header_title">
        <el-col>
          <span class="headertext">说明：目前支持学科和关键字条件筛选</span>
        </el-col>
        <el-col>
          <el-row type="flex" justify="end">
            <el-button type="success" icon="el-icon-delete">新增试题</el-button>
          </el-row>
        </el-col>
      </el-row>
      <!-- 搜索区域 -->
      <el-form ref="form" label-width="80px">
        <!-- 第一行 -->
        <el-row>
          <el-col :span="6">
            <el-form-item label="学科">
              <el-select
                placeholder="请选择"
                style="width: 100%"
                v-model="form.subject"
                @focus="focusShowList"
              >
                <el-option
                  :label="item.label"
                  v-for="item in subjectList"
                  :key="item.value"
                  :value="item.value"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="6">
            <el-form-item label="二级目录">
              <el-select placeholder="请选择" style="width: 100%">
                <el-option label="区域一"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="标签">
              <el-select placeholder="请选择" style="width: 100%">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="关键字">
              <el-input v-model="input" placeholder="根据题干搜索"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- /第一行 -->
        <!-- 第二行 -->
        <el-row>
          <el-col :span="6">
            <el-form-item label="试题类型">
              <el-select placeholder="请选择" style="width: 100%">
                <el-option
                  :label="item.value"
                  :value="item.value"
                  v-for="item in questionTypeList"
                  :key="item.id"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="6">
            <el-form-item label="难度">
              <el-select placeholder="请选择" style="width: 100%">
                <el-option
                  :label="item.value"
                  :value="item.value"
                  v-for="item in difficultyList"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="方向">
              <el-select placeholder="请选择" style="width: 100%">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="录入人">
              <el-select placeholder="请选择" style="width: 100%">
                <el-option
                  :label="$store.state.user.name"
                  value="$store.state.user.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- /第二行 -->
        <!-- 第三行 -->
        <el-row>
          <el-col :span="6">
            <el-form-item label="题目备注">
              <el-input v-model="input"></el-input> </el-form-item
          ></el-col>
          <el-col :span="6">
            <el-form-item label="企业简称">
              <el-input v-model="input"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="城市" >
              <el-select placeholder="请选择" style="width: 50%" v-model="form.city">
                <el-option :label="item.text" :value="item.value" v-for="item in dataCity" :key="item.value"></el-option>
               
              </el-select>

              <el-select placeholder="请选择" style="width: 50%">
                <el-option label="区域一" value="shanghai"></el-option>
                
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="end">
              <el-button>清除</el-button>
              <el-button type="primary" @click="searchList">搜索</el-button>
            </el-row>
          </el-col>
        </el-row>
        <!-- /第三行 -->
      </el-form>
      <!-- /搜索区域 -->
      <!-- /头部 -->

      <!-- 警告文案 -->
      <el-alert
        :title="`数据一共 ${list.length} 条`"
        type="info"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 列表 -->
      <questionList :tableHead="tableHead" :tableData="list">
        <template #page>
          <el-row type="flex" justify="end">
            <el-pagination
              background
              @size-change="onPageSizeChange"
              @current-change="onPageChange"
              :current-page="Number(pages.page)"
              :total="Number(total)"
              :page-size="Number(pages.size)"
              :page-sizes="[5, 10, 20, 50]"
              layout="prev, pager, next,sizes, jumper"
            >
            </el-pagination>
          </el-row>
        </template>
      </questionList>
      <!-- /列表 -->
      <!-- 分页 -->

      <!-- /分页 -->
    </el-card>
  </div>
  <!-- 基础题库 -->
</template>

<script>
import questionList from "../components/questionsList _Jichu.form";
import { list } from "@/api/hmmm/questions";
import { simple } from "@/api/hmmm/subjects";
import questionAllList from "@/constant/questions";
import cityDate from "../components/questionsList _Jichu.form/city.data-3";

export default {
  name: "question",
  components: {
    questionList,
  },
  data() {
    return {
      list: [], //获取的列表数据
      //表头数据
      tableHead: [
        {
          column_name: "number",
          column_comment: "试题编号",
        },
        {
          column_name: "subject",
          column_comment: "学科",
        },
        {
          column_name: "catalog",
          column_comment: "目录",
        },
      ],
      pages: {
        page: 1,
        size: 10,
      },
      total: 1,
      subjectList: [],
      // from
      form: {
        catalog: "",
        catalogID: "",
        subject: "",
        city:'',

      },
      questionTypeList: [], // 试题的类型
      difficultyList: [], //难度的列表
      dataCity:[] // 城市列表
      
    };
  },
  created() {
    this.getQuestionList();
    this.dataCity = cityDate.cityData3
    this.questionTypeList = questionAllList.questionType;
    this.difficultyList = questionAllList.difficulty;
  },
  methods: {
    async getQuestionList() {
      const { data } = await list({
        page: this.pages.page,
        pagesize: this.pages.size,
      });
      this.total = data.pages;
      console.log(data);

      this.list = data.items;
      console.log(this.list);
    },
    // 	每页条数 改变
    onPageSizeChange(val) {
      // console.log(val);
      this.pages.size = val;
      this.getQuestionList();
    },
    // 改变页码时
    onPageChange(val) {
      this.pages.page = val;
      this.getQuestionList();
    },
    // 点击搜索按钮
    async searchList() {
      const res = await list(this.form.subject);
      console.log(res);
    },
    // 获得焦点，获取简单学科列表
    async focusShowList() {
      // console.log(11);
      const { data } = await simple();
      console.log(data);
      this.subjectList = data;
    },
  },
};
</script>

<style scoped lang="less">
// 头部样式
.header_title {
  margin-bottom: 10px;
}
.headertext {
  font-size: 12px;
  color: pink;
}

// end头部样式
</style>
