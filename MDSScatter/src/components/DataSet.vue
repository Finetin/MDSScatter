<script setup lang="ts">
    import { onMounted, ref } from 'vue'
    import { useScores }  from '../stores/scores'
    import { useSubjs } from '../stores/subjs'
    import SubjSet from './SubjSet.vue'

    // standard deviation
    const dataSize = ref(100)
    const subjDatas = useSubjs()
    const scores_data = useScores()

    const scoresGenerate = () => {
        const nowIptData = subjDatas.iptData
        const randType: number[] = []
        for (let i=0; i < nowIptData[0].length; i++) {
            randType.push(Number(nowIptData[0][i]))
        }
        scores_data.requestScores(randType, nowIptData[1],
            nowIptData[2], nowIptData[3], dataSize.value)
    }

    onMounted(() => {
        scoresGenerate();
    })
</script>

<template>
    <div class="outer_box">
        <div class="title_box">
            <h1>Score Data Init</h1>
        </div>
        <div class="info_box">
            <div class="attr_pair">
                <div class="attr_key">
                    <label for="data_size_ipt">data size</label>
                </div>
                <div class="attr_val">
                    <input type="number" v-model="dataSize" id="data_size_ipt" min="10" max="1000">
                </div>
            </div>
            <!-- 各种科目信息 -->
            <SubjSet v-for="num in [0, 1, 2, 3]" :key="num" :subjId="num"></SubjSet>
            <div class="button_box">
                <button class="btn" @click="scoresGenerate()">Generate</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .outer_box {
        display: block;
        overflow-y: auto;
    }

    .title_box {
        width: calc(100% - 10px);
        padding: 5px;
        padding-top: 15px;
    }

    .title_box h1 {
        font-size: 25px;
        margin: 10px;
        font-weight: 500;
    }


    /* 信息部分 */
    .info_box {
        margin-top: 10px;
        width: 100%;
        text-align: center;
    }

    .attr_pair {
        margin: auto;
        margin-top: 10px;
        margin-bottom: 10px;
        width: 150px;
        text-align: left;

        /* background-color: antiquewhite; */
    }
    .attr_pair .attr_key label {
        margin: 5px;
        margin-left: 0;
        font-size: 13px;
        height: 16px;
        font-weight: 400;
        text-align: left;
    }
    .attr_pair .attr_val input {
        margin: 0;
        font-size: 16px;
        text-indent: 2px;
        height: 25px;
        width: calc(100% - 10px);
    }

    .button_box {
        width: calc(100% - 20px);
        margin: 10px;
        margin-bottom: 20px;
    }
    .button_box .btn {
        height: 30px;
        font-size: 16px;
        width: 100px;
        background-color: white;
        border: 1px solid black;
        border-radius: 5px;
    }
    .button_box .btn:hover {
        filter: brightness(0.8);
        cursor: pointer;
    }

</style>
