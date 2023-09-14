import { defineStore } from 'pinia'
import axios from 'axios'

export const useScores = defineStore('scores', {
  state: () => ({
    counter: 0,
    scores: [{ a: 0, b: 0, c: 0, d: 0, MDSx: 0, MDSy: 0, id: 0}],
    selScores: [{ a: 0, b: 0, c: 0, d: 0, MDSx: 0, MDSy: 0, id: 0}],
    minTotal: 0,
    maxTotal: 0,
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0
  }),
  getters: {
    // 自动将返回类型推断为数字
    getSelScores: (state) => {
      let selOnes = state.selScores
      if (state.selScores.length == 0) {
        selOnes = state.scores
      }
      const res: (number[])[] = []
      for (let i=0; i<selOnes.length; i++) {
        const nowScore = [
          selOnes[i].id,
          selOnes[i].a,
          selOnes[i].b,
          selOnes[i].c,
          selOnes[i].d,
          selOnes[i].a + selOnes[i].b + selOnes[i].c + selOnes[i].d
        ]
        res.push(nowScore)
      }
      return res
    },
  },
  actions: {
    requestScores(aParams: [], bParams: [], cParams: [], dParams: [], dataSize: number) {
      // 获取随机的分数
      const _this = this
      axios
        .get(
          'http://localhost:5000/api/mdsdata?aParams=' +
            aParams +
            '&bParams=' +
            bParams +
            '&cParams=' +
            cParams +
            '&dParams=' +
            dParams +
            '&dataSize=' +
            dataSize
        )
        .then(function (response) {
          // 处理成功响应
          console.log(response.data)
          const scores_val = []
          const res = response.data
          for (let i = 0; i < dataSize; i++) {
            scores_val.push({
              id: i,
              a: res.origin[i][0],
              b: res.origin[i][1],
              c: res.origin[i][2],
              d: res.origin[i][3],
              MDSx: res.lowres[i][0],
              MDSy: res.lowres[i][1]
            })
          }
          _this.scores = scores_val
          _this.selScores.splice(0, _this.selScores.length)
          _this.minTotal = res.minTotal
          _this.maxTotal = res.maxTotal
          _this.minX = res.minX
          _this.maxX = res.maxX
          _this.minY = res.minY
          _this.maxY = res.maxY
        })
        .catch(function (error) {
          // 处理错误
          console.log('Scores Req Error: ', error)
        })
    },
    setSelScores(
      sel_ones: {
        a: number
        b: number
        c: number
        d: number
        MDSx: number
        MDSy: number
      }[]
    ) {
      // 设置选中的分数id
      this.selScores = sel_ones
    }
  }
})
