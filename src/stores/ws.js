import { defineStore } from 'pinia'

export const useWsStore = defineStore('ws', {
  state: () => ({ msg: false }),
  actions: {
    setMsg(msg) {
      this.msg = msg
      // console.log(msg)
    }
  }
})
