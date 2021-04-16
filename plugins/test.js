import Vue from "vue";

const MyPlugin = () => {
    Vue.install = (Vue, options) => {
        console.log("options",options)
        Vue.myGlobalMethod = () => {
    
        }
    
    
        Vue.directive("my-directive", {
            bind(el, binding, vnode, oldVnode) {
                console.log("directive", el, binding, vnode, oldVnode)
            }
        })
    
        Vue.mixin({
            created() {
                console.log("믹스인//")
            },
            methods: {
                mixintest() {
                    console.log("mixintest")
                }
            }
        })
    
        Vue.prototype.$myMethod = (methodOptions) => {
            console.log("prototype:::",methodOptions)
        }
    }
}


// Vue.use(MyPlugin, { someOption: true })