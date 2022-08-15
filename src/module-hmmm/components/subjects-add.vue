<template>
  <el-dialog
    @close="onClose"
    :title="dynamicTitle"
    :visible="visible"
    width="23%"
  >
    <el-form ref="form" :model="formData" :rules="rules" label-width="70px">
      <el-form-item label="学科名称" props="subjectName">
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
</template>

<script>
import { add, update } from "@/api/hmmm/subjects.js";
export default {
  data() {
    return {
      formData: {
        subjectName: "",
        isFrontDisplay: 1,
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
  },
  computed: {
    dynamicTitle() {
      return this.formData.id ? "修改学科" : "新增学科";
    },
  },

  methods: {
    onClose() {
      this.$emit("update:visible", false);
      this.$refs.form.resetFields();
    },
    //点击确定按钮
    async onSave() {
      this.$refs.form.validate(async (valid) => {
        //console.log(valid);//返回true
        if (!valid) return;
        //console.log(this.formData); //返回的是学科名和开关状态
        await add(this.formData);
        this.$message.success("添加成功");
        this.onClose();
        this.$emit("add-success");
      });
      // await this.$refs.formData.validate();
      // try {
      //   if (this.formData.id) {
      //     await update(this.formData.id);
      //     this.$message.success("修改成功");
      //     this.onClose();
      //     this.$emit("add-success");
      //   } else {
      //     await add(this.formData);
      //     this.$message.success("新增成功");
      //     this.onClose();
      //     this.$emit("add-success");
      //   }
      // } catch (error) {}
    },
  },
};
</script>

<style scoped lang="less"></style>
