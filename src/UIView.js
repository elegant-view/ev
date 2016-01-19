import View from 'er/View';
import ESUIParser from './ESUIParser';
import {VComponent} from 'vcomponent';
import ViewContext from 'esui/ViewContext';
import u from 'underscore';

let counter = 0x861005;
function getGUID() {
    return 'ef-' + counter++;
}

export default class UIView extends View {
    render() {
        let container = this.getContainerElement();

        // 容器没有还不一定是没配置好，很可能是主Action销毁了子Action才刚加载完
        if (!container) {
            var url = this.model
                && typeof this.model.get === 'function'
                && this.model.get('url');
            throw new Error('Container not found when rendering ' + (url ? '"' + url + '"' : 'view'));
        }

        container.innerHTML = this.getTemplate();
        this.$vcomponent = new VComponent({
            startNode: container,
            endNode: container
        });
        this.$vcomponent.$vtpl.$tree.setTreeVar('viewContext', this.createViewContext());
        this.$vcomponent.render();

        let rootScope = this.$vcomponent.$vtpl.$tree.rootScope;
        rootScope.set(this.model.dump());

        this.model.on('change', event => {
            u.forEach(event.changes, change => rootScope.set(change.name, change.newValue));
        });
        rootScope.on('change', (model, changes) => {
            u.forEach(changes, change => this.model.set(change.name, change.newValue));
        });

        this.enterDocument();
    }

    getViewName() {
        if (this.name) {
            return this.name;
        }

        // 从构造函数把名字猜出来
        var name = this.constructor && this.constructor.name;
        if (!name && this.constructor) {
            // 用正则猜名字
            var functionString = this.constructor.toString();
            var match = /function\s+([^\(]*)/.exec(functionString);
            // 去除函数名后面的空格
            name = match && match[1].replace(/\s+$/g, '');
        }
        // 再不行用计数
        if (!name) {
            name = getGUID();
        }

        // 以下代码是一个洁癖和强近症患者所写：

        // 如果名字是XxxView，把最后的View字样去掉
        name = name.replace(/View$/, '');
        // 从PascalCase转为横线分隔，这里需要注意，连续的大写字母不应该连续分隔
        name = name.replace(
            /[A-Z]{2,}/g,
            function (match) {
                // 这里把ABCD这种连续的大写，转成AbcD这种形式。
                // 如果`encodeURIComponent`，会变成`encodeUriComponent`，
                // 然后加横线后就是`encode-uri-component`得到正确的结果
                return match.charAt(0)
                    + match.slice(1, -1).toLowerCase()
                    + match.charAt(match.length - 1);
            }
        );
        name = name.replace(
            /[A-Z]/g,
            function (match) {
                return '-' + match.toLowerCase();
            }
        );
        if (name.charAt(0) === '-') {
            name = name.substring(1);
        }

        return name;
    }

    createViewContext() {
        var ViewContext = require('esui/ViewContext');
        var name = this.getViewName();

        return new ViewContext(name || null);
    }

    getTemplate() {
        return '';
    }

    /**
     * 根据控件上的ref标记获取控件
     *
     * @protected
     * @param {string} ref 控件ref
     * @return {Control}
     */
    get(ref) {
        let children = this.$vcomponent.$vtpl.$tree.getTreeVar('children');
        return children[ref];
    }
}
