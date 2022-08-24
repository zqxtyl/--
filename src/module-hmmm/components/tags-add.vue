<template>
  <div class="container">
    <el-dialog
      @close="onClose"
      :title="this.currentabc ? '修改标签' : '新增标签'"
      :visible="visible"
      width="23%"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="所属学科"
          prop="subjectName"
          v-if="subjectID === null"
        >
          <el-select
            v-model="ruleForm.subjectID"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in simpleSubjectList"
              :key="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签名称" prop="tagName" size="small">
          <el-input v-model="ruleForm.tagName" size="small"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button @click="onSave" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { simple } from "@/api/hmmm/subjects.js";
import { add, update } from "@/api/hmmm/tags.js";
export default {
  data() {
    return {
      ruleForm: {
        subjectID: this.subjectID,
        tagName: "",
      },
      rules: {
        tagName: [
          { required: true, message: "请输入目录名称", trigger: "blur" },
        ],
      },
      simpleSubjectList: [],
    };
  },
  props: {
    visible: {
      type: Boolean,
      required: false,
    },
    currentabc: {
      type: Boolean,
      required: true,
    },
    editsList: {
      type: Object,
      default: () => ({}),
    },
    subjectID: {
      type: Number,
      default: null,
    },
  },

  watch: {
    editsList: {
      immediate: true,
      handler(val) {
        if (val.id) {
          this.ruleForm.subjectID = this.editsList.id;
          this.ruleForm.tagName = this.editsList.tagName;
        }
      },
    },
  },

  created() {
    this.getSimpleSubject();
  },

  methods: {
    onClose() {
      this.$emit("update:visible", false);
      this.$refs.ruleForm.resetFields();
    },
    //点击确定按钮
    async onSave() {
      await this.$refs.ruleForm.validate();
      try {
        if (this.currentabc) {
          await update({
            id: this.editsList.id,
            subjectID: this.ruleForm.subjectID,
            tagName: this.ruleForm.tagName,
          });
          this.$message.success("修改成功");
          this.onClose();
          this.$emit("add-success");
        } else {
          await add(this.ruleForm);
          this.$message.success("添加成功");
          this.onClose();
          this.$emit("add-success");
        }
      } catch (error) {
        this.$message.error("系统繁忙，请重试！");
      }
    },
    async getSimpleSubject() {
      const res = await simple();
      this.simpleSubjectList = res.data;
    },
  },
};
</script>

<style scoped lang="less"></style>