<template>
  <div id="app">
    <el-container>
      <!-- <el-header>
        <el-menu :default-active="state" class="navigator" mode="horizontal"
                 background-color="#FFF" text-color="#366"
                 active-text-color="#69C" @select="handleSelect">
          <el-menu-item index="TabLst">TabLst</el-menu-item>
          <el-menu-item index="Collection">Collection</el-menu-item>  
          <el-menu-item index="Topic" class="not-disable" style="width: 180px; margin-left: -20px; " disabled>
            <i class="el-icon-caret-right"></i>
            <el-input placeholder="topic here" v-model="currentTopic" @change="inputTopic"></el-input>
          </el-menu-item> 
        </el-menu>
      </el-header> -->
      
      <el-main style="margin-top:-16px; padding:0px;">
        <tabLst  v-if="state == 'TabLst'"></tabLst>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import tabLst from "./pages/TabList";

export default {
  name: "app",
  data() {
    return {
      state: "TabLst"
    };
  },
  components: {
    tabLst
  },
  methods: {
    handleSelect: function(state) {
      this.state = state;
    }
  }
};
</script>

<style lang="scss">
 

#app {
  font-family: "PingFang SC", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: -8px;
  margin-bottom: -16px;
}
 


</style>
