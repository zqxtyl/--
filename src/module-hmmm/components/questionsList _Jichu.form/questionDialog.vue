<template>
  <el-dialog title="题目预览" :visible="visible" @close="onClose" @open="openDialog">
    <el-row type="flex" class="title">
    <el-col :span="6"><span>【题型】 :</span> <span>{{detailList.questionType | getQuestionType}}</span></el-col>
  <el-col :span="6"><span>【编号】 :</span> <span>{{detailList.id}}</span></el-col>
  <el-col :span="6"><span>【难度】 :</span> <span>{{detailList.difficulty | getDifficulty}}</span></el-col>
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
<div class="title"> <span>{{detailList.questionType | getQuestionType}} </span>选项：(以下选中的选项为正确答案)</div>
                                                                                                                                           
<!-- 单选 -->
<div class="title" v-if="detailList.questionType==1">
  <el-radio-group v-model="radio">
    <el-radio :value="item.isRight" :label="item.isRight"  v-for="item in detailList.options" :key="item.id" style="width: 100%" class="title" @change="radioChange" > {{ item.title }}</el-radio>
     </el-radio-group>
</div>  

<!-- 多选 -->

<div class="title" v-else-if="detailList.questionType==2" v-for="item in detailList.options" :key="item.id" style="width: 100%" >
  <el-checkbox-group v-model="checkboxNumber">
    <el-checkbox  :label="item.code" class="title" @change="checkboxChange"  > {{ item.title }}</el-checkbox>
    </el-checkbox-group>
</div>

<div class="title" v-else>

</div>
<hr>
<div class="title">【参考答案】： <el-button type="danger" @click="videoAnswer = !videoAnswer">视频答案预览</el-button></div>
<!-- 视频 -->
<video v-if="videoAnswer" id="myPlayer" width="300" height="200" controls autoplay="autoplay" loop>
            <source :src="detailList.videoURL" type="video/mp4" >
        </video>


<hr>
<div class="title">【答案解析】 : <span v-html="detailList.answer"></span></div>
<hr>
<div class="title">【题目备注】 : {{detailList.remarks}}</div>
<el-button type="primary" @click="onClose">关闭</el-button>
</el-dialog>
</template>

<script>
// "https://player.vimeo.com/external/517080601.sd.mp4?s=ef2f1f271dd72d762956a2b188f25aa2215f6575&profile_id=165&oauth2_token_id=57447761"
import { detail  } from '@/api/hmmm/questions'
export default {
    name:'questionDialog',
  data () {
    return {
        isRight:1,
        checked:1,
        videoAnswer:false,
        radio:1,
        checkboxList:[],
        detailList:[],
        arr:[],
        checkboxNumber:[]
    }
  },  
  props:['visible','id'],  

  created () {
   
  },
  mounted() {
   
  },

  methods: {
    onClose() {
      this.videoAnswer = false;
        this.$emit('update:visible',false)
    },
    // 单选
    radioChange() {
      this.radio =1
    },
    // 多选
    checkboxChange() {
      this.checkboxNumber = this.arr
    },
   async openDialog() {
      const res = await detail({
      id :this.id
    })
    
    const arr = [];
      res.data.options.forEach((item) => {
        if (item.isRight) {
          arr.push(item.code);
        }
      });
      this.checkboxNumber = arr;
    this.arr = arr
      
      
    this.detailList = res.data
    console.log(this.detailList);
    }
  }
}
</script>

<style scoped lang='less'>
.title{
    margin-bottom: 25px;
}
</style>
