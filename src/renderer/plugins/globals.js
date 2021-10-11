import _ from 'lodash'
import Vue2Storage from 'vue2-storage'
export default ({ app }, inject) => {

    // Clone Vuex state
    const cloneState = (stateVar) => {
        return JSON.parse(JSON.stringify(stateVar))
    }
    
    inject('globals', {
        lodash: _,
        cloneState
    })
}
