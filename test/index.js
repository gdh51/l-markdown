import App from './src/App';
import Vue from 'vue';
import LComponents from '../packages/index'

Vue.use(LComponents);

new Vue({
    render: h => h(App)
}).$mount('#app');