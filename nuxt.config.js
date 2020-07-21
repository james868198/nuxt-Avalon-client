import pkg from './package'

let outsideClick

module.exports = {
    mode: 'universal',
    server: {
        port: 3000, // default: 3000
        host: '0.0.0.0' // default: localhost,
    },
    gameServer: {
        port: 8080, // default: 8080
        host: '0.0.0.0' // default: localhost,
    },
    mariadb: {
        port: 3306,
        host: '127.0.0.1',
        user: 'james',
        password: 'james868198'
    },
    /*
    ** env setting variables
    */
    env: {},
    /*
    ** Headers of the page
    */
    head: {
        title: pkg.name,
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            {
                hid: 'description',
                name: 'description',
                content: pkg.description
            }
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    },

    /*
    ** Customize the progress-bar color
    */
    loading: { color: '#fff' },

    /*
    ** Global CSS
    */
    css: ['element-ui/lib/theme-chalk/index.css', '@/styles/index.scss'],

    /*
    ** Plugins to load before mounting the App
    */
    plugins: ['@/plugins/element-ui'],

    /*
    ** Nuxt.js modules
    */
    modules: [
        // Doc: https://github.com/nuxt-community/axios-module#usage
        '@nuxtjs/axios'
    ],
    /*
    ** Axios module configuration
    */
    axios: {
        // See https://github.com/nuxt-community/axios-module#options
    },

    /*
    ** Build configuration
    */
    build: {
        /*
        ** You can extend webpack config here
        */
        extend(config, ctx) {
            // Run ESLint on save
            if (ctx.isDev && ctx.isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                })
            }
        }
    },

    /*
    ** render
    */
    render: {
        bundleRenderer: {
            /*
            ** custom directives
            */
            directives: {}
        }
    }
}
