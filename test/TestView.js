import UIView from 've/src/UIView';
import Button from 'esui/Button';
import TextBox from 'esui/TextBox';
import tpl from 'tpl!./test.tpl.html';

export default class TestView extends UIView {
    getTemplate() {
        return tpl;
    }

    enterDocument() {
        this.model.set('age', 10);

        this.model.on('change', event => {
            console.log(event.changes, this.model.get('age'));
        });
    }
}
