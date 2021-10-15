export default function ({ store, $localStorage }) {
  // If the user is not authenticated
  if (!store.state.settings.vaultPath) {
    const vault = $localStorage.get('vault')
    if (vault) {
      store.dispatch('settings/setVaultPath', vault.path)
    }
  }
}