import _ from 'lodash'
import Vue2Storage from 'vue2-storage'
export default ({ app }, inject) => {
    inject('globals', {
        lodash: _
    })
}
