<template>
  <div class="container">
    <div class="header">
      <el-form :inline="true" class="title">
        <el-form-item>
          <span>关键字</span
          ><el-input
            v-model="formDate.value"
            placeholder="根据文章标题搜索"
            style="width: 250px; margin-left: 15px"
          />
        </el-form-item>
        <el-form-item style="margin-left: 25px">
          <span>状态</span
          ><el-select
            v-model="formDate.status"
            style="width: 250px; margin-left: 15px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" @click="remove">清除</el-button>
          <el-button size="mini" type="primary" @click="searchFn"
            >搜索</el-button
          >
        </el-form-item>
        <el-form-item style="margin-left: 380px">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="success"
            @click="addFn"
            >新增用户</el-button
          >
        </el-form-item>
      </el-form>
      <div class="iconf">
        <div class="titleicon">
          <i class="el-icon-info"></i>共{{ page.counts }}条数据
        </div>
      </div>
      <el-table :data="List">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="文章标题" prop="title">
          <template v-slot="{ row }">
            {{ row.title
            }}<i
              @click="videoPopub(row)"
              v-if="row.videoURL"
              class="el-icon-video-camera-solid"
            ></i>
          </template>
        </el-table-column>
        <el-table-column label="阅读数" prop="visits"></el-table-column>
        <el-table-column label="录入人" prop="username"></el-table-column>
        <el-table-column label="录入时间">
          <template v-slot="{ row }">
            {{ row.createTime | parseTimeByString }}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state">
          <template v-slot="{ row }">
            {{ row.state ? "启用" : "禁用" }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="text" size="mini" @click="LookAt(row)"
              >预览</el-button
            >
            <el-button type="text" size="mini" @click="isChange(row)">{{
              row.state ? "禁用" : "启用"
            }}</el-button>
            <el-button
              :disabled="row.state == 1"
              type="text"
              size="mini"
              @click="isEdit(row)"
              >修改</el-button
            >
            <el-button
              :disabled="row.state == 1"
              type="text"
              size="mini"
              @click="removeDelete(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pageIndex">
      <el-pagination
        @current-change="currentChange"
        background
        :current-page="page.page"
        :page-size="page.pagesize"
        layout="prev, pager, next,sizes,jumper"
        :total="page.counts"
        :page-sizes="[10, 20, 30, 50]"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </div>
    <!-- 新增修改弹出 -->
    <el-dialog :title="newTitle" :visible.sync="dialogVisible" width="50%">
      <div>
        <span>文章标题：</span
        ><el-input
          style="width: 400px; margin-bottom: 25px"
          placeholder="请输入文章标签"
          v-model="table.title"
        />
      </div>
      <div class="text">
        <div>
          <span>文章内容：</span>
          <div>
            <div class="example">
              <quill-editor
                class="editor"
                ref="QuillEditor"
                :options="editorOption"
                v-model="table.articleBody"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <span>视频地址：</span
        ><el-input
          v-model="table.videoURL"
          style="width: 400px"
          placeholder="请输入视频地址"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSave">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增修改弹出 -->
    <!-- 预览弹层 -->
    <el-dialog title="预览文章" :visible.sync="isShow" width="50%">
      <div>{{ currentObj.title }}</div>
      <div>
        <span style="margin-left: 15px">{{ currentObj.createTime }}</span
        ><span style="margin-left: 15px">{{ currentObj.username }}</span
        ><span style="margin-left: 15px">{{ currentObj.visits }}</span>
      </div>
      <div v-if="currentObj.articleBody">
        {{ currentObj.articleBody | filterAllHtmltag }}
      </div>
    </el-dialog>
    <!-- 预览弹层 -->

    <!-- 视频弹层 -->
    <el-dialog title="播放视频" width="50%" :visible.sync="videoShow">
      <div class="videoOpup">
        <meta name="referrer" content="no-referrer" />
        <video
          width="700px"
          height="500px"
          :src="videoObj.videoURL"
          controls="controls"
          v-if="videoShow"
        ></video>
      </div>
    </el-dialog>
    <!-- 视频弹层 -->
  </div>
</template>

<script>
import { status } from "@/api/hmmm/constants";
import { html2Text } from "@/utils";
import {
  list,
  add,
  update,
  detail,
  changeState,
  remove,
} from "@/api/hmmm/articles";
import quillEdit from "../components/quill-edit.vue";
import { quillEditor } from "vue-quill-editor";

// highlight.js style
import "highlight.js/styles/tomorrow.css";

// import theme style
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // 加粗，斜体，下划线，删除线
  [{ list: "ordered" }, { list: "bullet" }], // 有序列表，无序列表
  ["blockquote"], //引用，代码块
  ["code-block", "image", "link"], // 上传图片、上传视频
];

export default {
  name: "quill-example-snow",
  title: "Theme: snow",
  data() {
    return {
      formDate: {
        value: "",
        status: "",
      },
      status,
      page: {
        page: 1,
        pagesize: 10,
        counts: 0,
      },
      List: [],
      //新增
      dialogVisible: false,
      table: {
        articleBody: "",
        title: "",
        videoURL: "",
        id: null,
      },
      isShow: false,
      videoShow: false,
      videoObj: {},
      currentObj: {},
      editorOption: {
        placeholder: "请在这里输入",
        theme: "snow", //主题 snow/bubble
        modules: {
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false,
          },
          toolbar: {
            container: toolbarOptions,
            handlers: {
              insertMetric: this.showHandle,
            },
          },
        },
      },
    };
  },
  methods: {
    async getList() {
      const { data } = await list(this.page);
      console.log(data);
      this.List = data.items;
      this.page.counts = data.counts;
    },
    currentChange(val) {
      this.page.page = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.page.pagesize = val;
      this.getList();
    },
    remove() {
      this.formDate = {
        value: "",
        status: "",
      };
    },
    async searchFn() {
      const { data } = await list({
        keyword: this.formDate.value,
        state: this.formDate.status,
      });
      // console.log(data);
      this.List = data.items;
      this.page.counts = data.counts;
    },
    async addFn() {
      this.dialogVisible = true;
      this.table = {
        articleBody: "",
        title: "",
        videoURL: "",
        id: null,
      };
    },
    async onSave() {
      if (this.table.id) {
        await update({
          id: this.table.id,
          title: this.table.title,
          articleBody: this.table.articleBody,
          videoURL: this.table.videoURL,
        });
        this.$message.success("更新成功");
      } else {
        await add({
          id: this.table.id,
          title: this.table.title,
          articleBody: this.table.articleBody,
          videoURL: this.table.videoURL,
        });
        this.$message.success("添加成功");
      }

      this.dialogVisible = false;
      (this.table = {
        articleBody: "",
        title: "",
        videoURL: "",
        id: null,
      }),
        this.getList();
    },
    send(val) {
      // console.log(val);
      this.table.articleBody = val;
    },
    async isEdit(obj) {
      this.table = obj;
      this.table.articleBody = obj.articleBody;
      this.dialogVisible = true;
    },
    async isChange(obj) {
      // console.log(obj);
      if (obj.state == 1) {
        //开启
        await changeState({
          id: obj.id,
          state: 0,
        });
        this.$message.success("禁用成功");
      } else {
        await changeState({
          id: obj.id,
          state: 1,
        });
        this.$message.success("开启成功");
      }
      this.getList();
    },
    async removeDelete(obj) {
      await remove({
        id: obj.id,
      });
      this.$message.success("删除成功");
      this.getList();
    },
    LookAt(obj) {
      // console.log(obj);
      this.currentObj = obj;
      this.isShow = true;
    },
    videoPopub(obj) {
      // console.log(obj.videoURL);
      // if(obj.videoURL[0] instanceof Number){
      //   this.$message.error('视频地址错误')
      // }
      this.videoObj = obj;
      this.videoShow = true;
    },
  },
  created() {
    this.getList();
  },
  components: {
    quillEdit,
    quillEditor,
  },
  computed: {
    newTitle() {
      return this.table.id ? "编辑" : "新建";
    },
  },
};
</script>

<style scoped lang="less">
.container {
  background-color: #f0f2f5;
  padding-left: 10px;
  padding-right: 10px;
  .header {
    background-color: #fff;

    .title {
      margin-left: 25px;
      margin-top: 25px;
      padding: 15px;
    }
    .iconf {
      background-color: #fff;
      width: 1300px;
      height: 35px;

      .titleicon {
        margin-left: 15px;
        padding: 10px;
        background-color: #f4f4f5;
        color: #909399;
        font-size: 8px;
      }
    }
  }
  .pageIndex {
    margin-left: 800px;
  }
  .videoOpup {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.text {
  display: flex;
  .example {
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
    border-bottom: 1px solid #ccc;

    .editor {
      height: 15rem;
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
}
</style>
