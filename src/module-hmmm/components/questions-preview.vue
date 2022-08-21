<template>
  <div class="container">
    <el-dialog
      title="题目预览"
      :visible="showpreviewDia"
      @close="onClose"
      @open="onOpen"
      width="80%"
    >
      <el-row :gutter="24">
        <el-col :span="6">【题型】：{{ questionType }}</el-col>
        <el-col :span="6">【编号】：{{ currentQuestion.id }}</el-col>
        <el-col :span="6">【难度】：{{ difficulty }}</el-col>
        <el-col :span="6">【标签】：{{ currentQuestion.tags }}</el-col>
        <el-col :span="6"
          >【学科】：{{ currentQuestion.subjectName || "无" }}</el-col
        >
        <el-col :span="6">【目录】：{{ currentQuestion.directoryName }}</el-col>
        <el-col :span="6">【方向】：{{ currentQuestion.direction }}</el-col>
      </el-row>
      <el-divider></el-divider>
      <span class="span">【题干】： </span>
      <div style="color: blue; margin-top: 10px; margin-bottom: 10px">
        {{ question || "" }}
      </div>
      <span class="span">{{ type }} 选项：（以下选中的为正确答案）</span>
      <div
        style="display: flex; flex-direction: column"
        v-if="currentQuestion.questionType === '1'"
      >
        <el-radio
          v-model="radioCheck"
          :label="item.code"
          v-for="(item, index) in currentQuestion.options"
          :key="index"
          style="margin: 10px"
          >{{ item.title }}</el-radio
        >
      </div>
      <!-- 多选、 -->
      <div style="display: flex; flex-direction: column" v-else>
        <el-checkbox
          v-model="CheckBoxCheck"
          :label="item.code"
          v-for="(item, index) in currentQuestion.options"
          :key="index"
          style="margin: 10px"
          >{{ item.title }}</el-checkbox
        >
      </div>
      <el-divider></el-divider>
      <div>
        <span>【参考答案】: </span>
        <el-button type="danger" size="mini" @click="showVideo = true"
          >视频答案预览</el-button
        >
      </div>
      <video
        v-if="showVideo === true"
        width="300"
        height="300"
        style="margin-top: 10px"
        controls
        autoplay
        :src="currentQuestion.videoURL"
      >
        <!-- <source /> -->
      </video>
      <el-divider></el-divider>
      <div>
        <span>答案解析: {{ answer || "" }}</span>
      </div>
      <el-divider></el-divider>
      <div>
        <span>题目备注: {{ currentQuestion.remarks }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { detail } from "../../api/hmmm/questions";
import { html2Text } from "../../filters";

export default {
  data() {
    return {
      currentQuestion: {},
      // radio: this.radioCheck, //单选
      checkList: [], //多选列表
      showVideo: false,
    };
  },
  props: {
    showpreviewDia: {
      type: Boolean,
    },
    currentQuestionId: {},
  },
  computed: {
    questionType() {
      if (this.currentQuestion.questionType === "1") {
        return "单选";
      } else if (this.currentQuestion.questionType === "2") {
        return "多选";
      } else if (this.currentQuestion.questionType === "3") {
        return "简答";
      } else {
        return "未知";
      }
    },
    difficulty() {
      if (this.currentQuestion.difficulty === "1") {
        return "简单";
      } else if (this.currentQuestion.questionType === "2") {
        return "一般";
      } else if (this.currentQuestion.questionType === "3") {
        return "困难";
      } else {
        return "未知";
      }
    },
    //题型
    type() {
      if (this.currentQuestion.questionType === "1") {
        return "单选题";
      } else if (this.currentQuestion.questionType === "2") {
        return "多选题";
      } else if (this.currentQuestion.questionType === "3") {
        return "简答";
      } else {
        return "未知";
      }
    },
    //单选
    radioCheck() {
      const findItem = this.currentQuestion.options.find(
        (item) => item.isRight === 1
      );
      return findItem?.code || "";
    },
    //多选
    CheckBoxCheck() {
      const findItem = [];
      this.currentQuestion.options.filter((item) => {
        if (item.isRight === 1) {
          findItem.push(item.code);
        }
      });
      console.log(findItem);
      return findItem || [];
    },
    //题干处理
    question() {
      return html2Text(this.currentQuestion.question);
    },
    //答案处理
    answer() {
      return html2Text(this.currentQuestion.answer);
    },
  },

  methods: {
    onClose() {
      this.$emit("update:showpreviewDia", false);
      this.showVideo = false;
      this.currentQuestion = {};
    },
    cancel() {
      this.onClose();
    },
    async getQuestionDetail() {
      const { data } = await detail({
        id: this.currentQuestionId,
      });
      console.log(data);
      this.currentQuestion = data;
    },
    onOpen() {
      this.getQuestionDetail();
    },
  },
};
</script>

<style scoped lang="less">
.span {
  margin-bottom: 10px;
}
.el-col {
  margin-bottom: 10px;
}
// .el-radio {
//   display: block;
// }
</style>
