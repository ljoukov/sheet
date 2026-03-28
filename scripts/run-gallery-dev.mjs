import { spawn } from 'node:child_process';

const forwardedArgs = process.argv.slice(2);

function hasFlag(name) {
	return forwardedArgs.includes(name) || forwardedArgs.some((arg) => arg.startsWith(`${name}=`));
}

const viteArgs = [...forwardedArgs];

if (!hasFlag('--host')) {
	viteArgs.push('--host', '127.0.0.1');
}

if (!hasFlag('--port')) {
	viteArgs.push('--port', '4173');
}

const child = spawn(
	process.platform === 'win32' ? 'npm.cmd' : 'npm',
	['run', '--workspace', 'examples/gallery', 'dev', '--', ...viteArgs],
	{
		stdio: 'inherit',
		shell: false
	}
);

child.on('exit', (code, signal) => {
	if (signal) {
		process.kill(process.pid, signal);
		return;
	}
	process.exit(code ?? 0);
});
