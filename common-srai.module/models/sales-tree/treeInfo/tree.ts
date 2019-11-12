import * as  _ from 'lodash';
import { Dictionary } from './dictionary';
import { TreeNode } from './tree-node';

export class Tree {
    public static nodeSize = 1;
    public static siblingDistance = 0.4;
    public static treeDistance = 0.0;
    public root: any;

    constructor(treeNodes: any, distance: number = 0.0) {
        Tree.siblingDistance = distance;
        this.root = this.buildTree(treeNodes);
    }

    public static initializeNodes(node: any, depth: any = 0) {
        node.x = -1;
        node.y = depth;
        node.mod = 0;
        for (let counter = 0, _data = node.children; counter < _data.length; counter++) {
            const childNode = _data[counter];
            Tree.initializeNodes(childNode, depth + 1);
        }
    }

    public static calculateInitialX(node: any, x: any = 0) {

        for (let counter = 0, _data = node.children; counter < _data.length; counter++) {
            const childNode = _data[counter];
            Tree.calculateInitialX(childNode, x);
        }
        if (node.isLeaf()) {
            // if there is a previous sibling in this set, set X to previous sibling + designated distance
            if (!node.isLeftMost()) {
                node.x = node.getPreviousSibling().x + Tree.nodeSize + Tree.siblingDistance;
            } else {
                // if this is the first node in a set, set X to 0
                node.x = x;
            }
        } else if (node.children.length === 1) {
            // if this is the first node in a set, set it's X value equal to it's child's X value
            if (node.isLeftMost()) {
                node.x = node.children[0].x;
            } else {
                node.x = node.getPreviousSibling().x + Tree.nodeSize + Tree.siblingDistance;
                node.mod = node.x - node.children[0].x;
            }
        } else {
            const leftChild = node.getLeftMostChild(),
                rightChild = node.getRightMostChild(),
                mid = (leftChild.x + rightChild.x) / 2;
            if (node.isLeftMost()) {
                node.x = mid;
            } else {
                node.x = node.getPreviousSibling().x + Tree.nodeSize + Tree.siblingDistance;
                node.mod = node.x - mid;
            }
        }
        if (node.children.length > 0 && !node.isLeftMost()) {
            // Since sub-trees can overlap, check for conflicts and shift tree right if needed
            Tree.checkForConflicts(node);
        }
    }

    public static calculateFinalPositions(node: any, modSum: any = 0) {
        node.x += modSum;
        modSum += node.mod;
        for (let _i = 0, _a = node.children; _i < _a.length; _i++) {
            const child = _a[_i];
            Tree.calculateFinalPositions(child, modSum);
        }
        if (node.children.length < 1) {
            node.width = node.x;
            node.height = node.y;
        } else {
            node.width = node.children.sort(function (p1: any, p2: any) {
                return p2.width - p1.width;
            })[0].width;
            node.height = node.children.sort(function (p1: any, p2: any) {
                return p2.height - p1.height;
            })[0].height;
        }
    }

    public static centerNodesBetween = function (leftNode: any, rightNode: any) {
        const leftIndex = leftNode.parent.children.indexOf(rightNode);
        const rightIndex = leftNode.parent.children.indexOf(leftNode);
        const numNodesBetween = (rightIndex - leftIndex) - 1;
        if (numNodesBetween > 0) {
            const distanceBetweenNodes = (leftNode.x - rightNode.x) / (numNodesBetween + 1);
            for (let i = leftIndex + 1; i < rightIndex; i++) {
                const middleNode = leftNode.parent.children[i];
                const desiredX = rightNode.x + (distanceBetweenNodes * (i - leftIndex));
                const offset = desiredX - middleNode.x;
                middleNode.x += offset;
                middleNode.mod += offset;
            }
            Tree.checkForConflicts(leftNode);
        }
    };

    public static getLeftContour = function (node: any, modSum: any, values: any) {
        if (!values.containsKey(node.y)) {
            values.add(node.y, node.x + modSum);
        } else {
            values[node.y] = Math.min(values[node.y], node.x + modSum);
        }
        modSum += node.mod;
        for (let _i = 0, _a = node.children; _i < _a.length; _i++) {
            const child = _a[_i];
            Tree.getLeftContour(child, modSum, values);
        }
    };

    public static getRightContour = function (node: any, modSum: any, values: any) {
        if (!values.containsKey(node.y)) {
            values.add(node.y, node.x + modSum);
        } else {
            values[node.y] = Math.max(values[node.y], node.x + modSum);
        }
        modSum += node.mod;
        for (let _i = 0, _a = node.children; _i < _a.length; _i++) {
            const child = _a[_i];
            Tree.getRightContour(child, modSum, values);
        }
    };

    public static checkForConflicts(node: any) {

        const nodeContour = new Dictionary([]);
        Tree.getLeftContour(node, 0, nodeContour);
        const minDistance = Tree.treeDistance + Tree.nodeSize;
        let sibling = node.getLeftMostSibling(),
            shiftValue = 0.0;
        while (sibling != null && sibling !== node) {
            const siblingContour = new Dictionary([]);
            Tree.getRightContour(sibling, 0, siblingContour);
            for (let level = node.y + 1; level <= Math.min(Math.max.apply(null, siblingContour.keys()), Math.max.apply(null, nodeContour.keys())); level++) {
                const distance = nodeContour[level] - siblingContour[level];
                if (distance + shiftValue < minDistance) {
                    shiftValue = minDistance - distance;
                }
            }
            if (shiftValue > 0) {
                node.x += shiftValue;
                node.mod += shiftValue;
                Tree.centerNodesBetween(node, sibling);
                shiftValue = 0;
            }
            sibling = sibling.getNextSibling();
        }
    }

    public static getChildrenNodes = function (data: any, parent: any) {
        const nodes = new Array();
        for (let _i = 0, _a = data.filter(function (x: any) {
            return x.parentId === parent.item.id;
        }); _i < _a.length; _i++) {
            const item = _a[_i];
            const treeNode = new TreeNode(item, parent);
            treeNode.children = Tree.getChildrenNodes(data, treeNode);
            nodes.push(treeNode);
        }
        return nodes;
    };

    public build() {

        _.reverse(this.root).forEach((element, index) => {
            let distance = 0;
            if (this.root.length > 1) {
                distance = element.children.length > 0 ? 0.1 : 0;
            }
            Tree.initializeNodes(element);
            Tree.calculateInitialX(element, distance);
            Tree.calculateFinalPositions(element);
        });

        return this;
    }


    public buildTree(data: any) {

        const root: any = data.filter(function (x: any) {
            return x.parentId === null || x.parentId === 0 || x.parentId === '';
        });

        if (root === null) {
            throw new Error('Data contains no root node. Root node has \'parentId\' set to null.');
        }
        const rootTreeNode: any = [];

        root.forEach((item, index) => {
            const node = (new TreeNode(item, null, index));
            node.children = Tree.getChildrenNodes(data, node);
            rootTreeNode.push(node);
        });

        return rootTreeNode;
    }
}

