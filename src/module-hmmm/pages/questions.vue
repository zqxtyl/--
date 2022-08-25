<template>
  <div class="container">
    <el-card class="box-card" body-style="height:100%">
      <!-- 头部 -->
      <el-row type="flex" class="header_title">
        <el-col>
          <span class="headertext">说明：目前支持学科和关键字条件筛选</span>
        </el-col>
        <el-col>
          <el-row type="flex" justify="end">
            <el-button type="success" icon="el-icon-edit"  @click="$router.push('/questions/new')">新增试题</el-button>
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
                v-model="form.subjectID"
                @change="onChangelist"
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
              <el-select
                placeholder="请选择"
                style="width: 100%"
                v-model="form.catalogID"
              >
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in catalog"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="标签">
              <el-select
                placeholder="请选择"
                style="width: 100%"
                v-model="form.tags"
              >
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in tagsList"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="关键字">
              <el-input
                placeholder="根据题干搜索"
                v-model="form.keyword"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- /第一行 -->
        <!-- 第二行 -->
        <el-row>
          <el-col :span="6">
            <el-form-item label="试题类型">
              <el-select
                placeholder="请选择"
                style="width: 100%"
                v-model="form.questionType"
              >
                <el-option
                  :label="item.value"
                  :value="item.id"
                  v-for="item in questionTypeList"
                  :key="item.id"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="6">
            <el-form-item label="难度">
              <el-select
                placeholder="请选择"
                style="width: 100%"
                v-model="form.difficulty"
              >
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
              <el-select
                placeholder="请选择"
                style="width: 100%"
                v-model="form.direction"
              >
                <el-option :label="item" :value="item"  v-for="(item,index) in directionList" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="录入人">
              <el-select
                placeholder="请选择"
                style="width: 100%"
                v-model="form.creatorID"
              >
                <el-option
                  :label="item.username"
                  :value="item.username"
                  v-for="item in creatorList"
                  :key="item.id"
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
              <el-input v-model="form.remarks"></el-input> </el-form-item
          ></el-col>
          <el-col :span="6">
            <el-form-item label="企业简称">
              <el-input v-model="form.shortName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="城市">
              <el-select
                placeholder="请选择"
                style="width: 50%"
                v-model="form.city"
                @change="cityChange"
              >
                <el-option
                  :label="item"
                  :value="item"
                  v-for="item in provinces"
                  :key="item"
                ></el-option>
              </el-select>

              <el-select
                placeholder="请选择"
                style="width: 50%"
                v-model="form.province"
              >
                <el-option 
                v-for="item in citys"
                :key="item"
                :label="item"
                :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="end">
              <el-button @click="clearForm">清除</el-button>
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
        :title="`数据一共 ${counts} 条`"
        type="info"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 列表 -->
      <questionList :tableHead="tableHead" :tableData="list" @updateList="updateList">
        <template #page>
          <el-row type="flex" justify="end">
            <el-pagination
              background
              @size-change="onPageSizeChange"
              @current-change="onPageChange"
              :current-page="Number(pages.page)"
              :total="total * 5"
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
import { simple } from "@/api/hmmm/subjects"; //学科
import questionAllList from "@/constant/questions";
import { provinces, citys } from '@/api/hmmm/citys'
import { catalogSimple } from "@/api/hmmm/directorys";
import { tagsSimple } from "@/api/hmmm/tags";
import { simpleList } from "@/api/base/users";
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

      total: 0,
      counts: 0,
      subjectList: [],
      catalog: [], //二级目录列表
      tagsList: [], //标签目录列表
      creatorList: [],
      // from
      form: {
        catalogID: "", // 二级目录
        subjectID: "", //学科
        city: "", //市
        province: "", //省
        questionType: "", // 试题类型
        difficulty: "", //难度
        direction: "", //方向
        creatorID: "", //录入人
        tags: "", //
        remarks: "", //题目备注
        shortName: "", //企业简称
        keyword: "", //关键字
      },
      questionTypeList: [], // 试题的类型
      difficultyList: [], //难度的列表
      provinces: provinces(),
      citys: [], //二级城市列表
      directionList:[] //方向
    };
  },
  created() {
    this.getQuestionList();
    this.simpleList();
    
    this.onsubjectList();
    this.questionTypeList = questionAllList.questionType;
    this.difficultyList = questionAllList.difficulty;
    this.directionList = questionAllList.direction
  },
  methods: {
    //获取列表
    async getQuestionList() {
      const { data,data:{pages} } = await list({
        page: this.pages.page,
        pagesize: this.pages.size,
      });
      this.total = pages;
      this.counts = data.counts;
      console.log(data);

      this.list = data.items;
      console.log(this.list);
    },
    // 通过城市，获取省
    cityChange(val) {
      this.form.province = "";
      this.citys = citys(val);
    },
    // 清除按钮
    clearForm() {

       this.form.catalogID= "", // 二级目录
        this.form.subjectID= "", //学科
        this.form.city= "", //市
        this.form.province= "", //省
        this.form.questionType= "", // 试题类型
        this.form.difficulty= "", //难度
        this.form.direction= "", //方向
        this.form.creatorID= "", //录入人
        this.form.tags= "", //
        this.form.remarks= "", //题目备注
        this.form.shortName= "", //企业简称
        this.form.keyword= "" //关键字
        this.citys=[],
        this.catalog=[]
        this.tagsList=[]

    },
    // 子组件的 自定义事件
    updateList() {
      this.getQuestionList()
    },

    // 	每页条数 改变
   async onPageSizeChange(val) {
      console.log(val);
     await this.$nextTick()
      this.pages.size = val;
      this.getQuestionList();
    },
    // 改变页码时
    onPageChange(val) {
      console.log(val);
      this.pages.page = val;
      this.getQuestionList();
    },

    // 点击搜索按钮
    async searchList() {
      const res = await list({
        page:1,
        size:10,
        subjectID: this.form.subjectID,
        catalogID: this.form.catalogID,
        questionType: this.form.questionType,
        keyword: this.form.keyword,
        difficulty: this.form.difficulty,	
        tags: this.form.tags, 
        province: this.form.province ,
        city: this.form.city , 
        remarks:this.form.remarks ,
        shortName:this.form.shortName , 
        direction: this.form.direction ,
        
      });

      console.log(res);
      this.list = res.data.items
    },

    // 获取简单学科列表
    async onsubjectList() {
      // console.log(11);
      const { data } = await simple();
      // console.log(data);
      this.subjectList = data;
    },

    // 获取录入人列表
    async simpleList() {
      const res = await simpleList();
      //  console.log(res.data);
      this.creatorList = res.data;
    },
    
    // 改变值，获取目录列表
    async onChangelist() {
      this.form.catalogID = "";
      this.form.tags = "";
      const res = await catalogSimple({
        subjectID: this.form.subject,
      });
      this.catalog = res.data;
      const data = await tagsSimple({
        subjectID: this.form.subject,
      });
      console.log(data);
      this.tagsList = data.data;
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
