import moment from 'moment'
import Vue2Storage from 'vue2-storage'
export default ({ app }, inject) => {
  inject('date', {
    moment
  })
}
