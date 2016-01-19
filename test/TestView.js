import UIView from 've/src/UIView';
import Button from 'esui/Button';
import TextBox from 'esui/TextBox';

export default class TestView extends UIView {
    getTemplate() {
        return [
            '<esui-button ref="btn" on-click="onClick(event)" variants="primary" content="按钮${timer}"></esui-button>',
            '<esui-text-box bind-value="age"></esui-text-box><p>${age}</p>'
        ].join('');
    }

    enterDocument() {
        this.model.set('age', 10);

        this.model.on('change', event => {
            console.log(event.changes, this.model.get('age'));
        });
    }
}
