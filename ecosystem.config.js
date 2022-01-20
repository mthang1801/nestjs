module.exports = {
  apps: [
    {
		name: 'ddvecom-service',
		//script: './src/main.ts',
		script: './dist/main.js',
		node_args: '-r ts-node/register -r tsconfig-paths/register',
		instances: 2,
		autorestart: true,
		exec_mode: 'cluster',
		max_memory_restart: '500M',
		kill_timeout : 3000
    }
  ]
};
