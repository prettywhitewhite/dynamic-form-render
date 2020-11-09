# 配置

## 表单基本配置

### field

- 类型 `string`
- 默认值 `''`  
  当前表单项对应 formData 中的字段名

### label

- 类型 `string`
- 默认值 `-`  
  表单项对应的标签文本  
  不设置`label` 时，表单域标签的的宽度为 0；设置`label`为`''`时，表单域标签的的宽度为`label-width`

### type

- 类型 `string`
- 默认值 `-`  
  表单项对应的前端组件名，内置组件对应表详见[内置组件对照表](/guide/start.html#内置组件对照表)  
  使用自定义组件，可在注册自定义组件后再使用， 注册自定义组件，详见[注册自定义组件](/guide/start.html#注册自定义组件)

### dependence

- 类型 `object`
- 默认值 `-`  
   表单依赖规则，提供 show，hide, disabled， value 实现显示、隐藏、禁用和设值。  
   | 参数 | 类型 | 默认值 | 可选值 |说明  
   | --- | --- | --- | --- | --- |  
   | show| boolean| true | - | 值为 true 时，显示表单项|  
   | hide| boolean | false | - | 值为 false 时，隐藏表单项 |  
   | disabled| boolean | false | - | 值为 true 时，禁用表单项 |  
   | set | object | - | - | 字段`condition`为真时，将`value`字段的值赋值到表单域对应 formData 中的`field`中 |  
  注意： `dependence`支持使用函数表达式联动实现依赖。详见[如何实现联动](/guide/start.html#如何实现联动)

#### 1. 显示表单项

`show`不为 false 且`hide`不为 true。

```json
// formdata.showItem = true
{
  "dependence": {
    "show": "{{!!rootValue.showItem}}"
  }
}
// 或
{
   "dependence": {
    "hide": "{{!rootValue.showItem}}"
  }
}
```

#### 2.隐藏表单项

`show`为 false 或`hide`为 true。

```json
// formdata.showItem = true
{
  "dependence": {
    "show": "{{!rootValue.showItem}}"
  }
}
// 或
{
   "dependence": {
    "hide": "{{!!rootValue.showItem}}"
  }
}
```

#### 3. 禁用表单项

`disabled`为 true

```json
// formdata.disabled = true
{
  "dependence": {
    "disabled": "{{rootValue.disabled}}"
  }
}
```

#### 4. 为表单项设值

字段`condition`为真时，将`value`字段的值赋值到表单域对应 formData 中的`field`中

```json
{
  "field": "name",
  "type": "input",
  "label": "姓名",
  "dependence": {
    "set": {
      "condition": "{{!!rootValue.setValue}}",
      "value": "小明"
    }
  }
}
```

当`!!formdata.setValue`为 true 时 `formData.name` = `'小明'`

### config

- 类型 `object`
- 默认值 `-`
- 支持使用函数表达式联动实现联动  
  `config`字段可以配置表单域组件的 props 属性 ，`config.on`可以配置组件中的事件处理

#### 例 1.为输入框配置 `placeholder` 属性

<script>
export default {
  data() {
    const renderStructure1 = [
      {
        field: 'name',
        label: '姓名',
        type: 'input',
        config: {
          placeholder: '请输入姓名...',
        },
      },
    ]
    const renderStructure2 = [
  {
    field: 'type',
    type: 'radioGroup',
    label: '证件类型',
    config: rootValue => ({
      options: [
        {
          id: 'studentIdCard',
          text: '学生证',
        },
        {
          id: 'idCard',
          text: '身份证',
        },
      ],
      on: {
        change: () => {
          rootValue.cardNumber = ''
        },
      },
    }),
  },
  {
    field: 'cardNumber',
    type: 'input',
    label: '证件号',
    config: {
      placeholder: '请输入证件号',
    },
  },
]
const renderStructure3 = [
      {
        field: 'name',
        label: '姓名',
        type: 'input',
        config: {
          placeholder: '请输入姓名',
        },
        rules: {
          required: true,
          message: '请输入您的姓名',
        },
      },
      {
        field: 'sex',
        label: '性别',
        type: 'checkboxGroup',
        config: {
          options: [
            {
              id: 1,
              text: '男',
            },
            {
              id: 2,
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
        rules: [
          {
            required: true,
            message: '请输入手机号码',
          },
          {
            validator: (rule, value, callback) => {
              if (!/^1(3|4|5|6|7|8|9)d{9}$/.test(value)) {
                return callback('请输入正确的手机号码')
              }
              callback()
            },
            trigger: 'blur',
          },
        ],
      },
      {
        field: 'message',
        label: '留言',
        type: 'textarea',
        config: {
          placeholder: '请留言',
          showWordLimit: true,
          max: 30,
          word: true,
        },
        rules:{
          max: 30,
          word: true
        }
      },
    ]
    return {
      iData1: {},
      iData2: {},
      iData3: {},

      renderStructure1,
      renderStructure2,
      renderStructure3
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

#### 配置

```json
[
  {
    "field": "name",
    "label": "姓名",
    "type": "input",
    "config": {
      "placeholder": "请输入姓名..."
    }
  }
]
```

#### 输出：

<template>
   <dynamic-form
      :structure="renderStructure1"
      v-model="iData1"
    />
</template>

#### 例 2.为 checkbox 配置 `change` 事件

#### 配置

```js
const renderStructure = [
  {
    field: 'type',
    type: 'radioGroup',
    label: '证件类型',
    config: rootValue => ({
      options: [
        {
          id: 'studentIdCard',
          text: '学生证',
        },
        {
          id: 'idCard',
          text: '身份证',
        },
      ],
      on: {
        change: () => {
          rootValue.cardNumber = ''
        },
      },
    }),
  },
  {
    field: 'cardNumber',
    type: 'input',
    label: '证件号',
    config: {
      placeholder: '请输入证件号',
    },
  },
]
```

#### 输出：

<template>
   <dynamic-form
      :structure="renderStructure2"
      v-model="iData2"
    />
</template>

### rules

- 类型 `object`| `Array`
- 默认值 `-`  
  表单项校验规则，与 elForm 保持一致

#### 例 表单验证

<template>
   <div class="demo-block">
   <dynamic-form 
      ref="exampleForm"
      :structure="renderStructure3"
      v-model="iData3"
    >
    	<div slot="footer" :style="{'text-align':'center'}">
        <el-button @click="save">保存</el-button>
        <el-button @click="resetFields">清空</el-button>
    </div>
    </dynamic-form>
   </div>
</template>

::: details 点击查看配置

```js
const renderStructure = [
  {
    field: 'name',
    label: '姓名',
    type: 'input',
    config: {
      placeholder: '请输入姓名',
    },
    rules: {
      required: true,
      message: '请输入您的姓名',
    },
  },
  {
    field: 'sex',
    label: '性别',
    type: 'checkboxGroup',
    config: {
      options: [
        {
          id: 1,
          text: '男',
        },
        {
          id: 2,
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
    rules: [
      {
        required: true,
        message: '请输入手机号码',
      },
      {
        validator: (rule, value, callback) => {
          if (!/^1(3|4|5|6|7|8|9)d{9}$/.test(value)) {
            return callback('请输入正确的手机号码')
          }
          callback()
        },
        trigger: 'blur',
      },
    ],
  },
  {
    field: 'message',
    label: '留言',
    type: 'textarea',
    config: {
      placeholder: '请留言',
      showWordLimit: true,
      max: 30,
      word: true,
    },
    rules: {
      max: 30,
      word: true,
    },
  },
]
```

:::

### default

- 类型 `string`
- 默认值 `-`  
  为表单域值设值默认值。

#### 例 为输入框设值默认值

#### 配置

```js
const renderStructure = [
  {
    field: 'name',
    label: '姓名',
    type: 'input',
    default: '张三',
  },
]
```

#### 输出

<template>
   <dynamic-form
      :structure="renderStructure2"
      v-model="iData2"
    />
</template>

### prefixIcon

- 类型 `string`
- 默认值 `-`  
  表单项的标签名头部图标

### suffixIcon

- 类型 `string`
- 默认值 `-`  
  表单项的标签名尾部图标

### tip

- 类型 `string`
- 默认 `-`  
  表单项提示文案

### desc

- 类型 `string`
- 默认 `-`  
  表单项描述文案

  ### reset

- 类型 `boolean`
- 默认 `false`  
  设置为 true 时，当表单项隐藏时清空已填内容。

  ### desc

- 类型 `string`
- 默认 `-`  
  表单项描述文案

### group

- 类型 `string`
- 默认值: `''`  
  配置 group 字段时，将渲染该配置项中 fields 字段下的所有表单项组合成为一个复合表单项组。详见[复合表单项](/options/#复合表单项)

### fields

- 类型 `Array`
- 默认值 `[]`  
   group 属性不为空时 或 type 类型为 multiGroup 时有效。  
   当 group 属性不为空时，将渲染 fields 字段中所有表单项组合成为一个复合表单项组。 详见[复合表单项](/options/#复合表单项)

### display

- 类型 `string`
- 默认值 `-`
- 可选值 `'section'`|`'group'`  
  配置表单项的展示形式，可设置为'section'或'group',详见[复合表单项](/options/#复合表单项)
