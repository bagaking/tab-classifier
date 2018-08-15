<template>
  <el-container style="padding:0px; width: 100%;">>
    <el-main style="padding:0px; width: 100%;">
      <el-table size="xx" id="tabTable" :data="records" stripe style="width: 100%;" max-height="400" ref="table" fit>
        <el-table-column :label="pickarray.length + '/' + records.length " width="64" fixed="left">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.selected" active-color="#66de66" inactive-color="#777777"
                       @change="markSelection">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="Title" width="430" header-align="left" align="left">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="top-start">
              <a><strong>{{scope.row.titlename}}</strong> (
                <el-button type="text" @click="goto(scope.row)">{{scope.row.urlname}}</el-button>
                )</a>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer style="padding:0px 0; height:40px;">
      <el-container style="padding:5px;">

        <el-aside width="160px">
          <el-button-group>
            <el-button size="mini" @click="markAll" type="primary" style="width:80px;">All</el-button>
            <el-button size="mini" @click="markRevert" type="primary" style="width:80px;">Revert</el-button>
          </el-button-group>
        </el-aside>

        <div style="padding-left: 24px;">
          <el-input size="mini" placeholder="Annotation" v-model="annotation" clearable
                    style="width:180px; padding-right:10px;"></el-input>
          <el-button-group>
            <el-button size="mini" @click="annotate" type="success">Copy</el-button>
            <el-button size="mini" @click="CloseTabs" type="danger">Close</el-button>
          </el-button-group>
        </div>


      </el-container>


      <!-- <el-button @click="archive" type="success">Archive</el-button>
      <el-button @click="clear" type="success">Clear</el-button>
      <el-button @click="show" type="success">Show</el-button> -->
    </el-footer>
    <div v-if="pickarray.length > 0" class="tabCloud">
      <el-tag v-for="pa in pickarray" :key="pa.url" closable @close="markClose(pa)" size="small" hit>{{pa.titlename}}
      </el-tag>
    </div>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        records: [],
        pickarray: [],
        annotation: ""
      };
    },
    mounted: async function () {
      await this.refresh().then(console.log);
    },
    methods: {
      clear() {
        this.$storage.set("me", {});
      },
      async refresh() {
        //if(this.$tabLst._records) return;
        await this.analyze();
        if (!this.annotation) {
          let cbtext = this.$kits.GetClipboard();
          if (cbtext) {
            this.annotation = cbtext
              .trim()
              .replace(/[#\[\]<>{}:().]/g, "")
              .split(/[\s]/g)[0];
            if (!this.annotation) this.annotation = "" + new Date();
          }
        }
        this.repaint();
      },
      async analyze() {
        return await new Promise((resolve, reject) => {
          this.$chrome.tabs.query({}, tabs => {
            resolve(this.$tl.Analyze(tabs));
            this.$message(`${this.$tl._records.length} tabs has been finded.`);
          });
        });
      },
      goto(tab) {
        console.log(tab);
      },
      async markSelection() {
        console.log(this.$tl.Collect(this.$tl.strategies.StashByState));
        this.repaint();
      },
      async markAll() {
        console.log(this.$tl.Collect(this.$tl.strategies.StashAll));
        this.repaint();
      },
      async markRevert() {
        console.log(this.$tl.Collect(this.$tl.strategies.StashRevert));
        this.repaint();
      },
      async markClose(pa) {
        console.log(this.$tl.Collect(this.$tl.strategies.PopRec, pa));
        this.repaint();
      },
      async CloseTabs() {
        let isClose = await new Promise((rsv) => this.$confirm('Close these selected tabs ?').then(() => rsv(true)).catch(() => rsv(false)))

        if(isClose) {
          for (let i = 0; i < this.$tl._pickarray.length; i++) {
            let index = this.$tl._pickarray[i].id
            await new Promise((rsv) => this.$chrome.tabs.remove(index, tab => {
              rsv(tab)
            }))
          }
          this.$tl._pickarray = new Array()

          await new Promise(rsv => setTimeout(rsv, 90))

          await this.refresh();
        }
        this.repaint();
      },
      async annotate() {
        console.log(await this.$tl.Annotate(this.annotation));
        if (this.$tl._pickarray.length <= 0) {
          this.$message.error("pick urls first");
        } else {
          this.$kits.SetClipboard(
            await this.$tl.GetAnnotateText(this.annotation, "md")
          );
          this.$message(
            this.$tl._pickarray.length +
            " urls have been copied to your clipboard . "
          );
        }
        this.repaint();
      },

      repaint() {
        this.records = this.$tl._records;
        this.pickarray = this.$tl._pickarray;
      },
      //==============
      async star(urlObj) {
        console.log(
          await this.save("stars", {
            title: urlObj.title,
            url: urlObj.url
          })
        );
      },
      rem(index) {
        let self = this;
        this.$chrome.tabs.remove(index, tab => {
          console.log(tab);
          setTimeout(() => self.refresh(), 90);
        });
      },
      async save() {
        await this.$db.Set("a", "b");
        console.log(await this.$db.Get("a"));
      },
      async archive() {
        await this.save("archive");
        let self = this;
        this.tabs.forEach(function (t) {
          self.rem(t.id);
        });
      },
      async show() {
        this.refresh();
        console.log(await this.$k.GetMe());
      }
    }
  };
</script>

<style>
  .el-table--xx td,
  .el-table--xx th {
    padding: 0px 0 !important;
  }

  .tabCloud {
    border-radius: 12px;
    margin: 4px;
    padding: 4px;
    border: 2px dotted #AAAADD;
  }
</style>
