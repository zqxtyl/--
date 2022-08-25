<template>
  <div class="container">
    <el-dialog
      @close="onClose"
      :title="this.currentabc ? '修改学科' : '新增学科'"
      :visible="visible"
      width="23%"
    >
      <el-form ref="form" :model="formData" :rules="rules" label-width="70px">
        <el-form-item label="学科名称" prop="subjectName">
          <el-input
            v-model="formData.subjectName"
            placeholder="请输入学科名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-switch
            v-model="value1"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('update:visible', false)">取 消</el-button>
        <el-button @click="onSave" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { add, update } from "@/api/hmmm/subjects.js";
export default {
  data() {
    return {
      formData: {
        subjectName: "",
        isFrontDisplay: 0,
      },
      rules: {
        subjectName: [
          { required: true, message: "请输入学科名称", trigger: "blur" },
        ],
      },
      value1: true,
    };
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    currentabc: {
      type: Boolean,
      required: true,
    },
    editsList: {
      type: Object,
      default: () => ({}),
    },
  },

  watch: {
    editsList: {
      immediate: true,
      handler(val) {
        if (val.id) {
          this.formData.subjectName = this.editsList.subjectName;
          this.formData.isFrontDisplay = this.editsList.isFrontDisplay;
        }
      },
    },
  },

  methods: {
    onClose() {
      this.$emit("update:visible", false);
      this.$refs.form.resetFields();
    },
    //点击确定按钮
    async onSave() {
      await this.$refs.form.validate();
      try {
        if (this.currentabc) {
          await update({
            id: this.editsList.id,
            subjectName: this.formData.subjectName,
            isFrontDisplay: this.formData.isFrontDisplay,
          });
          this.$message.success("修改成功");
          this.onClose();
          this.$emit("add-success");
        } else {
          await add(this.formData);
          this.$message.success("添加成功");
          this.onClose();
          this.$emit("add-success");
        }
      } catch (error) {
        this.$message.error("系统繁忙，请重试！");
      }
    },
  },
};
</script>

<style scoped lang="less"></style>