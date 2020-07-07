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

### API

| prop | Type | Default | Description |
| --- | --- | --- | --- |
| value | Object | {} | 表单数据对象，可使用 v-model 实现数据双向绑定 |
| structure | Array | [] | 表单渲染配置 json |
| disabled | Boolean | false | 禁用表单 |
| labelWidth | String | 140px | 表单域标签的宽度，例如 '50px'。作为 Form 直接子元素的 form-item 会继承该值。支持 auto |
| context | Object | {} | 表单上下文 |

### structure

field: 表单项对应的数据字段 prop  
label: 表单项的表单名  
type: 表单项对应的前端组件名  
config: 组件配置项 dependence：表单依赖规则 default: 默认值
