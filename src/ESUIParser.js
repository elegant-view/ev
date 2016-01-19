/**
 * @file 解析ESUI控件
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import ExprParser from 'vtpl/src/parsers/ExprParser';
import Tree from 'vtpl/src/trees/Tree';
import Node from 'vtpl/src/nodes/Node';
import esui from 'esui';
import ScopeModel from 'vtpl/src/ScopeModel';

class ESUIParser extends ExprParser {
    constructor(options) {
        super(options);

        let viewContext = this.tree.getTreeVar('viewContext');
        if (!viewContext) {
            throw new Error('no viewContext');
        }

        this.$$control = esui.create(this.getControlType(), {
            viewContext,
            main: this.node.$node
        });
    }

    linkScope() {
        this.$$control.render();
        ExprParser.prototype.linkScope.apply(this, arguments);
    }

    setAttr(node, attrName, attrValue) {
        if (attrName === 'ref') {
            let children = this.tree.getTreeVar('children');
            children[attrValue] = this.$$control;
            this.$$ref = attrValue;
        }
        // 如果以`on-`开头，就认为是事件绑定，然后认为attrValue就是一个表达式
        else if (/on-/.test(attrName)) {
            this.$$control.on(attrName.replace('on-', ''), event => {
                let exprCalculater = this.tree.getTreeVar('exprCalculater');
                exprCalculater.createExprFn(attrValue, true);

                let local = new ScopeModel();
                local.setParent(this.tree.rootScope);
                local.set('event', event);
                exprCalculater.calculate(attrValue, true, local);
            }, this);
        }
        else {
            this.$$control.set(attrName, attrValue);
        }
    }

    getControlType() {
        let tagName = this.node.getTagName();
        return tagName.replace('esui-', '').replace(/^[a-z]/, matched => matched.toUpperCase());
    }

    getChildNodes() {
        return [];
    }

    static isProperNode(node) {
        if (node.getNodeType() !== Node.ELEMENT_NODE) {
            return false;
        }

        const tagName = node.getTagName();
        return tagName.indexOf('esui-') === 0;
    }
}

Tree.registeParser(ESUIParser);
export default ESUIParser;
