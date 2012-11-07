#! /usr/bin/env python
# -*- coding:utf-8 -*-

# ------------------------------------------------------------------------------
# This script is made for ET 2012 Demo. (2012/10/25)
# This script gets D-Control script from client and sends it to D-Controller.
# ------------------------------------------------------------------------------

import pycurl
import urllib, urllib2
import cgi, uuid, sys, os, json, re

### Config
DCtrl_ip = 'http://127.0.0.1:8080'

def request_addCid():
	form = cgi.FieldStorage()
	cid = createCId();
	req = ({
			'CId': cid,
			'TId': 123,
			'Method': form.getvalue('Method'),
			'Script': form.getvalue('Script'),
			'Option': form.getvalue('Option'),
			'Name': cid + '.k',
			'event': 'D-Task',
			'To': '127.0.0.1:8080',
			'From': '127.0.0.1:80'
			})
	return req

def sendRequest(req):
	#string = '{"Method": "SendDSE", "Script": "System.p(123);", "Name": "hoge.k", "event": "D-Task", "To": "127.0.0.1:8080"}'
	c = pycurl.Curl()
	c.setopt(c.URL, DCtrl_ip)
	c.setopt(c.POSTFIELDS, json.dumps(req))
	c.perform()

def returnClient(req):
	print 'Content-Type: application/json'
	print ''
	#print res
	print json.dumps({
			'CId': req['CId'],
			'Result': 'success',
			'Method': 'ResponseDSE',
			'Script': req["Script"]
			})

def createCId():
	return str(uuid.uuid4())

def checkKillCmd(req):
	scripts = re.split("kill\(.*?\);", req["Script"])
	kills = re.findall("kill\(.*?\);", req["Script"])
	reqs = []
	for i, script in enumerate(scripts):
		new_req = req.copy()
		new_req["Script"] = script
		if (i < len(scripts) - 1):
			new_req["Script"] += kills[i].replace("kill", "existKillCmd")
		new_req["Name"] = req["Name"] + "." + str(i)
		reqs.append(new_req)
	return reqs

if __name__ == '__main__':
	#	req = {"Method": "SendDSE", "Script": "System.p(123);kill(456);System.p(789);", "Name": "hoge.k", "event": "D-Task", "To": "127.0.0.1:8080"}
	req = request_addCid()
	reqs = checkKillCmd(req)
	f = open("req.sotre", "w")
	for _req in reqs[1:]:
		f.write(json.dumps(_req))
	f.close()
	res = sendRequest(reqs[0])
	returnClient(req);
