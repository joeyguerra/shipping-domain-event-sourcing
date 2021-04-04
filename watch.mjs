import chokidar from 'chokidar';
import {spawn} from 'child_process';

const watcher = chokidar.watch('./');
const procs = [];

const didError = (code, signal)=>{
    console.error(code, signal);
};

const hasLoaded = ()=>{
    watcher.on('all', hasChanged);
    procs.shift()
    const proc = spawn(process.execPath, process.argv, { stdio: 'inherit' });
    procs.push(proc);
    proc.on('error', didError);
};

const hasChanged = (event, file) => {
    console.log("Clearing /dist/ module cache from server", event, file);
};

watcher.on('ready', hasLoaded);
