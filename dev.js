var childProcess = require('child_process');

childProcess.spawn('webpack', ['-w'], {stdio: 'inherit', cwd: './node_modules/vtpl'});
childProcess.spawn('webpack', ['-w'], {stdio: 'inherit', cwd: './node_modules/vcomponent'});

childProcess.spawn(
    'edp',
    ['webserver', '--port=9002'],
    {stdio: 'inherit'}
);
