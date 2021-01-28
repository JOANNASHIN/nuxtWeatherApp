import Vue from "vue";
// import VueMeta from "vue-meta";
// import UtilMixins from "./assets/Global";
// Vue.mixin(UtilMixins);


const mixin = {
    /**
     * @param {import ("vue").VueConstructor} Vue
     */
    install(Vue) {
        Vue.mixin({
            asyncData(context) {
                console.log("믹스인~")

                return context.$axios
                .get('http://jsonplaceholder.typicode.com/posts/1')
                .then((res) => {
                    return { fetchedData: res.data }
                })
            },
            head() {
                return {
                // title: this.fetchedData.title,
                title: "zzzzZ",
                meta: [
                    {
                    hid: 'description',
                    name: 'description',
                    content: this.fetchedData.body
                    }
                ]
                }
            },
            data() {
                return {

                }
            },
        }
    )}
}

// export default mixin;
export default mixin;


// Vue.use(VueMeta);
