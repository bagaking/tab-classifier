import { IDB } from '../utils/idb'

let idb = new IDB()

export class TabLst {

    constructor() {
        this._records = new Array();
        this._pickarray = new Array();

        this.strategies = {
            Print: 0,
            StashAll: 1,
            StashOne: 2,
            StashRevert: 3,
            StashByState: 4,
            PopRec: 11,
            PopOne: 12,
            PopAll: 13,
        }
    }

    /**
     * Analyze all tabs and collect which is in avaliable format to generate records.
     * @param {Array<Object>} tabs : tabs of chrome
     */
    Analyze(tabs) {
        this._records = this.UrlsToContents(tabs.filter(x => x.url));
        return this._records;
    }

    UrlsToContents(urls) {
        let regex = /(\w+):\/\/([^\:|\/]+)(\:\d*)?(.*\/)([^#|\?|\n]+)?(#.*)?(\?.*)?/i;
        return urls.filter(w => w.id != null).map(x => {
            x.titlename = x.title.length < 20 ? x.title : x.title.slice(0, 20) + "...";
            x.urlname = x.url ? x.url.match(regex)[2] : "<EMPTY>";
            x.selected = false;
            return x;
        })
    }

    /**
     * Collect from
     * @param {number} strategy: index of collect strategy, use filed strategies
     */
    Collect(strategy, ...args) {
        console.log("s", strategy, args)
        let _stashOne = (ind) => {
            let rec = this._records[ind];
            this._records[ind].selected = true;
            if (!this._pickarray.find(x => x === rec)) this._pickarray.push(rec);
        }
        let _popRec = (rec) => {
            let indFind = this._pickarray.findIndex(x => x === rec)
            if (indFind >= 0) this._pickarray.splice(indFind, 1);
            rec.selected = false;
        }
        let _popOne = (ind) => {
            let rec = this._records[ind];
            _popRec(rec);
        }
        switch (strategy) {
            case this.strategies.Print: console.log(this._pickarray); break;
            case this.strategies.StashOne:
                _stashOne(args[0]);
                break;
            case this.strategies.StashAll:
                for (let i = 0; i < this._records.length; i++) _stashOne(i);
                break;
            case this.strategies.StashRevert:
                for (let i = 0; i < this._records.length; i++) {
                    if (this._records[i].selected) _popOne(i);
                    else _stashOne(i);
                } console.log("s", strategy, args)
                break;
            case this.strategies.StashByState:
                for (let i = 0; i < this._records.length; i++) {
                    if (this._records[i].selected) _stashOne(i);
                    else _popOne(i);
                } console.log("s", strategy, args)
                break;
            case this.strategies.PopRec:
                _popRec(args[0]);
                break;
            case this.strategies.PopOne:
                _popOne(args[0]);
                break;
            case this.strategies.PopAll:
                for (let i = 0; i < this._records.length; i++) _popOne(i);
                break;
        }
        return this._pickarray;
    }

    /**
     * Annotate current pick array with a name
     * @param {string} tag : the name of annotation
     */
    async Annotate(tag) {
        let anno_lst = await idb.Get('anno-lst');
        if (!anno_lst) anno_lst = new Array();
        if (anno_lst.find(x => tag === tag)) {
            return "error : can't override an annotate.";
        }
        anno_lst.push(tag);
        await idb.Set('anno-lst', anno_lst);
        await idb.Set('anno-' + tag, this._pickarray);
        return await idb.Get('anno-' + tag);
    }

    async Record() {
    }

    async GetAnnotate(tag) {
        return await idb.Get('anno-' + tag);
    }


    async GetAnnotateText(tag, style) {
        let pickArray = await idb.Get('anno-' + tag);
        let ret = {
            anno: tag,
            tags: []
        }
        for (let i = 0; i < pickArray.length; i++) {
            ret.tags.push({ title: pickArray[i].title, url: pickArray[i].url });
        }
        switch (style) {
            case "md":
                return "# " + ret.anno + "\r\n"
                    + ret.tags.reduce(
                        (t, row) =>
                            t + `\r\n- [${
                            row.title
                                .replace(/\r\n/g, "<br>")
                                .replace(/\n/g, "<br>")
                                .replace(/[\s]+/g, " ")
                                .replace(/[\[\]]/g, "|")
                                .replace(/[\<\>]/g, ".")
                            }](${row.url})`, "");
        }
        return JSON.stringify(ret);
    }
}