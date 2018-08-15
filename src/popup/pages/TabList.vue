<template>
  <el-container style="margin-top: -2px; margin-left: -20px; margin-right: -5px; margin-bottom: -20px">
    <!--<img src="../assets/logo.png">-->
    <el-main>
      <el-table :data="tabs" stripe style="width: 100%;" height="420" ref="table" fit>
        <el-table-column prop="index" label="Ind" width="46" fixed="left"></el-table-column>
        <el-table-column prop="titlename" label="Title" width="200" style="align-self:left">
          <!--<template scope="scope">-->
          <!--<el-tooltip class="item" effect="dark" content="scope.row.total" placement="top-start">-->
          <!--</el-tooltip>-->
          <!--</template>-->
        </el-table-column>
        <!--<el-table-column prop="active" label="Active" width="120"></el-table-column>-->
        <el-table-column prop="urlname" label="URL" width="200">
          <!--<template scope="scope">-->
          <!--<el-tooltip class="item" effect="dark" content="Top Left prompts info" placement="top-start">-->
          <!--{{scope.row.url}}-->
          <!--</el-tooltip>-->
          <!--</template>-->
        </el-table-column>
        <el-table-column label="OP" width="44" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" style="color:#66E; margin: -3px;" v-if="scope.row.url"
                       @click="star(scope.row)">star
            </el-button>
            <el-button size="mini" type="text" style="color:#E66; margin: -3px;" @click="rem(scope.row.id)">rem
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-button @click="save()" type="success">Save</el-button>
      <el-button @click="archive" type="success">Archive</el-button>
      <el-button @click="clear" type="success">Clear</el-button>
      <el-button @click="show" type="success">Show</el-button>
    </el-footer>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        tabs: []
      }
    },
    mounted: async function () {
      await this.refresh().then(console.log)
    },
    methods: {
      clear() {
        this.$storage.set("me", {})
      },
      async refresh() {
        let self = this
        self.$chrome.tabs.query({currentWindow: true}, tabs => {
          self.tabs = self.$k.UrlsToContents(tabs);
          console.log(self.tabs)
        })
        console.log("tabs refreshed");
      },
      async star(urlObj) {
        console.log(await this.save("stars", {
          title: urlObj.title,
          url: urlObj.url
        }));
      },
      rem(index) {
        let self = this
        this.$chrome.tabs.remove(index, tab => {
          console.log(tab)
          setTimeout(() => self.refresh(), 90);
        })
      },
      async save() {
        await this.$db.Set('a', 'b')
        console.log(await this.$db.Get('a'))
      },
      async archive() {
        await this.save("archive");
        let self = this
        this.tabs.forEach(function (t) {
          self.rem(t.id)
        });
      },
      async show() {
        this.refresh();
        console.log(await this.$k.GetMe())
      }
    }
  }
</script>

<style scoped>

</style>
