export const state = () => ({
  counter: 123,
  appName: 'Scuffed Password Saver'
})

export const mutations = {
  increment (state) {
    state.counter++
  }
}
