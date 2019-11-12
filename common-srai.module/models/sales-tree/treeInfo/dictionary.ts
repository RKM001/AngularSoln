export class Dictionary {
    public _keys; public _values;
    constructor(init: any) {
        this._keys = new Array();
        this._values = new Array();

        for (let x = 0; x < init.length; x++) {
            this[init[x].key] = init[x].value;
            this._keys.push(init[x].key);
            this._values.push(init[x].value);
        }
    }

    public add(key: any, value: any) {
        this[key] = value;
        this._keys.push(key);
        this._values.push(value);
    }

    public remove(key: any) {
        const index = this._keys.indexOf(key, 0);
        this._keys.splice(index, 1);
        this._values.splice(index, 1);
        delete this[key];
    }

    public keys() {
        return this._keys;
    }

    public values() {
        return this._values;
    }

    public containsKey(key: any) {
        if (typeof this[key] === 'undefined') {
            return false;
        }
        return true;
    }

    public toLookup() {
        return this;
    }

}
