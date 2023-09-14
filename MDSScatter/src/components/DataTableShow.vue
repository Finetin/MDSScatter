<script setup lang="ts">
    // import DataTablesCore from 'datatables.net';
    // import DataTable from 'datatables.net-dt';
    import 'datatables.net-responsive-dt';
    import { useScores } from '../stores/scores'
    import { computed } from 'vue'

    import DataTable from 'datatables.net-vue3';
    import DataTablesCore from 'datatables.net';

    const scores_data = useScores()
    const title = computed(() => {
        if (scores_data.selScores.length == 0) {
            return "All Scores"
        } else return "Selected Scores"
    })

    DataTable.use(DataTablesCore);
</script>

<template>
    <div class="outer_box">
        <div class="title_box">
            <h1>{{title}}</h1>
        </div>
        <div class="table_box">
            <DataTable :data="scores_data.getSelScores" class="display">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>A</th>
                        <th>B</th>
                        <th>C</th>
                        <th>D</th>
                        <th>Total</th>
                    </tr>
                </thead>
            </DataTable>
        </div>
    </div>
</template>

<style scoped>
    @import url("//cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css");
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

    /* 表格外侧 */
    .table_box {
        margin: 30px;
        width: calc(100% - 60px);
    }

</style>
<style>
    #DataTables_Table_0_length {
        width: 160px;
    }

    #DataTables_Table_0_filter input {
        width: 80px;
        height: 23px;
        font-size: 15px;
    }

    /* 下方按键 */
    #DataTables_Table_0_info {
        font-size: 12px;
    }
    #DataTables_Table_0_paginate {
        text-align: center;
        margin-left: auto;
        margin-right: auto;
    }
    #DataTables_Table_0_previous,
    #DataTables_Table_0_next {
        padding: 4px;
        padding-left: 8px;
        padding-right: 8px;
        font-size: 13px;
    }
    #DataTables_Table_0_paginate > span > span {
        padding: 4px;
    }
    #DataTables_Table_0_paginate > span > a.paginate_button {
        
        padding: 4px;
        padding-left: 8px;
        padding-right: 8px;
    }
</style>
