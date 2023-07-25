const { spawn } = require('child_process');

const startDjangoServer = () => {
    const djangoBackend = spawn(`python`, ['python/manage.py', 'runserver', '--noreload']);

    djangoBackend.stdout.on('data', data => {
        console.log(`stdout:\n${data}`);
    });

    djangoBackend.stderr.on('data', data => {
        console.log(`stderr: ${data}`);
    });

    djangoBackend.on('error', (error) => {
        console.log(`error: ${error.message}`);
    });

    djangoBackend.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

    djangoBackend.on('message', (message) => {
        console.log(`message:\n${message}`);
    });

    return djangoBackend;
}

module.exports = { startDjangoServer };
