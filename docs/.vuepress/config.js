module.exports={
	base:'/dynamic-form-render/',
	title:'dynamic-form-render',
	description:'dynamic-form-render 是基于vue.js ,element-ui 的前端动态表单渲染器，可通过配置文件快速的生成 form 表单。',
	themeConfig:{
		nav:[
			{
				text: '指南',link: '/guide/'
			},
			{
				text:'配置',link:'/options/'
			},
			{
				text:'组件',link:'/components/text'
			},
		],
		displayAllHeaders: true,
		sidebarDepth: 3,
		sidebar: {
			'/guide/':[
						'',
						'start',
				 ], 
			'/options/':[''],
			'/components/':[
				{
					title: '组件',
					collapsable: false,
					children: [
						['/components/text.md','Text 文本'],
						['/components/checkboxGroup.md','CheckboxGroup 多选框'],
						['/components/textarea.md','Textarea 文本输入框']
					],
				},
			]	 
		}
	},
}