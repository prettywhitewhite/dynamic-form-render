## 介绍

`dynamic-form-render` 是基于`vue.js` ,`element-ui` 的前端动态表单渲染器，可通过配置文件快速的生成 form 表单。

## 安装

```
npm i dynamic-form-render
# or
yarn add dynamic-form-render
```

## 快速使用

```
import Vue from 'vue'
import dynamicFormRender from 'dynamic-form-render'

Vue.use(dynamicFormRender)

new Vue({
  el: '#app',
  render: h => h(App)
});

```

## 开始使用

```

<template>
  <div class="example">
    <dynamic-form
      :structure="renderStructure"
      v-model="iData"
      ref="form"
      :disabled="false"
      :context.sync="context"
    />
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
        default: 'hello word',
      },
    ]
    return {
      iData: {},
      context: {
        show: false,
      },
      renderStructure,
    }
  },
}
</script>
```

### 注册业务组件

```
Vue.use(dynamicFormRender,registerConfig)
```

通过配置 registerConfig 注册组件

| Prop         | Type   | Description       |
| ------------ | ------ | ----------------- |
| components   | Object | 需要注册的组件    |
| fieldTypeMap | Object | type 和组件对应表 |
| fieldDefault | Object | 组件默认值对照表  |

```
import elInput from 'element-ui/lib/input'
import checkbox from 'element-ui/lib/checkbox'
const registerConfig = {
    components:{
        elInput,
        checkbox
    },
    fieldTypeMap:{
        input: 'elInput',
        checkbox: 'checkbox',
    },
    fieldDefault:{
         group: {
            defaultValue: function() {
              return {}
            },
            cleanValue: () => {
              return {}
            },
            itemDataScope: function(defaultValue) {
              return defaultValue
            },
        },
    }
}

```

### API

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| data | Object | {} | 表单数据对象，可使用 v-model 实现数据双向绑定 |
| structure | Array | [] | 表单渲染配置对象 |
| disabled | Boolean | false | 禁用表单 |
| readonly | Boolean | false | 只读 |
| labelWidth | String | 140px | 表单域标签的宽度，例如 '50px'。</br>作为 Form 直接子元素的 form-item 会继承该值。支持 auto |
| labelPosition | String | right | 表单域标签的位置，如果值为 left 或者 right 时，<br>则需要设置 label-width |
| context | Object | {} | 表单上下文 |

### 表单配置 structure

| Prop | Type | required | Description |
| :-- | :-: | --- | --- |
| group | string | false | 配置 group 时，将渲染该表单项配置中 fields 字段下的配置成为一个复合表单项组 |
| field | string | 未设值 group 时为必填 | 表单项对应的字段名 |
| label | string | false | 表单项的标签名 |
| type | string | false | 表单项对应的前端组件名 |
| dependence &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | object | false | 表单依赖规则，提供 show，hide, disabled， value <br>实现显示、隐藏、禁用和设值 |
| fields | Array | false | group 属性不为空时 或 type 类型为 multiGroup 时有效 |
| config | object | false | 组件配置项, 属性 on 可配置事件 |
| rules | object 或 Array | false | 表单项校验规则，与 elForm 保持一致 |
| prefixIcon | String | false | 表单项的标签名头部图标 |
| suffixIcon | String | false | 表单项的标签名尾部图标 |
| tip | string | false | 表单项提示文案 |
| desc | string | false | 表单项描述 |
| reset | Boolean | false | 设置为 true 时，当表单项隐藏时清空已填内容。默认 false |
| default | any | false | 表单项默认值 |

1. ##### dependence 属性

- 通过配置 dependence 中的 value 属性对表单项关联 field 设置值，使用方法如下：  
   condition 为表单式，当 condition 为 true 时 field 的值被设置为 set

```
dependence:{
    value:{
        condition:'{{rootValue.setValue}}',
        set:'需要设置的值'
    }
}
```

2. ##### config 属性

- 通过 config 中 on 属性配置事件

3. ##### rules 属性

- 配置 word:true 区分字与字节

### 表单基础组件 type 对照表

| type            | 组件                   | Description  | config           |
| --------------- | ---------------------- | ------------ | ---------------- |
| input           | ElInput                | 输入框 input | 详见 el-input    |
| text            | DyText                 | 文本         |                  |
| select          | DySimpleSelect         | 下拉选择器   |                  |
| checkbox        | ElCheckbox             | 多选按钮     | 详见 el-checkbox |
| checkboxGroup   | DyCheckboxGroup        | 多选按钮组   |                  |
| radio           | ElRadio                | 单选按钮     | 详见 el-radio    |
| switch          | ElSwitch               | 开关选择器   | 详见 el-switch   |
| upload          | DyUplod                | 上传组件     |
| textarea        | DyTextarea             | textarea     |
| contentTextarea | DyContentTextarea      | 博文输入框   |
| multiGroup      | DynamicFieldMultiGroup | 多组表单项组 |

### 实现联动

通过支持函数表达式实现表单组件间的联动。配置项中==config==属性、==dependence==属性支持使用函数表单式函数表达式接收一下三个参数：

- **==rootValue==** 整个 form 的值 (当两个关联组件距离较远时，可以从顶层的 rootValue 里获取)
- **==parentValue==** 父组件的值 (上一级的值，方便从中获取所有兄弟组件的值)
- **==context==** 上下文对象 (与表单相关的其他数据、表单项之间的联动数据等 )

当使用 json 文件作为配置对象时，以 =={{ }}== 作为提示符，将其包含的字符串作为函数解析并返回运算结果

```
 show: '{{!!rootValue.isShow }}',
 show : (rootValue)=> !!rootValue.isShow
```

### 实现依赖

通过表达式来实现依赖关系，==dependenc==e 属性提供==show==，==hide==，==disabled==及==value== 属性实现表单项之间的显示、隐藏、禁用和设值

==value==属性是一个对象，有两个属性: ==condition== ==set==

属性 condition 的值是一个表单式，当表达式为真时，将该配置项的表单值设值为 set 属性的值

```
{
    field：'content'
    condition: '{{!!rootValue.isSetDefault}}',
    set: 'hello,word'
}
```

当 formData 中 isSetDefault 为真时，formData.content 赋值为'hello,word'

### 组合基础表单项为复杂表单组

提供 group 属性、fields 属性配置复杂表单项组

```
[
  {
    group: '测试表单组合项',
    field: 'group',
    fields: [
      {
        label: '你是谁?',
        field: 'name',
        type: 'input',
        config: {
          placeholder: '请输入你的名字',
        },
        rules: {
          required: true,
          message: '请输入你的名字',
        },
      },
      {
        label: '请留言：',
        field: 'context',
        type: 'contentTextarea',
        rules: [
          {
            required: true,
            message: '请留言',
          },
          {
            max: 10,
            word: true,
            message: '留言超过最大字数限制',
          },
        ],
      },
    ],
  },
]

```

该配置的数据结构为：

```
{ "group": { "name": "机器人", "context": "hello, word" } }
```
