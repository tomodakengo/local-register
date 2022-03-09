import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'

const store = createStore({
    state () {
        return {

        }
    },
    mutations: {

    }
})

createApp(App).mount('#app').use(store)
