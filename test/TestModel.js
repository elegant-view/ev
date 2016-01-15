import UIModel from 've/src/UIModel';

export default class TestModel extends UIModel {
    constructor(...args) {
        super(...args);

        this.set('onClick', function (event) {
            console.log(event);
            alert('看看控制台都打印了啥');
        });

        setInterval(() => {
            this.set('timer', new Date().getTime());
        }, 1000);
    }
}
