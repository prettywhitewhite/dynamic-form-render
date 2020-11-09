# 指南

## 介绍

`dynamic-form-render` 是基于`vue.js` ,`element-ui` 的前端动态表单渲染器，可通过配置文件快速的生成 form 表单。

## 安装

```js
npm i dynamic-form-render
# or
yarn add dynamic-form-render
```

## 快速使用

在 main.js 中写入以下内容：

```js
import Vue from 'vue'
import dynamicFormRender from 'dynamic-form-render'

Vue.use(dynamicFormRender)

new Vue({
  el: '#app',
  render: h => h(App),
})
```

## 一个简单的例子

<script>
export default {
  name: 'App',
  data() {
    const renderStructure = [
      {
        field: 'name',
        label: '姓名',
        type: 'input',
        config: {
          placeholder: '请输入姓名',
        },
        dependence: {
          show: (rootValue, parentValue, context) => context.show,
        },
        rules: {
          required: true,
          message: '请输入您的姓名',
        },
      },
      {
        field: 'sex',
        label: '性别',
        type: 'radioGroup',
        config: {
          options: [
            {
              id: 'man',
              text: '男',
            },
            {
              id: 'woman',
              text: '女',
            },
          ],
        },
        rules: {
          required: true,
          message: '请选择您的性别',
        },
      },
      {
        field: 'mobilePhone',
        label: '手机号码',
        type: 'input',
        config: {
          placeholder: '请输入您的联系电话',
        },
        rules: {
          validator: (rule, value, callback) => {
            if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
              return callback('请输入正确的手机号码')
            }
            callback()
          },
          trigger: 'blur'
        },
      },
      {
        field: 'message',
        label: '留言',
        type: 'textarea',
        config: {
          placeholder: '请留言...',
          showWordLimit: true,
          max: 30,
          word: true,
        },
      },
    ]
    return {
      iData: {},
      context: {
        show: true,
      },
      renderStructure,
    }
  },
  methods:{
    save(){
       this.$refs['exampleForm'].validate().then(valid => {
        if(valid){
          console.log('保存')
        }
      })
    },
    resetFields() {
      this.$refs['exampleForm'].resetFields()
    },
  }
}
</script>
<template>
  <div class="demo-block">
   <dynamic-form
      :structure="renderStructure"
      v-model="iData"
      ref="exampleForm"
      :disabled="false"
      :context.sync="context"
    >
		<div slot="footer" :style="{'text-align':'center'}">
        <el-button @click="save">保存</el-button>
        <el-button @click="resetFields">清空</el-button>
    </div>
	</dynamic-form>	 
</div>
</template>
<p>表单数据：{{ iData }}</p>

::: details 点击查看代码

```vue
<template>
  <div class="demo-block">
    <dynamic-form
      :structure="renderStructure"
      v-model="iData"
      ref="exampleForm"
      :disabled="false"
      :context.sync="context"
    >
      <div slot="footer" :style="{'text-align': 'center'}">
        <el-button @click="save">保存</el-button>
        <el-button @click="resetFields">清空</el-button>
      </div>
    </dynamic-form>
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    const renderStructure = [
      {
        field: 'name',
        label: '姓名',
        type: 'input',
        config: {
          placeholder: '请输入姓名',
        },
        dependence: {
          show: (rootValue, parentValue, context) => context.show,
        },
        rules: {
          required: true,
          message: '请输入您的姓名',
        },
      },
      {
        field: 'sex',
        label: '性别',
        type: 'radioGroup',
        config: {
          options: [
            {
              id: 'man',
              text: '男',
            },
            {
              id: 'woman',
              text: '女',
            },
          ],
        },
        rules: {
          required: true,
          message: '请选择您的性别',
        },
      },
      {
        field: 'mobilePhone',
        label: '手机号码',
        type: 'input',
        config: {
          placeholder: '请输入您的联系电话',
        },
        rules: {
          validator: (rule, value, callback) => {
            if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
              return callback('请输入正确的手机号码')
            }
            callback()
          },
          trigger: 'blur',
        },
      },
      {
        field: 'message',
        label: '留言',
        type: 'textarea',
        config: {
          placeholder: '请留言...',
          showWordLimit: true,
          max: 30,
          word: true,
        },
      },
    ]
    return {
      iData: {},
      context: {
        show: true,
      },
      renderStructure,
    }
  },
  methods: {
    save() {
      this.$refs['exampleForm'].validate().then(valid => {
        if (valid) {
          console.log('保存')
        }
      })
    },
    resetFields() {
      this.$refs['exampleForm'].resetFields()
    },
  },
}
</script>
```
