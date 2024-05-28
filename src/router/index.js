import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../views/Home.vue'
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(VueRouter).use(ElementUI);
Vue.use(VueRouter)
const routes = [{
    path: '/',
    name: 'index',
    component: index,
}, ]

const router = new VueRouter({
    routes
})

export default router