# 开始使用

## API

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| data | Object | {} | 表单数据对象，可使用 v-model 实现数据双向绑定 |
| structure | Array | [] | 详见[表单渲染配置对象](/guide/start.html#structure) |
| disabled | Boolean | false | 禁用表单 |
| readonly | Boolean | false | 只读表单 |
| labelWidth | String | 140px | 表单域标签的宽度，例如 '50px'。作为 Form 直接子元素的 form-item 会继承该值。支持 auto |
| labelPosition | String | right | 表单域标签的位置，如果值为 left 或者 right 时，则需要设置 label-width |
| context | Object | {} | 表单上下文对象 |

- 注 1 `context`这个字段存放的是表单上下文对象，影响表单项渲染的一些非 formData 数据可存在在 `context`对象中。在配置文件中，可使用 `context.set(key,value)`方法对 context 进行赋值。

## Structure

| Prop | Type | required | Description |
| :-- | :-: | --- | --- |
| group | string | false | 配置 group 时，将渲染该表单项配置中 fields 字段下的配置成为一个复合表单项组 |
| field | string | false | 表单项对应的字段名 |
| label | string | false | 表单项的标签名 |
| type | string | false | 表单项对应的前端组件名 |
| dependence | object | false | 表单依赖规则，提供 show，hide, disabled， value 实现显示、隐藏、禁用和设值 |
| fields | Array | false | group 属性不为空时 或 type 类型为 multiGroup 时有效 |
| config | object | false | 组件配置项, 属性 on 可配置事件 |
| rules | object 或 Array | false | 表单项校验规则，与 elForm 保持一致 |
| prefixIcon | String | false | 表单项的标签名头部图标 |
| suffixIcon | String | false | 表单项的标签名尾部图标 |
| tip | string | false | 表单项提示文案 |
| desc | string | false | 表单项描述 |
| reset | Boolean | false | 设置为 true 时，当表单项隐藏时清空已填内容。默认 false |
| default | any | false | 表单项默认值 |
| display | string | false | 配置表单项的展示形式，可设置为'section'或'group' |

## 如何实现联动

通过支持函数表达式实现表单组件间的联动。配置项中`config`属性、`dependence`属性支持使用函数表达式接收一下三个参数：

- `rootValue` 整个 form 的值 (当两个关联组件距离较远时，可以从顶层的 rootValue 里获取)
- `parentValue` 父组件的值 (上一级的值，方便从中获取所有兄弟组件的值)
- `context` 上下文对象 (与表单相关的其他数据、表单项之间的联动数据等 )

当使用 json 文件作为配置对象时，以`{{}}` 作为提示符，将其包含的字符串作为函数解析并返回运算结果

```js
 show: '{{!!rootValue.isShow }}',
 show : (rootValue)=> !!rootValue.isShow
```

## 如何实现依赖

通过表达式来实现依赖关系，`dependence`属性提供`show`，`hide`，`disabled`及`value`属性实现表单项之间的显示、隐藏、禁用和设值

`value`属性是一个对象，有两个属性: `condition` `set`

属性 condition 的值是一个表单式，当表达式为真时，将该配置项的表单值设值为 set 属性的值

```js
{
    field：'content'
    condition: '{{!!rootValue.isSetDefault}}',
    set: 'hello,word'
}
```

当 formData 中 isSetDefault 为真时，formData.content 赋值为'hello,word'

## 内置组件对照表

DynamicFormRender 内置了一些基础组件，Type 对照表如下表所示：

| Type            | 组件                   | Description  | config           |
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

## 组合简单组件成为复合表单组

通过配置`group`字段和`fields`字段实现将简单的表单项组合成复杂的表单项组。  
::: tip 注意  
当配置项中`field`字段存在且不为空时，复合表单项中所有字段组成的数据对象将存放在`field`对应的字段中  
:::

```json
[
  {
    "group": "基本信息",
    "field": "basicInfo",
    "label": "基本信息",
    "fileds": [
      {
        "field": "name",
        "label": "姓名",
        "type": "input"
      },
      {
        "field": "sex",
        "label": "性别",
        "type": "checkboxGroup",
        "config": {
          "options": [
            {
              "id": 1,
              "text": "男"
            },
            {
              "id": 2,
              "text": "女"
            }
          ]
        },
        "default": 1
      },
      {
        "field": "mobilePhone",
        "label": "手机号码",
        "type": "input"
      },
      {
        "field": "message",
        "label": "留言",
        "type": "textarea"
      }
    ]
  }
]
```

当前配置生成的 formData 数据结构为：

```js
formData = {
  basicInfo: {
    name: '',
    sex: 1,
    mobilePhone: '',
    message: '',
  },
}
```

#### 复合表单组更多的展示样式

<br/>
设置`display`字段为`'section'`,复合表单组展示为一个 section,复合表单组外具有外边框  
<br/>
<br/>

<script>
export default {
  name: 'App',
  data() {
    const renderStructure = [{
      group:'section组',
      display:'section',
      label:'基本信息',
      fields: [
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
    ]},
    {
      group:'联系方式',
      label:'联系方式',
      field:'contact',
      display:'section',
      fields:[
      {
        field:'postcode',
        label:'邮编',
        type:'input'
      },
      {
        field:'address',
        label:'家庭地址',
        type: 'input'
      },
      {
        field:'email',
        label:'邮箱',
        type:'input'
      }]
    },
    ]
    return {
      iData: {},
      renderStructure,
    }
  },
}
</script>
<template>
    <dynamic-form
      :structure="renderStructure"
      v-model="iData"
      ref="exampleForm"
      :disabled="false"
    />
</template>
<p>表单数据：{{ iData }}</p>

::: details 点击查看代码

```vue
<template>
  <dynamic-form
    :structure="renderStructure"
    v-model="iData"
    ref="exampleForm"
    :disabled="false"
  />
</template>
<script>
export default {
  name: 'App',
  data() {
    const renderStructure = [
      {
        group: 'section组',
        display: 'section',
        label: '基本信息',
        fields: [
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
        ],
      },
      {
        group: '联系方式',
        label: '联系方式',
        field: 'contact',
        display: 'section',
        fields: [
          {
            field: 'postcode',
            label: '邮编',
            type: 'input',
          },
          {
            field: 'address',
            label: '家庭地址',
            type: 'input',
          },
          {
            field: 'email',
            label: '邮箱',
            type: 'input',
          },
        ],
      },
    ]
    return {
      iData: {},
      renderStructure,
    }
  },
}
</script>
```

:::

## 注册自定义组件

使用自定义组件，可在注册自定义组件后进行使用。  
在 main.js 文件中注册 DynamicFormRender 时，通过配置 `registerConfig` 注册自定义组件。

```js
Vue.use(dynamicFormRender, registerConfig)
```

`registerConfig`对象包含以下三个字段:

| Prop         | Type   | Description              |
| ------------ | ------ | ------------------------ |
| components   | Object | 需要注册的自定义组件集合 |
| fieldTypeMap | Object | 自定义组件与 Type 对应表 |
| fieldDefault | Object | 自定义组件默认值对照表   |

1. `fieldDefault`对象描述了自定义组件在各种情况下的默认赋值。

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| defaultValue | Function | () => {return ' ' } | 初始化默认值的赋值函数 |
| cleanValue | Function | () => {return ' ' } | 清空组件 value 值时的赋值函数 |
| itemDataScope | Function | - | 对子级对象进行初始时的赋值函数 |

#### 例子

在 main.js 文件中写入以下内容：

```js
import Vue from 'vue'
import dynamicFormRender from 'dynamic-form-render'
import elInput from 'element-ui/lib/input'
import checkbox from 'element-ui/lib/checkbox'
const registerConfig = {
  components: {
    elInput,
    checkbox,
  },
  fieldTypeMap: {
    input: 'elInput',
    checkbox: 'checkbox',
  },
  fieldDefault: {
    checkboxGroup: {
      defaultValue: () => {
        return []
      },
      cleanValue: () => {
        return []
      },
    },
  },
}
Vue.use(dynamicFormRender)
```
