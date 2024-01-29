import { defineStore } from 'pinia'
import { sendSocketMessage } from '@/utils/ws'

export const useWsStore = defineStore('ws', {
  state: () => ({ msg: false }),
  actions: {
    setMsg(msg) {
      this.msg = msg
    }
  }
})
