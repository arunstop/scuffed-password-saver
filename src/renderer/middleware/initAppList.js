export default function ({ store, $localStorage }) {
  // If the user is not authenticated
  if (store.state.app.appList.length <= 0) {
    const appList = $localStorage.get('appList')?.length > 0
      ? $localStorage.get('appList')
      : require('@/assets/app-list.json')
    store.dispatch('app/initAppList', appList)
  }
}
