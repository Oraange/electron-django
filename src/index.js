const { spawn } = require('child_process');
require('dotenv').config()

let DJANGO_CHILD_PROCESS = null;

const spawnDjango = () => {
    if ( isDevelopmentEnv() ) {
        // mac 버전
        // return spawn(`python`, ['python/manage.py', 'runserver', '--noreload'], { shell: true });

        // win 버전
        return spawn(`python`, ['python\\manage.py', 'runserver', '--noreload'], { shell: true });
    }

    console.log(`This environment is ${ process.env.NODE_ENV }`)
    console.log(`${__dirname}`)

    // mac 버전
    // return spawn(`cd python/dist && ./manage runserver 0.0.0.0:8000 --noreload`, { shell: true });

    // win 버전
    return spawn('cmd.exe', ['/c', 'cd python\\dist && manage runserver 0.0.0.0:8000 --noreload'], { shell: true });

}

const isDevelopmentEnv = () => {
    console.log( `NODE_ENV=${ process.env.NODE_ENV }` )
    return process.env.NODE_ENV == 'development'
}

const startDjangoServer = () => {
    DJANGO_CHILD_PROCESS = spawnDjango();

    DJANGO_CHILD_PROCESS.stdout.on('data', data => {
        console.log(`stdout:\n${data}`);
    });

    DJANGO_CHILD_PROCESS.stderr.on('data', data => {
        console.log(`stderr: ${data}`);
    });

    DJANGO_CHILD_PROCESS.on('error', (error) => {
        console.log(`error: ${error.message}`);
    });

    DJANGO_CHILD_PROCESS.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

    DJANGO_CHILD_PROCESS.on('message', (message) => {
        console.log(`message:\n${message}`);
    });

    return DJANGO_CHILD_PROCESS;
}

module.exports = { startDjangoServer };
