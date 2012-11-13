#! /usr/bin/env python
# -*- coding:utf-8 -*-

# ------------------------------------------------------------------------------
# This script is made for ET 2012 Demo. (2012/10/25)
# This script gets D-Control script from client and sends it to D-Controller.
# ------------------------------------------------------------------------------

import urllib, urllib2
import cgi, uuid, sys, os, json, re, commands, tempfile
import cgitb
cgitb.enable();

### Config
#RiskDB_ip = 'http://127.0.0.1:8000/'
RiskDB_ip = 'http://192.168.59.150:8000/'

def keyword2riskexpression(keyword):
	req = RiskDB_ip + "alertme/api/1.0/search_with_word.json?query=" + keyword
	res = json.loads(urllib.urlopen(req).read())
	ret = {'keyword':res["keyword"], 'count':res["count"], "words":[]}
	for risk in res["risks"]:
		ret["words"].append(risk["words"])
	return ret

def text2riskexpression(text):
	req = RiskDB_ip + "alertme/api/1.0/search.json?query=" + text
	ret = json.loads(urllib.urlopen(req).read())
	return ret

def returnClient(risks, errors):
	print('Content-Type: application/json')
	print('')
	if(len(errors) > 0):
		print(json.dumps({'risks': risks, 'errors': errors}, indent=4))
	else:
		print(json.dumps({'risks': risks}, indent=4))

def main():
	form = cgi.FieldStorage()
 	script = form.getvalue('Script')
 	text = form.getvalue('Text')
	risks = []
	cmds = []
	errors = []
	if script != None:
		script = """String getHeavyProcess(){return "";}
                            String getHeavyProcessFail(){return "";}
                            String getHeavyProcessSuccess(){return "";}
                            String getProcessNameFromPid(String pid){return "";}
                            boolean ask(String query){return true;}
""" + script
		f = tempfile.NamedTemporaryFile();
		f.write(script)
		f.flush()
		cmds = commands.getoutput("/usr/local/bin/minikonoha -DSHOW_COMMAND=on " + f.name).split('\n')
# 		cmds = ["RFP", "顧客"]
# 		cmds = ["作業タスク"]
		for cmd in cmds:
			if(cmd.find("(error)") >= 0 or cmd.find("(warning)") >= 0 or cmd.find("(info)") >= 0):
				errors.append(cmd)
			else:
				rxp = keyword2riskexpression(cmd)
				if rxp["count"] != 0:
					risks.append(rxp)
	if text != None:
		for risk in text2riskexpression(text):
			if risk["count"] != 0:
				risks.extend(risk["risks"])
	returnClient(risks, errors)

if __name__ == "__main__":
	main()
