<template>
  <div class="example">
    <quill-editor
      class="editor"
      :value="value"
      :options="editorOption"
      @input.native="quillInput"
      @change="change"
      id="quillEdit"
    />
    <!-- <div class="output code">
      <code class="hljs" v-html="contentCode"></code>
    </div> -->
    <!-- <div class="output ql-snow">
      <div class="ql-editor" v-html="content"></div>
    </div> -->
  </div>
</template>

<script>
import { quillEditor, Quill } from "vue-quill-editor";
import { container, ImageExtend, QuillWatch } from "quill-image-extend-module";

Quill.register("modules/ImageExtend", ImageExtend);
// highlight.js style
import hljs from "highlight.js";
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
  components: {
    quillEditor,
  },
  data() {
    return {
      editorOption: {
        placeholder: "请在这里输入",
        theme: "snow", //主题 snow/bubble
        modules: {
          ImageExtend: {
            loading: true,
            name: "img",
            action: "",
            response: (res) => {
              return res.info;
            },
          },
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: function () {
                QuillWatch.emit(this.quill.id);
              },
            },
          },
          // 语法高亮
          syntax: {
            highlight: (text) => hljs.highlightAuto(text).value,
          },
        },
      },
    };
  },
  props: {
    value: {
      type: String,
    },
  },
  computed: {},

  methods: {
    quillInput(e) {
      // console.log(e.target.innerHTML);
      // const content = e.target.innerHTML;
      // this.value = content;
    },
    change(e) {
      // console.log(e);
      const content = e.html;
      this.$emit("getQuillQusetionValue", content);
      this.$emit("getQuillAnswerValue", content);
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
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
</style>
