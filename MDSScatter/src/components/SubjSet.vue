<script setup lang="ts">
    import {onMounted, computed} from 'vue'
    import { useSubjs } from '../stores/subjs'
    const props = defineProps({
        subjId: Number
    })

    onMounted(() => {
        // nowSubjId = props.subjId
    })
    const nowSubjId = props.subjId as number

    const subjDatas = useSubjs()
    const setLockSt = () => {
        if (subjDatas.lockStatus[nowSubjId]) {
            subjDatas.lockStatus[nowSubjId] = false
        } else {
            subjDatas.setAllLocked(nowSubjId)
        }
    }
    const handleRandTypeChange = (event: Event) => {
        const container = event.target as HTMLSelectElement
        const newVal = container.value
        if (newVal == "0")
            subjDatas.setRandType(nowSubjId, newVal)
        else if (newVal == "1")
            subjDatas.setRandType(nowSubjId, newVal)
    }
    const lockIcon = computed(() => {
        if (subjDatas.lockStatus[nowSubjId])
            return "/static/link-alt.png"
        else return "/static/link-slash-alt.png"
    })
</script>

<template>
    <div class="subj_pair">
        <div class="subj_title">Subj. {{['A', 'B', 'C', 'D'][nowSubjId]}}</div>
        <div class="seperator"> </div>
        <div class="subj_pairs">
            <!-- 最小值3 -->
            <div class="attr_pair">
                <div class="attr_key">
                    <label>Lowest Score</label>
                </div>
                <div class="attr_val">
                    <input type="number" min="0" :max="subjDatas.iptData[nowSubjId][2]" v-model="subjDatas.iptData[nowSubjId][3]">
                </div>
            </div>
            <div class="pair_seperator"></div>
            <!-- 最大值2 -->
            <div class="attr_pair">
                <div class="attr_key">
                    <label>Highest Score</label>
                </div>
                <div class="attr_val">
                    <input type="number" :min="subjDatas.iptData[nowSubjId][3]" max="1000" v-model="subjDatas.iptData[nowSubjId][2]">
                </div>
            </div>
            <div class="pair_seperator"></div>
            <!-- 数据分布 -->
            <div class="attr_pair">
                <div class="attr_key">
                    <label>Score Distribution Type</label>
                </div>
                <div class="attr_val mul_val_box">
                    <select name="rand_type" :value="subjDatas.iptData[nowSubjId][0]" @change="handleRandTypeChange($event); console.log('666');">
                        <option value="0">Uniform</option>
                        <option value="1">Normal</option>
                    </select>
                    <button class="link_sels_btn" @click="setLockSt()" title="Link the Score Distribution Type of all subjects.">
                        <img :src="lockIcon" alt="" srcset="">
                    </button>
                </div>
            </div>
            <div class="pair_seperator" v-show="subjDatas.iptData[nowSubjId][0]==1"></div>
            <div class="attr_pair" v-show="subjDatas.iptData[nowSubjId][0]==1">
                <div class="attr_key">
                    <label>Avg Score</label>
                </div>
                <div class="attr_val">
                    <input type="number" v-model="subjDatas.iptData[nowSubjId][4]" :min="subjDatas.iptData[nowSubjId][3]" :max="subjDatas.iptData[nowSubjId][2]">
                </div>
            </div>
            <div class="pair_seperator" v-show="subjDatas.iptData[nowSubjId][0]==1"></div>
            <div class="attr_pair" v-show="subjDatas.iptData[nowSubjId][0]==1">
                <div class="attr_key">
                    <label>Standard Deviation</label>
                </div>
                <div class="attr_val">
                    <input type="number" v-model="subjDatas.iptData[nowSubjId][5]" min="0" max="1000">
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
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

    .subj_pair {
        width: 220px;
        margin: auto;
        margin-top: 30px;
        margin-bottom: 30px;
        display: flex;
        align-items: center;
        flex-direction: row;
    }
    .subj_pair .subj_title {
        height: 100%;
        font-size: 18px;
        font-weight: 300;
        padding-right: 5px;
    }
    .subj_pair .subj_pairs {
        padding-left: 10px;
        border-left: 1px solid #000;
    }
    .subj_pairs .pair_seperator {
        width: 100%;
        height: 10px;
    }
    .subj_pairs .attr_pair {
        margin: 0;
    }
    .subj_pairs .attr_pair .attr_key label {
        font-size: 12px;
    }
    .subj_pairs .attr_pair .mul_val_box {
        width: 100%;
        height: 25px;

        display: flex;
        flex-direction: row;

    }
    .subj_pairs .attr_pair .mul_val_box select {
        width: 110px;
        height: 25px;
        margin-right: 10px;
    }
    .subj_pairs .attr_pair .mul_val_box .link_sels_btn {
        width: 25px;
        height: 25px;
        align-items: center;
        text-align: center;
        padding: 2px;

        background-color: #fff;
        border: 1px solid #aaa;
        border-radius: 2px;
        cursor: pointer;
    }
    .subj_pairs .attr_pair .mul_val_box .link_sels_btn:hover {
        filter: brightness(0.8);
    }
    .link_sels_btn img {
        width: 15px;
        height: 15px;
    }
</style>
