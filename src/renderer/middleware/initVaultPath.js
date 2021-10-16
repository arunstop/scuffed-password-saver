export default function ({ store, $localStorage, $globals }) {
  // If the user is not authenticated

  if($localStorage.has('settings')){
    if (!$globals.lodash.isEqual(store.state.settings, $localStorage.get('settings'))) {
      store.dispatch('settings/initSettings', $localStorage.get('settings'))
    }
  }else{
    store.dispatch('settings/initSettings', '')
  }
}