class BinaryTree {
    constructor() {
        this.root = null;
    }
    insert(key) {
        var newNode = new Node(key);
        if(!this.root) {
            this.root = newNode
        } else {
            this.insertNode(this.root, newNode);
        }
    }
    insertNode(node, newNode) {
        if(newNode.key < node.key) {
            if(!node.left){
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if(!node.right) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }
    inOrderTraverseNode(callback, node = this.root) {
        node.left && this.inOrderTraverseNode(callback,node.left);
        callback(node.key);
        node.right && this.inOrderTraverseNode(callback,node.right);
    }
    preOderTraverseNode(callback, node = this.root) {
        callback(node.key);
        node.left && this.preOderTraverseNode(callback, node.left);
        node.right && this.preOderTraverseNode(callback, node.right);
    }
    afterTraverseNode(callback, node = this.root) {
        node.left && this.afterTraverseNode(callback, node.left);
        node.right && this.afterTraverseNode(callback, node.right);
        callback(node.key);
    }
    min(node = this.root) {
        if(node) {
            while (node && node.left ) {
                node = node.left;
            }
            return node.key;
        }
        return null;
    }
    max(node = this.root) {
        if(node) {
            while (node && node.right) {
                node = node.right;
            }
            return node.key;
        }
        return null;
    }
    search(key) {
        return this.searchNode(this.root, key);
    }
    searchNode(node, key) {
        if(!node) return false;
        if(key < node.key) {
            return this.searchNode(node.left, key);
        } else if(key > node.key){
            return this.searchNode(node.right, key);
        } else {
            return true;
        }
    }
}

class Node {
    constructor(key) {
        this.key = key;
    }
}