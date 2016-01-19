import UIView from 've/src/UIView';
import Button from 'esui/Button';

export default class TestView extends UIView {
    getTemplate() {
        return '<esui-button ref="btn" on-click="onClick(event)" variants="primary" content="按钮${timer}"></esui-button>';
    }

    enterDocument() {
        let btn = this.get('btn');
    }
}
