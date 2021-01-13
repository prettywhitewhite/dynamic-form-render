import elButton from 'element-ui/lib/button'
export default {
  components: {
    elButton,
  },
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
        rules: {
          max: 30,
          word: true,
        },
      },
    ]
    return {
      iData1: {},
      iData2: {},
      iData3: {},

      renderStructure1,
      renderStructure2,
      renderStructure3,
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
