<template>
  <div class="container">
    <el-dialog
      title="题目审核"
      :visible="dialogVisible"
      width="30%"
      @close="onClose"
    >
      <el-form ref="form">
        <el-form-item prop="chkState">
          <el-radio-group v-model.number="checkInfo.chkState">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="chkRemarks">
          <el-input type="textarea" v-model="checkInfo.chkRemarks"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkInfo: {
        chkState: 1,
        chkRemarks: "",
      },
    };
  },
  props: {
    dialogVisible: {
      type: Boolean,
    },
  },
  methods: {
    onClose() {
      this.$emit("update:dialogVisible", false);
      this.$refs.form.resetFields();
      // this.checkInfo = {};
    },
    cancel() {
      this.onClose();
      this.checkInfo.chkRemarks = "";
      this.checkInfo.chkState = 1;
    },
    confirm() {
      if (!this.checkInfo.chkRemarks) {
        return this.$message.warning("请输入审核意见");
      }
      this.onClose();
      this.$emit("onConfirm", this.checkInfo);
      this.checkInfo.chkRemarks = "";
      this.checkInfo.chkState = 1;
    },
  },
};
</script>

<style scoped lang="less"></style>
