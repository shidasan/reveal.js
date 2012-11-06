#! /usr/bin/env python
# -*- coding:utf-8 -*-

# ------------------------------------------------------------------------------
# This script is made for ET 2012 Demo. (2012/10/25)
# This script gets D-Control script from client and sends it to D-Controller.
# ------------------------------------------------------------------------------

import pycurl
import urllib, urllib2
import cgi, uuid, sys, os, json

### Config
DCtrl_ip = 'http://127.0.0.1:8080'

def request_addCid():
	form = cgi.FieldStorage()
	req = ({
			'CId': createCId(),
			'TId': 123,
			'Method': form.getvalue('Method'),
			'Script': form.getvalue('Script'),
			'Option': form.getvalue('Option'),
			'Name': 'hoge.k',
			'event': 'D-Control',
			'To': '127.0.0.1:8080',
			'From': '127.0.0.1:80'
		})
	return req

def sendRequest(req):
	c = pycurl.Curl()
	c.setopt(c.URL, DCtrl_ip)
	c.setopt(c.POSTFIELDS, json.dumps(req))
	c.perform()

def returnClient(req):
	print 'Content-Type: application/json'
	print ''
	print json.dumps({
			'CId': req['CId'],
			'Result': 'success',
			'Method': 'ResponseDSE'
	})

def createCId():
	return str(uuid.uuid4())

if __name__ == '__main__':
	req = request_addCid()
	res = sendRequest(req)
	returnClient(req);
