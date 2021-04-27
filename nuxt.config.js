export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'weatherApp',
    
    htmlAttrs: {
      lang: 'ko'
    },
    
    meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, viewport-fit=cover, user-scalable=no' },
        { httpEquiv: 'X-UA-Compatible', content: 'ie=edge' },
        { hid: 'description', name: 'description', content: '' }
    ],
    
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', sizes: '96x96', href: '/favicon96x96.png' }
    ],
    
    bodyAttrs: {
        class: "fb"
    },

    script: [
        {src: `//dapi.kakao.com/v2/maps/sdk.js?appkey=9ec652bd0d4224b306e150a002233b10&libraries=services,clusterer,drawing`},
        {src: "/__/firebase/8.4.1/firebase-app.js"},
        {src: "/__/firebase/init.js"},
    ]
  },

  //dev모드에서 자동 새로고침
  watchers: {
	webpack: {
	  aggregateTimeout: 300,
	  poll: 1000
	}
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "@/assets/scss/app.scss"
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "~/plugins/global.js"
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },
}
