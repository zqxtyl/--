<template>
  <div class="add-form">
    <el-dialog
      title="创建用户"
      :visible="visible"
      @close="onClose"
      ref="addform"
      width="30%"
    >
      <el-form
        ref="addform"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" style="width: 90%" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" style="width: 90%" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" style="width: 90%" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-input v-model="formData.role" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限组名称">
          <el-select
            v-model="formData.permission_group_id"
            placeholder="请选择"
            style="width: 90%"
          >
            <el-option
              v-for="item in permissionList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="formData.phone" style="width: 90%" />
        </el-form-item>
        <el-form-item label="介绍">
          <el-input
            type="textarea"
            v-model="formData.introduction"
            style="width: 90%"
          ></el-input>
        </el-form-item>
        <el-row type="flex" justify="center">
          <el-col :offset="10">
            <el-button size="small" @click="onClose">取消</el-button>
            <el-button type="primary" size="small" @click="onConfirm"
              >确定</el-button
            >
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { add } from "@/api/base/users.js";
import { simple } from "@/api/base/permissions.js";
export default {
  name: "usersAdd",
  props: ["visible"],
  data() {
    return {
      permissionList: [],
      formData: {
        avatar: "",
        username: "",
        email: "",
        password: "",
        role: "",
        permission_group_id: "",
        phone: "",
        introduction: "",
      },
      rules: {
        username: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" },
          {
            min: 1,
            max: 4,
            message: "用户姓名为1-4位",
          },
        ],
        email: [{ required: true, message: "邮箱不能为空", trigger: "blur" }],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
        role: [{ required: true, message: "角色不能为空", trigger: "blur" }],
        permission_group_id: [
          { required: true, message: "权限组名称不能为空", trigger: "change" },
        ],
        phone: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
      },
    };
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  computed: {},
  created() {
    this.getpermission();
  },
  methods: {
    onClose() {
      this.$emit("update:visible", false);
      this.$refs.addform.resetFields();
      this.formData.permission_group_id = "";
      this.formData.introduction = "";
    },
    onConfirm() {
      this.$refs.addform.validate(async (valid) => {
        if (!valid) return;
        await add(this.formData);
        this.$message.success("添加成功");
        this.onClose();
        this.$emit("add-success");
      });
    },
    async getpermission() {
      const { data } = await simple();
      this.permissionList = data;
    },
  },
};
</script>
<style>
.el-form--label-left .el-form-item__label {
  text-align: right;
}
.el-form-item--medium {
  margin-bottom: 22px;
}
.el-dialog__footer {
  text-align: center;
}
</style>
