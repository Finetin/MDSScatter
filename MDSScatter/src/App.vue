<script setup lang="ts">
import DataSet from './components/DataSet.vue'
import DataTableShow from './components/DataTableShow.vue'
import ScatterShow from './components/ScatterShow.vue'
import {ref, computed} from 'vue'


</script>

<template>
  <div class="explorer_view">
    <div class="left_view">
      <DataSet id="data_set_view"/>
    </div>
    <div class="center_view">
      <ScatterShow id="scatter_show_view" />
    </div>
    <div class="right_view">
      <DataTableShow id="data_show_view" />
    </div>
  </div>
</template>

<style>
  html, body {
    height: 100%;
    width: 100%;
  }

</style>

<style scoped>
  .explorer_view {
    height: 100%;
    width: 100%;
    /* background-color: antiquewhite; */

    align-items: center;
    display: flex;
    flex-direction: row;
  }
  .left_view {
    height: 100%;
    width: 300px;
  }
  .center_view {
    height: 100%;
    width: calc(100% - 700px)
  }
  .right_view {
    height: 100%;
    width: 400px;

    /* background-color: azure; */
  }
  
  #data_set_view, #data_show_view, #scatter_show_view {
    margin: 3px;
    width: calc(100% - 6px);
    height: calc(100% - 6px);
    border-radius: 5px;
    background-color: #fff;
    /* box-shadow: 1px 2px #aaa; */
    box-shadow: 0px 5px 5px rgba(0,0,0,0.2);
  }

</style>
