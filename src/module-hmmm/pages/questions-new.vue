<template>
  <div class="container">
    负责人：牛天草
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>试题录入</span>
      </div>
      <el-form label-width="80px" ref="form" :model="formData" :rules="rules">
        <el-form-item label="学科:" prop="subjectID">
          <el-select
            placeholder="请选择"
            v-model="formData.subjectID"
            @change="subjectChange"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in subList"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目录:" prop="catalogID">
          <el-select placeholder="请选择" v-model="formData.catalogID">
            <el-option
              :label="item.label"
              v-for="item in dirList"
              :key="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业:" prop="enterpriseID">
          <el-select placeholder="请选择" v-model="formData.enterpriseID">
            <el-option
              :label="item.company"
              v-for="item in compList"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市:" prop="province">
          <el-col :span="7">
            <el-form-item :show-message="provinceRules" prop="provinces">
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
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item
              prop="city"
              style="margin-left: -105px"
              :show-message="cityRules"
            >
              <el-select placeholder="请选择" v-model="formData.city">
                <el-option
                  :label="item"
                  v-for="item in citys"
                  :key="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="方向:" prop="direction">
          <el-select placeholder="请选择" v-model="formData.direction">
            <el-option
              v-for="item in direction"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题型:" prop="questionType">
          <el-radio-group
            v-model="formData.questionType"
            @change="changeSingleOrMulit"
          >
            <el-radio label="1" value="1">单选</el-radio>
            <el-radio label="2" value="2">多选</el-radio>
            <el-radio label="3" value="3">简答</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="难度:" prop="difficulty">
          <el-radio-group v-model="formData.difficulty">
            <el-radio label="1" value="1">简单</el-radio>
            <el-radio label="2" value="2">中等</el-radio>
            <el-radio label="3" value="3">困难</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="题干:"
          prop="question"
          :show-message="qusevalueValidate"
        >
          <quillEdit
            @getQuillQusetionValue="getQuillQusetionValue"
            ref="quilleditQues"
            :value="quillQuesValue"
          />
        </el-form-item>
        <!-- 单选框按钮 -->
        <el-form-item label="选项：" v-show="controlType.isshowSingle">
          <el-radio-group v-model="radioOption" @change="radionCheck">
            <div
              style="display: flex"
              class="checkOption"
              v-for="(item, index) in letters"
              :key="item"
            >
              <el-radio :label="item"> {{ item }} </el-radio>
              <el-input
                style="width: 150px"
                v-model="formData.options[index].title"
              ></el-input>
              <div class="img">
                <span class="font" @click="getIndex(index)"
                  ><el-upload
                    action="#"
                    :http-request="onRequest"
                    class="avatar-uploader"
                    :show-file-list="false"
                    :on-remove="onRemove"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img
                      v-if="formData.options[index].img"
                      :src="formData.options[index].img"
                      class="avatar"
                    />
                    <i
                      v-show="!formData.options[index].img"
                      v-loading="loading"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(255, 255, 255, 0.8)"
                      >图片上传</i
                    >
                  </el-upload>
                </span>
                <i class="el-icon-circle-close closebtn" @click="removeImg"></i>
              </div>
            </div>
          </el-radio-group>
        </el-form-item>
        <!-- 多选框按钮 -->
        <el-form-item label="选项：" v-if="controlType.isshowCheckBox">
          <el-checkbox-group v-model="checkBoxList" @change="checkBoxCheck">
            <div
              style="display: flex"
              class="checkOption"
              v-for="(item, index) in checkboxLetters"
              :key="item"
            >
              <el-checkbox :label="item" :value="item">{{ item }}</el-checkbox>
              <el-input
                style="width: 150px"
                v-model="formData.options[index].title"
              ></el-input>
              <div class="img">
                <span class="font" @click="getIndex(index)"
                  ><el-upload
                    action="#"
                    :http-request="onRequest"
                    class="avatar-uploader"
                    :show-file-list="false"
                    :on-remove="onRemove"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img
                      v-if="formData.options[index].img"
                      :src="formData.options[index].img"
                      class="avatar"
                    />
                    <i
                      v-show="!formData.options[index].img"
                      v-loading="loading"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(255, 255, 255, 0.8)"
                      >图片上传</i
                    >
                  </el-upload>
                </span>
                <i class="el-icon-circle-close closebtn" @click="removeImg"></i>
              </div>
            </div>
          </el-checkbox-group>
        </el-form-item>
        <!-- 提交按钮 -->
        <el-form-item>
          <el-button
            type="danger"
            icon="el-icon-plus"
            size="mini"
            :disabled="controlType.isshowSingle === true"
            v-if="controlType.isshowButton"
            @click="addOptions"
            >增加选项与答案</el-button
          >
        </el-form-item>
        <el-form-item label="解析视频" prop="videoURL">
          <div class="img__con">
            <el-upload
              class="avatar-uploader"
              action="#"
              :http-request="videoRequset"
              :show-file-list="false"
            >
              <video width="100px" v-if="formData.videoURL">
                <source :src="formData.videoURL" type="video/mp4" />
              </video>
              <i v-else class="el-icon-plus"></i>
            </el-upload>

            <p>视频格式为mp4格式，每个视频大小不超过3m</p>
          </div>

          <el-input v-model="formData.videoURL"></el-input>
        </el-form-item>
        <el-form-item
          label="答案解析"
          prop="answer"
          :show-message="valueValidate"
        >
          <quill-edit
            @getQuillAnswerValue="getQuillAnswerValue"
            ref="quilledit"
            :value="quillAnswerValue"
          />
        </el-form-item>
        <el-form-item label="题目备注" prop="remarks">
          <el-input type="textarea" v-model="formData.remarks"></el-input>
        </el-form-item>
        <el-form-item label="试题标签" prop="tags" class="tags">
          <el-select
            placeholder="请选择试题标签"
            v-model="tags"
            multiple
            no-match-text="456"
            @change="handleTags"
            filterable
            allow-create
          >
            <el-option
              v-for="item in tagsList"
              :key="item.value"
              :value="item.label"
              :label="item.label"
            ></el-option>
          </el-select>
          <!-- <el-input v-model="formData.tags" class="username"></el-input> -->
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="addQuestion" v-if="$route.query.id"
            >确认提交</el-button
          >
          <el-button type="primary" @click="addQuestion" v-else
            >确认提交</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import COS from "cos-js-sdk-v5";
var cos = new COS({
  SecretId: "AKIDkLkvwoT3Ur6C7UnwqVwA90mOo184wkQk",
  SecretKey: "GYN3e8RYTDrJXa6OSIwOegV8YkjV3NVP",
});
import { direction } from "@/api/hmmm/constants";
import { list as getCompList } from "@/api/hmmm/companys.js";
import { simple as tagsSimple } from "@/api/hmmm/tags.js";
import { simple as dirSimple } from "@/api/hmmm/directorys.js";
import { simple as subSimple } from "@/api/hmmm/subjects.js";
import quillEdit from "@/module-hmmm/components/quill-edit";
import { citys, provinces } from "../../api/hmmm/citys";
import {
  add,
  detail,
  list as getList,
  choice as getChoice,
} from "../../api/hmmm/questions";
export default {
  data() {
    return {
      // currentId: this.$route.query.id,
      inputsel: "",
      quillAnswerValue: "",
      quillQuesValue: "",
      //子组件验证
      valueValidate: true,
      qusevalueValidate: true,
      provinceRules: true,
      cityRules: true,
      //规则
      rules: {
        subjectID: [
          { required: true, message: "请选择学科", trigger: "change" },
        ],
        catalogID: [
          { required: true, message: "请选择目录", trigger: "change" },
        ],
        enterpriseID: [
          { required: true, message: "请选择公司", trigger: "change" },
        ],
        province: [{ message: "请选择城市", trigger: "change" }],
        question: [{ required: true, message: "请输入问题", trigger: "blur" }],
        province: [{ message: "请选择城市", trigger: "change" }],
        provinces: [{ message: "请选择城市", trigger: "change" }],
        city: [{ message: "请选择市区", trigger: "change" }],
        direction: [
          { required: true, message: "请选择方向", trigger: "change" },
        ],
        answer: [{ required: true, message: "请输入答案", trigger: "blur" }],
        tags: [{ message: "请选择标签", trigger: "change" }],
      },

      loading: false,
      controlType: {
        isshowSingle: true,
        isshowCheckBox: false,
        isshowButton: true,
      },
      subList: [], //学科列表
      dirList: [], //目录列表
      tagsList: [], //标签列表
      compList: [], //公司列表
      checkList: [],
      provinces: [], //城市列表
      citys: [], //区县列表
      checkBoxList: [], //多选框列表
      direction,
      radioOption: "", //单选框按钮
      formData: {
        subjectID: "",
        catalogID: "",
        enterpriseID: "",
        province: [],
        city: [],
        direction: "",
        questionType: "1",
        difficulty: "1",
        question: "",
        options: [
          { code: "A", title: "", img: "", isRight: false },
          { code: "B", title: "", img: "", isRight: false },
          { code: "C", title: "", img: "", isRight: false },
          { code: "D", title: "", img: "", isRight: false },
        ],
        videoURL: "",
        answer: "",
        remarks: "",
        tags: "",
      },
      tags: [],
      Imgindex: null,
      letters: ["A", "B", "C", "D"],
      checkboxLetters: ["A", "B", "C", "D"],
    };
  },
  created() {
    // console.log(this.$route.query.id);
    // this.currentId = ;
    this.getSubList();
    this.getCompList();
    this.provinces = provinces();
    if (this.provinceRules.length === 0) {
      this.provinceRules = true;
    }
    this.provinceRules = false;
    // console.log(res);
    // console.log(this.$route.query.id);
    //获取试题回显
    if (this.$route.query.id) {
      this.getBackDetail();
    }
  },
  components: {
    quillEdit,
  },
  watch: {
    //监听路由id
    // deep: true,
    "$route.query.id": {
      handler(val) {
        immediate: true;
        // console.log(7879);
        // console.log(val);
        console.log(111);
        //清空表单
        this.$refs.form.resetFields();
        this.$refs.quilleditQues._data.value = "";
        this.$refs.quilledit._data.value = "";
        (this.quillAnswerValue = ""),
          (this.quillQuesValue = ""),
          (this.checkBoxList = []);
        this.checkList = [];
        (this.letters = ["A", "B", "C", "D"]),
          (this.checkboxLetters = ["A", "B", "C", "D"]),
          (this.radioOption = "");
        this.formData.question = "";
        this.formData.answer = "";
        this.tags = "";
        this.formData.difficulty = "1";
        this.formData.questionType = "1";
        this.formData.options = [
          { code: "A", title: "", img: "", isRight: false },
          { code: "B", title: "", img: "", isRight: false },
          { code: "C", title: "", img: "", isRight: false },
          { code: "D", title: "", img: "", isRight: false },
        ];
      },
    },
  },
  methods: {
    async getBackDetail() {
      this.loading = true;
      const { data } = await detail({
        id: this.$route.query.id,
      });
      console.log(data);
      //多选单选
      this.changeSingleOrMulit(data.questionType);
      //处理标签
      this.tags = data.tags.split(",");
      //处理多选单选
      if (data.questionType == "1") {
        const findItem = data.options.find((item) => item.isRight === 1);
        // console.log(findItem);
        this.radioOption = findItem?.code;
      } else if (data.questionType == "2") {
        let arr = [];
        data.options.forEach((item) => {
          arr.push(item.code);
        });
        console.log(arr.sort());
        //排序
        this.checkboxLetters = arr.sort();
        data.options.forEach((item) => {
          if (item.isRight === 1) {
            this.checkBoxList.push(item.code);
          }
        });
      }
      this.quillAnswerValue = data.answer;
      this.quillQuesValue = data.question;
      this.formData = data;
      this.loading = false;
    },
    async getSubList() {
      const { data } = await subSimple();
      this.subList = data;
    },
    //获取企业列表
    async getCompList() {
      const {
        data: { items },
      } = await getCompList({
        pagesize: 100000,
      });
      // console.log(res);
      this.compList = items;
    },
    //获取科目下面的目录\标签
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
    //切换多选单选
    changeSingleOrMulit(val) {
      console.log(val);
      if (val === "1") {
        this.controlType.isshowSingle = true;
        this.controlType.isshowButton = true;
        this.controlType.isshowCheckBox = false;
      } else if (val === "2") {
        this.controlType.isshowSingle = false;
        this.controlType.isshowButton = true;
        this.controlType.isshowCheckBox = true;
      } else {
        this.controlType.isshowCheckBox = false;
        this.controlType.isshowSingle = false;
        this.controlType.isshowButton = false;
      }
    },
    //选项选择 是否为正确的
    radionCheck(val) {
      this.formData.options.forEach((item) => {
        if (item.code === val) {
          item.isRight = true;
        } else {
          item.isRight = false;
        }
      });
    },
    //多选按钮
    checkBoxCheck(val) {
      // console.log(val);
      this.checkBoxList = val;
      console.log(this.checkBoxList);
      this.formData.options.forEach((item) => {
        this.checkBoxList.forEach((value) => {
          const isInclude = this.checkBoxList.includes(item.code);
          if (item.code === value) {
            item.isRight = true;
            // console.log(value, item.code, item.isRight);
          } else if (!isInclude) {
            item.isRight = false;
          }
        });
      });
      console.log(this.formData.options);
    },
    //获取索引
    getIndex(index) {
      // console.log(index);
      this.Imgindex = index;
      console.log(this.Imgindex);
    },
    //图片处理
    handleAvatarSuccess(res, file) {
      // this.loading = true;
      console.log(file);
      // this.formData.options[this.Imgindex].img = URL.createObjectURL(file.raw);
      // this.loading = false;
    },
    //上传图片
    onRequest({ file }) {
      this.loading = true;

      //   console.log('上传')
      cos.putObject(
        {
          Bucket: "tciano-1313341659" /* 必须 */,
          Region: "ap-nanjing" /* 存储桶所在地域，必须字段 */,
          Key: file.name /* 必须 */,
          StorageClass: "STANDARD",
          Body: file, // 上传文件对象
          onProgress: function (progressData) {
            console.log(JSON.stringify(progressData));
          },
        },
        (err, data) => {
          if (err || data.statusCode !== 200) {
            return this.$message.error("上传失败，请重试");
          }
          this.formData.options[this.Imgindex].img = "https://" + data.Location;
          this.loading = false;
        }
      );
    },
    //视频处理
    videoRequset({ file }) {
      this.loading = true;

      //   console.log('上传')
      cos.putObject(
        {
          Bucket: "tciano-1313341659" /* 必须 */,
          Region: "ap-nanjing" /* 存储桶所在地域，必须字段 */,
          Key: file.name /* 必须 */,
          StorageClass: "STANDARD",
          Body: file, // 上传文件对象
          onProgress: function (progressData) {
            console.log(JSON.stringify(progressData));
          },
        },
        (err, data) => {
          if (err || data.statusCode !== 200) {
            return this.$message.error("上传失败，请重试");
          }
          this.formData.videoURL = "https://" + data.Location;
          this.loading = false;
        }
      );
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //删除图片
    onRemove(file) {
      console.log(file);
    },
    removeImg() {
      this.formData.options[this.Imgindex].img = "";
    },
    //拿到富文本框的值
    getQuillQusetionValue(val) {
      // console.log(val);
      this.formData.question = val;
      if (val.length === 0) {
        this.qusevalueValidate = true;
      }
      this.qusevalueValidate = false;
    },
    //拿到富文本框的值

    getQuillAnswerValue(val) {
      // console.log(val);
      this.formData.answer = val;
      if (val.length === 0) {
        this.valueValidate = true;
      }
      this.valueValidate = false;
    },
    //添加试题
    async addQuestion() {
      // console.log(this.$refs.quilledit._data.value);
      this.$refs.form.validate(async (validate) => {
        if (!validate) {
          this.$message.warning("请填写必填项");
        } else {
          await add(this.formData);
          if (this.$route.query.id) {
            this.$router.back();
            this.$message.success("修改成功");
          } else {
            this.$message.success("试题添加成功");
            //跳转
            this.$router.push("/questions/list");
          }
          // const list = await getList();
          // const choice = await getChoice();
          // console.log(res);
          // console.log(list.data.items);
          // console.log(choice.data.items);
          this.$refs.form.resetFields();
          //清空表单
          this.$refs.quilleditQues._data.value = "";
          this.$refs.quilledit._data.value = "";
          (this.quillAnswerValue = ""),
            (this.quillQuesValue = ""),
            (this.checkBoxList = []);
          this.checkList = [];
          (this.letters = ["A", "B", "C", "D"]),
            (this.checkboxLetters = ["A", "B", "C", "D"]),
            (this.radioOption = "");
          this.formData.question = "";
          this.formData.answer = "";
          this.tags = "";
          this.formData.difficulty = "1";
          this.formData.questionType = "1";
          this.formData.options = [
            { code: "A", title: "", img: "", isRight: false },
            { code: "B", title: "", img: "", isRight: false },
            { code: "C", title: "", img: "", isRight: false },
            { code: "D", title: "", img: "", isRight: false },
          ];
        }
      });
    },
    //添加选项
    addOptions() {
      // 首先拿到多选数组里的最后一个元素;
      let lastItem =
        this.checkboxLetters[this.checkboxLetters.length - 1].charCodeAt();
      lastItem = lastItem + 1;
      // console.log(lastItem);
      let acii = String.fromCharCode(lastItem);
      this.checkboxLetters.push(acii);
      this.formData.options.push({
        code: acii,
        title: "",
        img: "",
        isRight: false,
      });
    },
    //处理标签
    handleTags(event) {
      console.log(event);
      const StringTags = this.tags.toString();
      this.formData.tags = StringTags;
    },
    ipt(event) {
      // console.log(111);
      console.log(event.target.value);
      this.tagsList = event.target.value;
    },
  },
};
</script>

<style scoped lang="less">
.container {
  margin: 20px;
  .quillEdit {
    display: flex;
    flex-direction: column;

    .editor {
      height: 40rem;
      overflow: hidden;
    }

    .output {
      width: 100%;
      height: 20rem;
      margin: 0;
      border: 1px solid #ccc;
      overflow-y: auto;
      resize: vertical;

      &.code {
        padding: 1rem;
        height: 16rem;
      }

      &.ql-snow {
        border-top: none;
        height: 24rem;
      }
    }
  }
  .checkOption {
    display: flex;
    align-items: center;
    height: 80px;
    line-height: 60px;
    .img {
      position: relative;

      width: 80px;
      margin-left: 5px;
      height: 60px;
      // background-color: #ccc;
      border: 1px dashed #ccc;
      border-radius: 5px;
      text-align: center;
      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409eff;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
      .avatar {
        width: 77px;
        height: 57px;
        display: block;
      }
      .font {
        font-size: 10px;
        width: 20px;
        height: 20px;
      }
      .closebtn {
        // display: block;?
        position: absolute;
        top: -8px;
        right: -8px;
        font-size: 18px;
      }
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 16px;
    color: #8c939d;
    width: 350px;
    height: 30px;
    line-height: 30px;
    text-align: center;
  }
  .avatar {
    width: 350px;
    height: auto;
    display: block;
  }
  .title {
    font-size: 18px;
    margin-bottom: 20px;
  }
  .img__con {
    .el-button {
      width: 100%;
      margin: 10px 0 20px 0;
    }
  }
  .tags.el-form-item {
    position: relative;
  }
  .el-form-item .username.el-input {
    position: absolute;
    top: 0px;
    left: 25px;
    width: 190px;
  }
  .el-form-item .username.el-input input {
    // border: 0px;
    height: 33px;
    line-height: 33px;
    padding: 0 15px;
  }
}
</style>
