<template>
  <el-table
    :data="formatData"
    :row-class-name="rowClassStatus"
    v-loading="listLoading"
    element-loading-text="给我一点时间"
    fit
    highlight-current-row
    style="width: 100%"

  >
    <el-table-column
      v-for="column  in columns"
      :key="column.prop"
      :width="column.width"
      :prop="column.prop"
      :label="column.text"
    >
      <template slot-scope="scope">
        <expand
          v-if="column.render"
          :render="column.render"
          :row="scope.row"
          :index="index"
          :column="column"
        >
        </expand>
        <span v-else>
          <template v-if="column.value==='title'">
            <i v-if="scope.row._level==0" style="margin-left:20px"  class="el-icon-folder-opened"></i>
            <i v-if="scope.row._parent&&!scope.row.is_point" style="margin-left:40px" class="el-icon-document"></i>
            <i v-if="scope.row.is_point" style="margin-left:60px" class="el-icon-view"></i>
          </template>
          {{ scope.row[column.value] }}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="260" align="center">
      <template slot-scope="scope">
         <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="handleUpdate(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="handleDelete(scope)"
            ></el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import Utils from "@/components/TreeTable/utils/dataTranslate.js";
import expand from "@/components/TreeTable/utils/expand";
export default {
  name: "treeTable",
  components: { expand },
  props: {
    // 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
    treeStructure: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    data: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 这是相应的字段展示
    columns: {
      type: Array,
      default: function () {
        return [];
      },
    },
    listLoading: {
      type: Boolean,
      default: false,
    },
    // 是否默认展开所有树
    defaultExpandAll: {
      type: Boolean,
      default: function () {
        return true;
      },
    },
  },
  computed: {
    // 格式化数据源
    formatData: function () {
      const me = this;
      if (me.treeStructure) {
        const data = Utils.treeToArray(
          me.data,
          null,
          null,
          me.defaultExpandAll
        );
        return data;
      }
      return me.data;
    },
  },
  methods: {
    rowClassStatus: function () {
      this.$emit("rowClassStatus");
    },
    handleUpdate(row) {
      this.$emit("handleUpdate", row);
    },
    handleDelete(user) {
      this.$emit("removeUser", user);
    },
  },
};
</script>
<style rel="stylesheet/css">
.ivu-icon-ios-folder-outline {
  content: "\F434";
}
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
$color-blue: #2196f3;
$space-width: 0.225rem;
.ms-tree-space {
  position: relative;
  top: 0.0125rem;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: $space-width;
  height: 0.175rem;
  &::before {
    content: "";
  }
}
.processContainer {
  width: 100%;
  height: 100%;
}
table td {
  line-height: 0.325rem;
}

.tree-ctrl {
  position: relative;
  cursor: pointer;
  color: $color-blue;
  margin-left: -$space-width;
}

</style>
