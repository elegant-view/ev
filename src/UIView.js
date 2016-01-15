import View from 'er/View';
import ESUIParser from './ESUIParser';
import VComponent from 'vcomponent';
import ViewContext from 'esui/ViewContext';
import u from 'underscore';

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
        this.$vcomponent.$vtpl.$tree.setTreeVar('viewContext', new ViewContext('ve'));
        this.$vcomponent.render();

        this.$vcomponent.$vtpl.$tree.rootScope.set(this.model.dump());

        this.model.on('change', event => {
            u.forEach(event.changes, change => {
                this.$vcomponent.$vtpl.$tree.rootScope.set(change.name, change.newValue);
            });
        });
    }

    getTemplate() {
        return '';
    }
}
