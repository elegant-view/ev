import UIAction from 've/src/UIAction';
import TestModel from './TestModel';
import TestView from './TestView';

export default class TestAction extends UIAction {
    constructor(...args) {
        super(...args);

        this.modelType = TestModel;
        this.viewType = TestView;
    }
}
