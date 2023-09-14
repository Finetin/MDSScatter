<script setup lang="ts">
    import { onMounted, computed, watch, ref } from 'vue'
    import { useScores } from '../stores/scores.ts'
    import * as d3 from "d3"

    const scores_data = useScores()
    const isMounted = ref(false);
    const isInit = ref(false);
    const xRangeD = ref([0, 1])
    const yRangeD = ref([0, 1])
    const xRange = ref([0, 1])
    const yRange = ref([0, 1])
    const nowMousePosition = ref([0,0])
    const colorGrad = ref(0)
    const clickDotId = ref(0)

    // 颜色
    function getColor(value) {
        const minValue = scores_data.minTotal
        const maxValue = scores_data.maxTotal
        // 定义色阶颜色
        var colors = [
            [2, 1, 131],   // 蓝色
            [3, 221, 255],   // 绿色
            [252, 246, 10], // 黄色
            [129, 40, 47]    // 红色
        ];

        // 根据最小值和最大值计算归一化的值
        var normalizedValue = (value - minValue) / (maxValue - minValue);
        if (normalizedValue<0) normalizedValue=0
        if (normalizedValue>=1) normalizedValue=0.99

        // 根据归一化值计算颜色索引
        var colorIndex = Math.floor(normalizedValue * (colors.length - 1));

        // console.log("value: ", maxValue);
        // 根据颜色索引进行线性插值
        var colorStart = colors[colorIndex];
        var colorEnd = colors[colorIndex + 1];
        var interpolationValue = normalizedValue * (colors.length - 1) - colorIndex;
        var interpolatedColor = interpolateColor(colorStart, colorEnd, interpolationValue);

        return "rgb(" + interpolatedColor.join(", ") + ")";
    }
    // 辅助函数：线性插值计算颜色值
    function interpolateColor(startColor, endColor, interpolationValue) {
        var interpolatedColor = [];
        for (var i = 0; i < startColor.length; i++) {
            var startValue = startColor[i];
            var endValue = endColor[i];
            var interpolatedValue = Math.round(startValue + (endValue - startValue) * interpolationValue);
            interpolatedColor.push(interpolatedValue);
        }
        return interpolatedColor;
    }

    // 判断色阶中划线的长度
    const colorMarkLength = computed(() => {
        const minLen = scores_data.minTotal.toString().length;
        if (minLen == 0) minLen=1
        const maxLen = scores_data.maxTotal.toString().length;
        if (maxLen == 0) maxLen=1
        if (minLen + maxLen >= 13) return "" 

        let repeat_cnt = 13 - minLen - maxLen
        if (repeat_cnt > 8) repeat_cnt=8
        return '—'.repeat(13-minLen-maxLen-1)
    })

    // 监听屏幕大小变化
    function observeContainerSizeChanges(container, callback) {
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                callback(width, height);
            }
        });

        resizeObserver.observe(container);
    }
    function handleSizeChange(width, height) {
        // 在这里执行相应的操作，比如更新 SVG 元素的宽度
        document.getElementById("scatter_view").setAttribute("width", width);
        document.getElementById("scatter_view").setAttribute("height", height);
        console.log("window size changed");
        if (isMounted.value && isInit.value)
            scatterSet2(scores_data.scores)
    }
    function svg_size_init() {
        const container = document.getElementById("scatter_box1");
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        handleSizeChange(width, height);
    }

    function scatterSet2(data) {
        // 创建svg容器
        const svg = d3.select("#scatter_view")
        // 清除已有内容
        svg.selectAll("*").remove();

        const width = svg.attr("width");
        const height = svg.attr("height");
        const marginTop = 20;
        const marginRight = 20;
        const marginBottom = 30;
        const marginLeft = 40;

        const x = d3.scaleLinear()
            .domain([scores_data.minX-10, scores_data.maxX+10]).nice()
            .range([marginLeft, width - marginRight]);

        const y = d3.scaleLinear()
            .domain([scores_data.minY-10, scores_data.maxY+10]).nice()
            .range([height - marginBottom, marginTop]);

        xRangeD.value = x.domain()
        yRangeD.value = y.domain()
        xRange.value = x.range()
        yRange.value = y.range()

        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom + 6})`)
            .call(d3.axisBottom(x.copy().interpolate(d3.interpolateRound)))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("stroke-opacity", 0.1)
                .attr("y1", -height))
            .call(g => g.append("text")
                .attr("x", width - marginRight)
                .attr("y", -3)
                .attr("fill", "currentColor")
                .attr("font-weight", "bold")
                .text("MDSx"));

        svg.append("g")
            .attr("transform", `translate(${marginLeft - 6},0)`)
            .call(d3.axisLeft(y.copy().interpolate(d3.interpolateRound)))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("stroke-opacity", 0.1)
                .attr("x1", width))
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text("MDSy"));

        // 创建brush
        const brush = d3.brush()
            .extent([[marginLeft, marginTop], [svg.attr("width") - marginRight, svg.attr("height") - marginBottom]])
            .on("end", brushended);
        // 将brush添加到SVG容器中
        const brushGroup = svg.append("g")
            .attr("class", "brush")
            .call(brush);

        let selectedData = []; // 用于存储选中的数据

        function brushended(event) {
            if (!event.selection) return;

            const [[x1, y1], [x2, y2]] = event.selection;

            const newlySelectedData = data.filter(d => {
                const cx = x(d.MDSx);
                const cy = y(d.MDSy);
                return cx >= x1 && cx <= x2 && cy >= y1 && cy <= y2;
            });

            // 移除上一次选中的区域
            dots.classed("selected", false);

            // 更新选中的数据
            selectedData = newlySelectedData;
            scores_data.setSelScores(selectedData);

            // 在新区域内添加选中的样式
            dots.filter(d => newlySelectedData.includes(d))
                .classed("selected", true);

            // brushGroup.call(brush.clear);
        }
        brush.on("end", brushended);

        // 创建散点图
        const dots = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d.MDSx))
            .attr("cy", d => y(d.MDSy))
            .style("fill", d => getColor(d.a+d.b+d.c+d.d)) // 设置颜色
            .attr("r", 5)
            .attr("data-index", (_, i) => i) // 添加索引属性
            .on("click", function () { // 单机事件
                const index = d3.select(this).attr("data-index")
                clickDotId.value = index
            });
        // return svg.node();
    }

    function handleColorGrad(event) {
        const left_bound = document.getElementById('score_color_grad').offsetLeft
        const width_bound = document.getElementById('score_color_grad').offsetWidth
        const now_grad = (event.clientX - left_bound)/
            width_bound*(scores_data.maxTotal- scores_data.minTotal)+ scores_data.minTotal
        colorGrad.value = Math.round(now_grad)
    }

    watch(() => scores_data.scores, (newValue, oldValue) => {
        // 处理 value 的变化
        // 获取点的坐标
        isInit.value = true
        if (isMounted) {
            scatterSet2(newValue)
        } else {
            console.log("Scatter Unmounted");
        }
    });

    onMounted(() => {
        // svg尺寸初始化
        svg_size_init()
        
        // 绑定尺寸变化
        const container = document.getElementById("scatter_box1");
        observeContainerSizeChanges(container, handleSizeChange);

        isMounted.value = true

        // 查询鼠标位置
        document.getElementById("scatter_view").addEventListener('mousemove', function (event) {
            const mouseX = event.clientX - 20 - 
                document.getElementById('scatter_show_view').offsetLeft
            const mouseY = event.clientY - 23
            // console.log("mouse: ", mouseX, mouseY);
            let mXD = (mouseX - xRange.value[0])/(xRange.value[1]-xRange.value[0])*(xRangeD.value[1]-xRangeD.value[0])+xRangeD.value[0]
            let mYD = (yRange.value[0] - mouseY) / (yRange.value[0] - yRange.value[1]) * (yRangeD.value[1] - yRangeD.value[0])+ yRangeD.value[0]
            if (mXD < xRangeD.value[0]) {
                mXD = xRangeD.value[0]
            } else if (mXD > xRangeD.value[1]) {
                mXD = xRangeD.value[1]
            }
            if (mYD < yRangeD.value[0]) {
                mYD = yRangeD.value[0]
            } else if (mYD > yRangeD.value[1]) {
                mYD = yRangeD.value[1]
            }
            nowMousePosition.value = [mXD, mYD]
            // console.log(nowMousePosition.value);
        });
    })
</script>

<template>
    <div class="outer_box">
        <div class="scatter_box" id="scatter_box1">
            <!-- <div id="scatter_view"></div> -->
            <svg id="scatter_view"></svg>
        </div>
        <div class="pos_show">
            <!-- {{svg_height}} -->
            <div class="pos_info_pair left_pos_pair">
                <div class="pos_info_key">
                    Mouse Position
                </div>
                <div class="pos_info_val">
                    {{Math.round(nowMousePosition[0])}}, 
                    {{Math.round(nowMousePosition[1])}} units
                </div>
            </div>
            <div class="pos_info_pair right_pos_pair">
                <div class="pos_info_key">
                    Clicked Dot
                </div>
                <div class="pos_info_val">
                    Sub.A: {{ scores_data.scores[clickDotId].a }},
                    Sub.B: {{ scores_data.scores[clickDotId].b }},
                    Sub.C: {{ scores_data.scores[clickDotId].c }},
                    Sub.D: {{ scores_data.scores[clickDotId].d }}
                </div>
            </div>
            <div class="pos_info_pair color_grad_box">
                <div class="pos_info_key">
                    Total Score
                </div>
                <div class="color_mark">
                    {{ scores_data.minTotal }} {{colorMarkLength}} {{ scores_data.maxTotal }}
                </div>
                <div class="pos_info_val color_grad" id="score_color_grad" :tooltip="colorGrad" @mousemove="handleColorGrad($event)">
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .outer_box {
        display: block;
        overflow-y: auto;
    }

    /* 散点图部分 */
    .scatter_box {
        width: calc(100% - 40px);
        height: calc(100% - 40px - 80px);
        margin: 20px;
    }
    #scatter_view {
        width: 100%;
        height: 100%;
    }
    .scatter_box .overlay {
        background-color: #F5F5F5;
    }
    #scatter_view > g.brush > rect.overlay {
        fill: #F5F5F5;
    }

    /* 坐标位置显示部分 */
    .pos_show {
        margin: 20px;
        width: calc(100% - 40px);
        height: 60px;
        /* background-color: aquamarine; */

        display: flex;
        flex-direction: row;
        align-items: center;
        text-align: center;
    }
    .pos_show .pos_info_pair {
        display: inline-block;
        margin: 10px;
        text-align: left;
    }
    .pos_show .pos_info_pair.left_pos_pair {
        width: calc(25% - 20px);
    }
    .pos_show .pos_info_pair.right_pos_pair {
        width: calc(70% - 20px - 150px);
    }
    /* 色阶部分 */
    .pos_show .pos_info_pair.color_grad_box {
        width: 150px;
    }
    .pos_show .pos_info_pair .color_grad {
        height: 15px;
        width: 100%;
        border: 1px solid #000;
        background: linear-gradient(to right, rgb(2, 1, 131), rgb(3, 221, 255), rgb(252, 246, 10), rgb(129, 40, 47));
        cursor: crosshair;
    }
    .pos_show .pos_info_pair .color_mark {
        font-size: 12px;
        width: 100%;
        text-align: center;
    }
    
    .pos_show .pos_info_pair .pos_info_key {
        font-size: 13px;
        font-weight: 600;
    }


</style>
<style>
    .dot {
        fill: steelblue;
        z-index: 2;
    }

    .selected {
        /* fill: red; */
        stroke-width: 1px;
        stroke: rgb(255, 102, 0);
    }
    .brush .selection {
        fill: rgb(68, 143, 143);
        fill-opacity: 0.3;
        stroke: #555555bb;
        stroke-width: 1px;
    }
</style>