export default function ({ store, $localStorage }) {
  // If the user is not authenticated
  const vault = $localStorage.get('vault')
  if (vault) {
    store.dispatch('vault/setPath', vault.path)
  }
}