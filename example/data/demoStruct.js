const renderJson = [
  {
    field: 'multiGroup',
    type: 'multiGroup',
    config: {
      defaultCount: 2,
    },
    fields: [
      {
        field: 'url',
        type: 'input',
        label: '链接',
        dependence: (rootValue, parentValue, context) => {
          return {
            show: context._multiGroupIndex !== 0,
          }
        },
        rules: {
          required: true,
        },
        desc: '测试',
      },
      {
        field: 'uid',
        type: 'input',
        label: 'uid',
      },
    ],
  },

  {
    field: 'inputAsync',
    type: 'input',
    label: '远程校验',
    config: (rootValue, parentValue, context) => {
      return {
        api: value => {
          return {
            url: /fid=(\d+:[\da-zA-Z]+)/.test(value)
              ? 'get_video_info_by_fid'
              : 'get_video_info_by_short_url',
            method: 'GET',
            query: val => ({
              short: val,
            }),
          }
        },
        on: {
          change: target => {
            context.set('target', target === '1111')
          },
        },
      }
    },
  },
  {
    field: 'switch',
    type: 'switch',
    label: '切换',
    dependence: {
      disabled: (root, parent, context) => {
        return !!context.target
      },
    },
  },
  {
    field: 'checkbox',
    type: 'checkbox',
    label: '复选',
  },
  {
    group: 'group',
    dependence: {
      show: rootValue => {
        return rootValue.switch
      },
    },
    fields: [
      {
        field: 'radioGroup',
        type: 'radioGroup',
        label: '单选按钮组',
        config: {
          options: [
            {
              id: 1,
              text: '文本1',
            },
            {
              id: 2,
              text: '文本2',
            },
          ],
        },
        default: 2,
      },
      {
        type: 'text',
        label: '文本',
        config: {
          text: '我是文本内容',
        },
      },
      {
        field: 'content',
        type: 'contentTextarea',
        label: '微博内容',
        config: {
          placeholder: '测试',
          dynamic: true,
        },
        rules: [
          {
            required: true,
          },
        ],
      },
    ],
  },
  {
    field: 'upload',
    type: 'upload',
    label: '上传文件',
    config: {
      action: '/ajax/upload',
    },
    rules: [
      {
        required: true,
        message: '请上传视频',
      },
    ],
    default: 'iii',
  },
  {
    field: 'redirect_method',
    type: 'radioGroup',
    label: '跳转方式',
    config: {
      options: [
        {
          id: 0,
          text: '链接',
        },
        {
          id: 1,
          text: '小程序',
        },
      ],
    },
    default: 1,
  },
  {
    group: 'card按钮',
    inline: true,
    fields: [
      {
        field: 'card_button_type',
        type: 'select',
        label: 'card按钮',
        config: {
          options: [
            {
              id: 1,
              text: '测试',
            },
            {
              id: 'custom',
              text: '自定义',
            },
          ],
        },
      },
      {
        field: 'card_button_text',
        type: 'input',
        config: rootValue => {
          return {
            placeholder: rootValue.card_button_text,
          }
        },
        dependence: {
          show: "{{parentValue.card_button_type === 'custom'}}",
        },
        rules: [
          {
            required: 'false',
            message: '请输入自定义按钮名称',
            trigger: 'blur',
          },
          {
            max: 4,
            message: '自定义按钮名称不能超过4字',
            trigger: 'blur',
            word: true,
          },
        ],
      },
    ],
  },
  {
    field: 'card_button_url',
    type: 'input',
    label: 'card按钮链接',
    config: {
      placeholder: '请输入card按钮链接',
      type: 'link',
    },
    dependence: {
      show: "{{parentValue.card_button_type !== 'none'}}",
    },
    rules: [
      {
        required: 'true',
        message: '请输入自定义按钮链接',
      },
    ],
  },
  {
    group: true,
    dependence: {
      show: '{{rootValue.redirect_method === 1 }}',
    },
    fields: [
      {
        field: 'wechat_applet_name',
        type: 'input',
        label: '小程序名称',
        config: {
          placeholder: '名称不超过14个字',
        },
        rules: [
          {
            required: 'true',
            message: '请输入小程序名称',
          },
        ],
      },
      {
        field: 'wechat_applet_path',
        type: 'input',
        label: '小程序链接',
        config: {
          placeholder: '请输入小程序链接',
          type: 'link',
        },
      },
      {
        field: 'url',
        type: 'input',
        label: '落地页链接',
        tips: '当小程序打开失败时，客户端自动呼起落地页链接',
        config: {
          placeholder: '请输入落地页链接',
          type: 'link',
        },
        rules: [
          {
            required: 'true',
            message: '请输入落地页链接',
          },
        ],
      },
    ],
  },
  {
    field: 'display_name',
    type: 'input',
    label: 'card标题',
    config: {
      placeholder: 'card标题不超过14个字',
    },
    rules: [
      {
        required: 'true',
        message: '请输入自定义按钮名称',
      },
    ],
  },
  {
    field: 'summary',
    type: 'input',
    label: 'card简介',
    config: {
      placeholder: 'card简介不超过34个字',
    },
    rules: [
      {
        required: 'true',
        message: '请输入自定义按钮名称',
      },
    ],
  },
  {
    group: true,
    config: {
      inline: true,
    },
    dependence: {
      show: '{{rootValue.redirect_method === 0}}',
    },
    fields: [
      {
        field: 'url',
        type: 'input',
        label: 'card链接',
        tips: '测试',
        config: {
          placeholder: '请输入card链接',
          type: 'mid',
        },

        rules: [
          {
            required: 'true',
            message: '请输card链接',
          },
        ],
      },
    ],
  },
]
export default renderJson
