import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import es from 'vuetify/es5/locale/es'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        //primary: '#28df99',
        //primary:'#00796b',
        primary: '#26A69A',
        //primary:'#7CB342',
        //primary:'#64DD17',
        //primary:'#C0CA33',
        //secondary: '#99f3bd',
        //secondary: '#64DD17',
        secondary: '#80CBC4',
        //secondary: '#D32F2F',
        accent: '#82B1FF',
        //error: '#FF5252',
        error: '#D32F2F',
        //info: '#2196F3',
        info: '#00B8D4',
        //success: '#4CAF50',
        success:'#66BB6A',
        //warning: '#FFC107',
        warning: '#F57C00',
        new: '#00BFA5',
        edit: '#FF8F00',
        delete: '#FF5252',
      }
    }
  },
  lang: {
    locales: { es },
    current: 'es'
  },
  icons: {
    iconfont: 'fa'
  }
})
