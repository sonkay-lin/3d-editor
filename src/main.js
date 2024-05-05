import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './styles/dark/css-vars.css'
import './styles/common.scss'
import '@/assets/fonts/iconfont.css'
import Color from '@/components/common/Color.vue'
import SlideInput from '@/components/common/SlideInput.vue'
import ICon from '@/components/common/ICon.vue'
import Texture from '@/components/common/Texture.vue'
import 'splitpanes/dist/splitpanes.css'

const app = createApp(App)
app.component('ICon', ICon)
app.component('Color', Color)
app.component('SlideInput', SlideInput)
app.component('Texture', Texture)
app.use(ElementPlus).mount('#app')
