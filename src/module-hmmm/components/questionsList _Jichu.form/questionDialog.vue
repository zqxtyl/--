<template>
  <el-dialog title="题目预览" :visible="visible" @close="onClose">
    <el-row type="flex" class="title">
    <el-col :span="6"><span>【题型】 :</span> <span>{{detailList.questionType==1? '单选题' : '多选题'}}</span></el-col>
  <el-col :span="6"><span>【编号】 :</span> <span>{{detailList.id}}</span></el-col>
  <el-col :span="6"><span>【难度】 :</span> <span>{{detailList.difficulty}}</span></el-col>
  <el-col :span="6"><span>【标签】 :</span> <span>{{detailList.tags}}</span></el-col>
</el-row>
<el-row type="flex" class="title">
    <el-col :span="6"><span>【学科】 :</span> <span>{{detailList.subjectName}}</span></el-col>
  <el-col :span="6"><span>【目录】 :</span> <span>{{detailList.directoryName}}</span></el-col>
  <el-col :span="6"><span>【方向】 :</span> <span>{{detailList.direction}}</span></el-col>
</el-row>
<hr>
<!-- 题干 -->
<div class="title">【题干】 : </div>
<div class="title"><span v-html="detailList.question"></span></div>
<div class="title"> <span>{{detailList.questionType==1? '单选题' : '多选题'}} </span>选项：(以下选中的选项为正确答案)</div>

<!-- 单选 -->
<div class="title" v-if="detailList.questionType==1">
    <el-radio :value="item.isRight" :label="item.title"  v-for="item in detailList.options" :key="item.id" style="width: 100%" class="title"></el-radio>
</div>
<!-- 多选 -->
<div class="title" v-else>
    <el-checkbox :label="item.title"  v-model="checked" v-for="item in detailList.options" :key="item.id" style="width: 100%" class="title"></el-checkbox>
</div>
<hr>
<div class="title">【参考答案】： <el-button type="danger">视频答案预览</el-button></div>
<!-- 视频 -->
<video id="myPlayer" width="300" height="200" controls autoplay="autoplay" loop>
            <source src="../../../../../video.mp4" type="video/mp4" >
        </video>


<hr>
<div class="title">【答案解析】 : <span v-html="detailList.answer"></span></div>
<hr>
<div class="title">【题目备注】 : {{detailList.remarks}}</div>
<el-button type="primary">关闭</el-button>
</el-dialog>
</template>

<script>
export default {
    name:'questionDialog',
  data () {
    return {
        isRight:1,
        checked:1
    }
  },  
  props:['visible','detailList']  ,

  created () {
    
  },

  methods: {
    onClose() {
        this.$emit('update:visible',false)
    }
  }
}
</script>

<style scoped lang='less'>
.title{
    margin-bottom: 25px;
}
</style>
