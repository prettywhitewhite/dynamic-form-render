<template>
  <div class="dy-content-textarea">
    <div
      :class="{
        'dy-content-textarea__input': true,
        'show-dynamic-nick-name': dynamic,
      }"
    >
      <div v-if="dynamic" v-html="iHtml" class="dy-content-textarea__mask" />
      <el-input
        v-model="iValue"
        class="dy-content-textarea__inner"
        type="textarea"
        :autosize="{minRows: 8}"
        resize="none"
        ref="textarea"
        v-bind="$attrs"
        @input.native="handleInputNative"
        @click.native="getTextCursorPosition"
        @keyup.left="getTextCursorPosition"
        @keyup.right="getTextCursorPosition"
        @change.native="getTextCursorPosition"
      />
      <span v-if="showWordLimit" class="dy-content-textarea__input__count">
        <span :class="{'is-overflow': max && count > max}">{{ count }}</span>
        <span v-if="max">/{{ max }}</span>
      </span>
    </div>
    <div v-if="dynamic">
      <p class="dy-content-textarea__tips">
        请谨慎使用该符号
        <span>「「 &nbsp;」」</span>，会触发动态昵称功能，用户被@昵称！
      </p>
      <el-button @click="insertDynamicName" type="primary"
        >插入动态昵称</el-button
      >
    </div>
  </div>
</template>
<script>
import registerComponent from '@mixins/registerComponent'
import wbCharCount from '@utils/wbCharCount'
import elInput from 'element-ui/lib/input'
export default {
  name: 'DyContentTextarea',
  mixins: [registerComponent],
  components:{
    elInput
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    path: {
      type: String,
      default: '',
    },
    showWordLimit: {
      // 是否显示输入字数统计
      type: Boolean,
      default: true,
    },
    max: {
      type: Number,
      default: 0,
    },
    dynamic: {
      // 动态昵称
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      iValue: '',
      insertPosition: 0,
      defaultRules: [
        {
          validator: this.validateCount,
        },
      ],
    }
  },
  computed: {
    count() {
      return wbCharCount(this.iValue)
    },
    iHtml() {
      let str = this.iValue || ''
      str = str.replace(/\x20/g, '&nbsp')
      str = str.replace(/「「[0-9a-zA-Z\u4e00-\u9fa5_-]*」」/g, function(
        e,
        index
      ) {
        if (e === '「「在此输入默认词」」') {
          return '「「<span class="dy-content-textarea__mask__placeholder">在此输入默认词</span>」」'
        } else {
          const endIndex = str.indexOf('」」', index)
          return (
            '「「<span class="dy-content-textarea__mask__light">' +
            str.substring(index + 2, endIndex) +
            '</span>」」'
          )
        }
      })
      return str
    },
    dynamicCreative() {
      const str = this.getValue(this.iValue)
      let arr = []
      const result = str.match(/{{[0-9a-zA-Z\u4e00-\u9fa5_-]*}}/g)
      if (result) {
        result.forEach(e => {
          arr.push({
            package_type: 1,
            default_word: e.replace(/[{{}}]/g, ''),
            defined: e,
            replace_word: '',
          })
        })
      }
      return arr
    },
  },
  watch: {
    value: {
      handler(val) {
        this.iValue = this.setLocalValue(val)
      },
      immediate: true,
    },
    iValue: {
      handler: function(val) {
        if (this.dynamic) {
          this.$emit('input', this.getValue(val))
          this.$emit('dynamicArrayChange', this.dynamicCreative)
        } else {
          this.$emit('input', val)
        }
      },
    },
    insertPosition: {
      handler(val) {
        let str = this.iValue
        str.replace(/「「在此输入默认词」」/g, (e, index) => {
          let startIndex = index
          let endIndex = str.indexOf('」」', index)
          if (val > startIndex && val < endIndex) {
            this.setTextCursorPosition(startIndex + 2, endIndex)
          }
        })
      },
    },
  },

  methods: {
    handleInputNative(event) {
      this.iValue = event.target.value
    },
    insertDynamicName() {
      // 插入动态昵称
      let str = this.iValue || ''
      this.iValue =
        str.substring(0, this.insertPosition) +
        `「「在此输入默认词」」` +
        str.substring(this.insertPosition)
    },
    getTextCursorPosition() {
      if (!this.$textarea) {
        this.$textarea = this.$refs['textarea'].$el.querySelector('textarea')
      }
      let $textarea = this.$textarea
      let position = 0
      if ($textarea.selectionStart) {
        position = $textarea.selectionStart
      } else if (document.selection) {
        let range = document.selection.createRange()
        range.moveStart('character', $textarea.value.length)
        position = range.text.length
      }
      this.insertPosition = position
    },
    setTextCursorPosition(startPos, endPos) {
      if (!this.$textarea) {
        this.$textarea = this.$refs['textarea'].$el.querySelector('textarea')
      }
      let $textarea = this.$textarea
      if ($textarea.selectionStart) {
        $textarea.selectionStart = startPos
        $textarea.selectionEnd = endPos
      }
    },
    setLocalValue(str) {
      if (!str) {
        return ''
      }
      const localStr = str.replace(/{{[0-9a-zA-Z\u4e00-\u9fa5_-]*}}/g, function(
        e,
        index
      ) {
        if (e === '{{}}') {
          return '「「在此输入默认词」」'
        } else {
          const endIndex = str.indexOf('}}', index)
          return '「「' + str.substring(index + 2, endIndex) + '」」'
        }
      })
      return localStr
    },
    getValue(str) {
      if (!str) {
        return ''
      }
      const _str = str.replace(/「「[0-9a-zA-Z\u4e00-\u9fa5_-]*」」/g, function(
        e,
        index
      ) {
        if (e === '「「在此输入默认词」」') {
          return '{{}}'
        } else {
          const endIndex = str.indexOf('」」', index)
          return '{{' + str.substring(index + 2, endIndex) + '}}'
        }
      })
      return _str
    },
    validateCount(rule, value, callback) {
      if (this.max && wbCharCount(this.iValue) > this.max) {
        return callback(`博文内容字数超出限制，最多可输入${this.max}字`)
      }
      callback()
    },
  },
}
</script>
