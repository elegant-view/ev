import ve from 've';
import controller from 'er/controller';
import TestAction from './TestAction';

testBase();

function testBase() {
    controller.registerAction({
        type: TestAction,
        path: '/TestAction'
    });

    ve.start();
}

function getNode(id) {
    let node = document.getElementById(id);
    node.style.display = 'block';
    return node;
}


