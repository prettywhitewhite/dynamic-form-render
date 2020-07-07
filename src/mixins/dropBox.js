import {nth, get} from 'lodash'
const dropBoxMixin = {
  name: 'DyDropBoxMixin',
  mounted() {
    this.addDragEvent()
  },
  methods: {
    addDragEvent() {
      // 添加拖曳监听事件
      const dropBox = this.$refs['dropBox']
      if (dropBox) {
        dropBox.addEventListener('dragenter', this.onDrag, false)
        dropBox.addEventListener('dragover', this.onDrag, false)
        dropBox.addEventListener('dragleave', this.onDragLeave, false)
        dropBox.addEventListener('drop', this.onDrop, false)
      }
    },
    // 拖曳ing
    onDrag(e) {
      e.stopPropagation()
      e.preventDefault()
      this.status = 'dropover'
    },
    onDragLeave() {
      this.status = 'init'
    },

    // 放置拖曳文件
    onDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      const files = get(e.dataTransfer, 'files')
      const file = nth(files, 0)
      if (file) {
        this.fileChange(file)
      }
    },
    fileChange(/**file*/) {
      // 准备上传视频
    },
  },
}
export default dropBoxMixin
