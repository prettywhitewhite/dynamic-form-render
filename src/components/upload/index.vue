<template>
  <div
    :class="[
      'dy-upload',
      `dy-upload--${status}`,
      {
        'is-disabled': disabled,
        'is-upload-available': uploadAvailable,
        'is-remove-disabled': disabledRemove,
      },
    ]"
  >
    <span v-show="status === 'dropover'">+ 文件拖曳到这里</span>
    <span v-show="status === 'checking'">文件检测中...</span>
    <span v-show="status === 'uploading'">文件上传中...</span>
    <div v-show="showUploader" class="dy-upload__uploader">
      <div class="dy-upload__tip">
        <i :class="[localUploadIcon, 'dy-upload__tip__icon']" />
        <span v-show="status !== 'success'">
          <span class="dy-upload__faild__text" v-if="status === 'faild'"
            >上传失败，请重新上传</span
          >
          <span v-else-if="showUploadTip" class="dy-upload__tip__text">
            {{ uploadTip }}
          </span>
        </span>
      </div>
      <div class="dy-file-uplaoder__text">
        <slot name="tips"></slot>
        <p
          class="dy-upload__text__limit-type"
          v-if="status !== 'success' && limitText"
        >
          {{ limitText }}
        </p>
        <p
          v-else-if="status === 'success' && (title || localFileName)"
          class="dy-upload__file-name"
        >
          {{ localFileName || title }}
        </p>
      </div>
      <i
        class="el-icon-remove dy-file-uplaoder__remove"
        @click="handleRemove"
      />
    </div>
    <input
      v-show="uploadAvailable"
      ref="dropBox"
      class="dy-upload__input"
      type="file"
      name="videoFile"
      :accept="accept"
      @change="handleChange"
    />
  </div>
</template>
<script>
import api from '@services/api'
import emitter from '@mixins/emitter'
import registerComponent from '@mixins/registerComponent'
import dropBoxMixin from '@mixins/dropBox'
import {isPromise} from '@utils/utils'
const DyUpload = {
  name: 'DyUpload',
  mixins: [dropBoxMixin, emitter, registerComponent],
  props: {
    value: {
      // 使用v-model进行绑定
      require: true,
    },
    action: {
      // 上传的地址
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    fileName: {
      // 文件名 .sync 同步
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    disabledUpload: {
      // 禁止上传
      type: Boolean,
      default: false,
    },
    disabledRemove: {
      // 禁止移除
      type: Boolean,
      default: false,
    },
    size: {
      // 文件大小限制
      type: Number,
      default: 0,
    },
    sizeUnit: {
      // 文件大小限制
      type: String,
      default: 'M', // k | M
    },
    format: {
      // 文件格式限制
      type: Array,
      default: () => {
        return []
      },
    },
    accept: {
      type: String,
      default: '',
    },
    uploadTip: {
      // 上传提示文案
      type: String,
      default: '选择/拖拽上传文件',
    },
    uploadIcon: {
      type: [String, Array],
      default: '',
    },
    onSuccess: {
      // 文件上传成功时钩子 （response, Success ,Error,file）
      type: Function,
    },
    beforeUpload: {
      // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传
      type: Function,
    },
    httpRequest: {
      // 覆盖默认的上传行为，可以自定义上传的实现  http: {file,onSuccess,onError,handleProgress}
      type: Function,
    },
    silent: {
      // 使用action上传时，是否出现报错弹框
      type: Boolean,
      default: true,
    },
    data: {
      // 上传时附带的额外参数
      type: Object,
      default: () => ({}),
    },
    /**
     *  event
     *  fileChange: (file)=>{}上传源文件变化
     *  remove  删除文件事件
     *  faild   上传失败事件
     *  success（url, file） 上传成功事件
     */
  },
  data() {
    return {
      status: 'init', // init、dropover、checking、uploading 、success 、error、faild
      errorText: '',
      percent: 0,
      localFileName: this.fileName,
      iValue: '',
      file: '', // 存储文件
    }
  },
  computed: {
    limitText() {
      if (this.size > 0 || this.upperCaseFormat.length > 0) {
        const format =
          this.upperCaseFormat.length > 0
            ? `支持${this.upperCaseFormat.join('、')}格式`
            : ''
        const size = this.size > 0 ? `文件小于${this.size}${this.sizeUnit}` : ''
        const symbol = format && size ? '，' : ''
        return format + symbol + size
      } else {
        return ''
      }
    },
    showUploader() {
      return ['init', 'faild', 'error', 'success'].includes(this.status)
    },
    uploadAvailable() {
      return (
        !this.disabledUpload && ['init', 'faild', 'error'].includes(this.status)
      )
    },
    upperCaseFormat() {
      return this.format.map(i => {
        return String(i).toLocaleUpperCase()
      })
    },
    localUploadIcon() {
      if (this.status === 'success') {
        return !_.isEmpty(this.uploadIcon)
          ? _.isArray(this.uploadIcon)
            ? _.last(this.uploadIcon) || _.head(this.uploadIcon)
            : this.uploadIcon
          : 'el-icon-document'
      }
      return !_.isEmpty(this.uploadIcon)
        ? _.isArray(this.uploadIcon)
          ? _.head(this.uploadIcon)
          : this.uploadIcon
        : 'el-icon-circle-plus-outline'
    },
    showUploadTip() {
      return !this.$slots.tips && !this.limitText
    },
  },
  watch: {
    value: {
      handler(val) {
        this.iValue = val
        this.init()
      },
      immediate: true,
    },
    iValue: {
      handler(val) {
        this.$emit('input', val)
        this.dispatchChange(val)
      },
    },
    localFileName(val) {
      this.$emit('update:fileName', val)
    },
  },
  methods: {
    init() {
      this.status = this.value ? 'success' : 'init' // init、dropover、uploading 、success 、error、faild
      if (!this.value) {
        this.$refs.dropBox && (this.$refs.dropBox.value = '')
      }
      this.validateFormItem()
    },
    handleChange(e) {
      this.clearValidate()
      this.status = 'init'
      const $target = e.target
      if ($target.files && $target.files.length > 0) {
        const file = $target.files[0]
        this.$emit('fileChange', file)
        this.file = file
        this.localFileName = file.name
        this.fileChange(file)
      }
    },
    fileChange(file) {
      this.fileCheck(file)
    },
    beforeUploadFile(file) {
      if (typeof this.beforeUpload === 'function') {
        let result = this.beforeUpload(file)
        if (typeof result === 'boolean') {
          result && this.uploadFile(file)
        } else if (isPromise(result)) {
          result
            .then(valid => {
              !!valid && this.uploadFile(file)
            })
            .catch(error => {
              this.displayErrorTip(error.message)
            })
        }
      } else {
        this.uploadFile(file)
      }
    },
    checkFileType(file) {
      // 验证文件格式
      if (this.upperCaseFormat.length > 0) {
        let fileType = file.name
          .substring(file.name.lastIndexOf('.') + 1)
          .toLocaleUpperCase()
        if (fileType === 'JPG') {
          fileType = 'JPEG'
        }
        if (!this.upperCaseFormat.includes(fileType)) {
          this.displayErrorTip(
            `上传格式错误，请上传${this.upperCaseFormat.join('/')}格式文件`
          )
          return false
        }
      }
      return true
    },
    checkFileSize(file) {
      // 验证文件大小
      if (this.size !== 0) {
        let maxSize =
          this.sizeUnit.toLocaleUpperCase() === 'M'
            ? this.size * 1024
            : this.size
        let fileSize = Number((file.size / 1024).toFixed())
        if (fileSize > maxSize) {
          this.displayErrorTip(`单个文件最大${this.size}${this.sizeUnit}`)
          return false
        }
      }
      return true
    },
    fileCheck(file) {
      this.changeStatus('checking')

      // 验证文件格式 和 文件大小
      if (this.checkFileType(file) && this.checkFileSize(file)) {
        this.beforeUploadFile(file)
      }
    },
    async defaultUploadFile(file) {
      const generalApi = this.slient ? api.httpSilent : api.http
      let formData = new FormData()
      formData.append('file', file)
      Object.keys(this.data).forEach(i => {
        formData.append(`${i}`, this.data[i])
      })
      try {
        let {data} = await generalApi.post(this.action, formData)
        if (this.onSuccess && typeof this.onSuccess === 'function') {
          const callbackData = this.onSuccess(
            data,
            this.handleSuccess,
            this.handleFaild,
            file
          )
          if (isPromise(callbackData)) {
            return callbackData.finally(() => {
              if (this.isStatus('uploading')) {
                this.handleSuccess(data.url || data.fid)
              }
            })
          }
        }
        if (this.isStatus('uploading')) {
          this.handleSuccess(data.url || data.fid)
        }
      } catch (err) {
        const errMsg = err.message || _.get(err, 'data.message')
        this.handleFaild(errMsg)
      }
    },
    // 上传文件到指定地址
    async uploadFile(file) {
      this.changeStatus('uploading')
      if (this.httpRequest && typeof this.httpRequest === 'function') {
        this.httpRequest({
          file: file,
          onSuccess: this.handleSuccess,
          onError: this.handleFaild,
          onProgress: this.handleProgress,
          checkStatus: this.isStatus,
        })
      } else {
        this.defaultUploadFile(file)
      }
    },

    handleProgress(percent) {
      this.percent = Number(percent).toFixed(2) + '%'
    },
    changeStatus(status) {
      this.status = status
    },
    isStatus(status) {
      return this.status === status
    },
    handleSuccess(val) {
      this.iValue = val
      this.changeStatus('success')
      this.$emit('success', val, this.file)
    },
    displayErrorTip(msg) {
      this.clearFile()
      this.changeStatus('error')
      this.validateFormItem(msg || '上传失败，请重试')
    },
    handleFaild(errMsg = '') {
      this.clearFile()
      this.changeStatus('faild')
      this.$emit('faild', errMsg || '上传失败，请重试')
      this.validateFormItem(errMsg || '上传失败，请重试')
    },
    // 删除已上传文件
    handleRemove() {
      if (!this.disabled && !this.disabledRemove) {
        this.clearFile()
        this.changeStatus('init')
        this.$emit('remove')
        this.$emit('fileChange')
      }
    },
    clearFile() {
      if (this.iValue) {
        this.iValue = ''
      }
      this.$refs.dropBox && (this.$refs.dropBox.value = '')
    },
  },
}
export default DyUpload
</script>
