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
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { detail } from "../../api/hmmm/questions";

export default {
  data() {
    return {
      currentQuestion: {},
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
  },

  methods: {
    onClose() {
      this.$emit("update:showpreviewDia", false);
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
.el-col {
  margin-bottom: 10px;
}
</style>
