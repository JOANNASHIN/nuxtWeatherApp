export default {
    asyncData(context) {
        // return context.$axios
        //             .get('http://jsonplaceholder.typicode.com/posts/1')
        //             .then(res => {
        //                 return { 
        //                     fetchedData: res.data
        //                 }
        //             })
    },

    head() {
        return {
            title: "account App",
            meta: [
                {
                    hid: "description",
                    name: "description",
                    content: "가계부 앱 포트폴리오 어플리케이션"
                },
            ]
        }
    },

    data() {
        return {
            
        }
    },

    created() {
        if (process.server) {
            console.log("서버사이드 렌더링중")
        }
    },

    methods: {
        
    }
}