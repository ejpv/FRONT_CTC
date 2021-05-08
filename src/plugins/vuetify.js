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
        primary: '#26A69A',
        secondary: '#80CBC4',
        accent: '#4DB6AC',
        error: '#D32F2F',
        info: '#00B8D4',
        success: '#66BB6A',
        warning: '#F57C00',
        new: '#00BFA5',
        edit: '#FFB300',
        delete: '#FF5252'
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
