#! /usr/bin/env python
# -*- coding:utf-8 -*-

# ------------------------------------------------------------------------------
# This script is made for ET 2012 Demo. (2012/10/25)
# This script gets D-Control script from client and sends it to D-Controller.
# ------------------------------------------------------------------------------

import urllib, urllib2
import cgi, uuid, sys, os, json

### Config
DCtrl_ip = 'http://localhost'
DCtrl_url = DCtrl_ip + '/cgi-bin/dse_dummy.cgi'

def request_addCid():
	form = cgi.FieldStorage()
	req = ({
			'Cid': createCId(),
			'Method': form.getvalue('Method'),
			'Script': form.getvalue('Script'),
			'Option': form.getvalue('Option')
		})
	return req

def sendRequest(req):
	params = urllib.urlencode(req)
	return urllib2.urlopen(DCtrl_url, params)

def parseResponce(responseText):
	return True

def returnClient(res):
	print "Content-Type: application/json"
	print ''
	print res

def createCId():
	return str(uuid.uuid4())

if __name__ == '__main__':
	req = request_addCid()
	res = sendRequest(req)
	returnClient(res.read());
