<template>
  <div class="example">
    <dynamic-form
      :structure="struct"
      v-model="iData"
      ref="form"
      :disabled="false"
      :context.sync="context"
    />
    <div slot="footer">
      <el-button @click="validateForm">校验</el-button>
      <el-button @click="reset">清空校验</el-button>
    </div>
  </div>
</template>
<script>
import struct from './data/demoStruct.js'
export default {
  name: 'App',
  data() {
    const renderStructure = [
      {
        field: 'show',
        label: '是否显示输入框',
        type: 'switch',
        default: true,
      },
      {
        field: 'name',
        label: '姓名',
        type: 'input',
        config: {
          placeholder: '请输入姓名',
        },
        dependence: {
          show: (rootValue, parentValue, context) => rootValue.show,
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
        text: false,
      },
      struct,
      renderStructure,
    }
  },
  watch: {
    iData: {
      handler(val) {
        console.log('::iData', val)
      },
      deep: true,
    },
    context: {
      handler(context) {
        console.log('::context', context)
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    validateForm() {
      this.$refs['form'].validate().then(valid => {
        console.log('::valid', valid)
      })
    },
    reset() {
      this.$refs['form'].clearValidate()
    },
  },
}
</script>
<style lang="scss">
.example {
  background: #ffffff;
  padding: 50px 40px;
}
</style>
