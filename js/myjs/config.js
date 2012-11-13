var MANAGER = {
  name: 'DSE Manager',
  ip: '192.168.59.150',
  zbx_id: 'DSE Manager'
};

var NODE_A = {
  name: 'Node 1',
  ip: '192.168.59.151:8080',
  zbx_id: 'Node 1'
}

var CONFIG = {
  cgi_dir: 'cgi-bin',
  img_dir: 'img'
}

var TASK_A = {
  name: 'TaskA.k',
  idx: 0
}

var TASK_B = {
  name: 'TaskB.k',
  idx: 1
}

var TASK_C = {
  name: 'TaskC.k',
  idx: 2
}

var TASK_D = {
  name: 'TaskD.k',
  idx: 3
}

var DSCRIPTS = {
	'chenji_response.ds': '// chenji_response.ds\n\
\n\
import("dscript.shell");\n\
\n\
boolean KillHeavyProcess() {\n\
	String pid = getHeavyProcess();\n\
	kill -9 ${pid}\n\
}\n\
\n\
KillHeavyProcess();',
	'deos_response.ds': '// deos_response.ds\n\
\n\
import("dscript.shell");\n\
\n\
boolean KillHeavyProcess() {\n\
	String pid = getHeavyProcess();\n\
	String procName = getProcessNameFromPid(pid);\n\
	if(ask("プロセス ${procName} をkillしてもよろしいですか？")) {\n\
		kill -9 ${pid}\n\
	}\n\
}\n\
\n\
KillHeavyProcess();',
	'backup_fail.ds': '// backup_fail.ds\n\
\n\
import("cstyle.file");\n\
\n\
boolean BackupUserData() {\n\
	\/\/ directory "/etc/passwd" is not permitted to write\n\
	FILE fp = fopen("/etc/passwd", "w");\n\
	/* ... */\n\
}\n\
\n\
BackupUserData();'
};
