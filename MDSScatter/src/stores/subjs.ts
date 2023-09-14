import { defineStore } from 'pinia'
// import axios from 'axios'

export const useSubjs = defineStore('subjsInfo', {
  state: () => ({
    lockStatus: [false, false, false, false],
    iptData: [
      ['0', 0, 100, 0, 60, 20],
      ['0', 0, 100, 0, 60, 20],
      ['0', 0, 100, 0, 60, 20],
      ['0', 0, 100, 0, 60, 20]
    ]
  }),
  getters: {
    // 自动将返回类型推断为数字
    // 锁定图标
  },
  actions: {
    setAllSame(subId: number) {
        for (let i = 0; i < 4; i++) {
          this.iptData[i][0] = this.iptData[i][subId]
        }
    },
    setAllLocked(subId: number) {
        for (let i=0; i<4; i++) {
            this.lockStatus[i] = true
            this.iptData[i][0] = this.iptData[subId][0]
        }
    },
    setRandType(subId: number, newType: '0'|'1') {
        if (this.lockStatus[subId]) {
            for (let i=0; i<4; i++) {
                if (this.lockStatus[i])
                    this.iptData[i][0] = newType
            }
        } else this.iptData[subId][0] = newType
    }
  }
})
