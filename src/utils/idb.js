import IdbKvStore from 'idb-kv-store'; 

const STORAGEKEY = "tab-classifier";

export class IDB {

    constructor() {
        this._idb = new IdbKvStore(STORAGEKEY);
        this._keylst = new Array();
    }
 
    async Set(key, value) {  
        return await this._idb.set(key, value);
    }

    async Get(key) {
        return await this._idb.get(key);
    }

    async Rem(key) { 
        return await this._idb.remove(key);
    }

}