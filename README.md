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

详细文档见[dynamic-form-render文档](https://prettywhitewhite.github.io/dynamic-form-render/)