export default function ({ store, $localStorage }) {

    // If the user is not authenticated
    if (store.state.account.accountList.length <= 0) {
        const accountList = $localStorage.get('accountList')?.length > 0
            ? $localStorage.get('accountList')
            : []
        store.dispatch('account/initAccountList', accountList)
    }
}