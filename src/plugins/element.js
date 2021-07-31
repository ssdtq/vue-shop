import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

// 全局挂载
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$Message = Message
