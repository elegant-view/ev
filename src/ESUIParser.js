/**
 * @file 解析ESUI控件
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import ExprParser from 'vtpl/src/parsers/ExprParser';
import Tree from 'vtpl/src/trees/Tree';
import Node from 'vtpl/src/nodes/Node';
import esui from 'esui';
import ScopeModel from 'vtpl/src/ScopeModel';
import {line2camel} from 'vtpl/src/utils';

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
        if (!this.$$control) {
            throw new Error(`no such control: ${this.getControlType()}`);
        }
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
        // 对输入控件的value进行双向绑定
        else if (this.isInputControl(this.$$control) && attrName === 'bind-value') {
            this.twoWayBind(attrValue);
        }
        else {
            this.$$control.set(attrName, attrValue);
        }
    }

    twoWayBind(attrValue) {
        // M->V
        this.tree.rootScope.on('change', (model, changes) => {
            for (let i = 0, il = changes.length; i < il; ++i) {
                let change = changes[i];
                if (change.name === attrValue) {
                    this.dirtyCheck(attrValue, change.newValue, change.oldValue)
                        && this.$$control.set('rawValue', change.newValue);
                    return;
                }
            }
        });
        // V->M
        this.$$control.on('input', event => {
            this.tree.rootScope.set(attrValue, event.target.getRawValue());
        }, this);
        this.$$control.on('change', event => {
            this.tree.rootScope.set(attrValue, event.target.getRawValue());
        }, this);
    }

    isInputControl(control) {
        let category = control.getCategory();
        return category === 'input' || category === 'check' || category === 'extend';
    }

    getControlType() {
        let tagName = this.node.getTagName();
        return line2camel(tagName.replace('esui', ''));
    }

    getChildNodes() {
        return [];
    }

    destroy() {
        this.$$control.dispose();

        super.destroy();
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
