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
        // primary: '#26A69A',
        primary: '#ff0000',
        // secondary: '#80CBC4',
        secondary: '#EF9A9A',
        // accent: '#4DB6AC',
        accent: '#E53935',
        // error: '#D32F2F',
        error: '#B71C1C',
        info: '#00B8D4',
        success: '#66BB6A',
        warning: '#F57C00',
        // new: '#00BFA5',
        new: '#EF5350',
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
