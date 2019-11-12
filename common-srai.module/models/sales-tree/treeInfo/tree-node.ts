export class TreeNode {
    public item; public parent; public x; public y; public mod; public width; public height; public children;
    constructor(item: any, parent: any = null, x: any = 0) {
        this.item = item;
        this.parent = parent;
        this.x = x;
        this.y = 0;
        this.mod = 0;
        this.width = 0;
        this.height = 0;
        this.children = [];
    }


    public isLeaf() {
        return this.children.length < 1;
    }
    public isLeftMost() {
        return this.parent == null || this.parent.children[0] === this;
    }
    public isRightMost() {
        return this.parent == null || this.parent.children[this.parent.children.length - 1] === this;
    }
    public getPreviousSibling() {
        if (this.parent == null || this.isLeftMost()) {
            return null;
        }
        return this.parent.children[this.parent.children.indexOf(this) - 1];
    }
    public getNextSibling() {
        if (this.parent == null || this.isRightMost()) {
            return null;
        }
        return this.parent.children[this.parent.children.indexOf(this) + 1];
    }
    public getLeftMostSibling() {
        if (this.parent == null) {
            return null;
        }
        if (this.isLeftMost()) {
            return this;
        }
        return this.parent.children[0];
    }
    public getLeftMostChild() {
        return this.children.length < 1 ? null : this.children[0];
    }
    public getRightMostChild() {
        return this.children.length < 1 ? null : this.children[this.children.length - 1];
    }
    public toString() {
        return this.item.id + ': ' + this.x + ';' + this.y + ' | ' + this.mod + ' | ' + this.width + ' x ' + this.height;
    }
}
