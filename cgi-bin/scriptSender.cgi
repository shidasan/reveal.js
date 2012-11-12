#! /usr/bin/env python
# -*- coding:utf-8 -*-

# ------------------------------------------------------------------------------
# This script is made for ET 2012 Demo. (2012/10/25)
# This script gets D-Control script from client and sends it to D-Controller.
# ------------------------------------------------------------------------------

import pycurl
import urllib, urllib2
import cgi, uuid, sys, os, json

HOME = '/home/tsunade/reveal/'
SCRIPT_DIR = HOME + 'script/'

def escapeScript(script):
	ret = ""
	for ch in script:
		if ch == '\n':
			ret = ret + '\\n'
		elif ch == '\"':
			ret = ret + '\\"'
		elif ch == '\'':
			ret = ret + "\\'"
		elif ch == '/':
			ret = ret + "\/"
		else :
			ret = ret + ch
	return ret

def searchScript(name):
	if os.path.exists(SCRIPT_DIR + name):
		r = open(SCRIPT_DIR + name, 'r')
		ret = ''
		for l in r:
			ret = ret + l
		r.close()
	else :
		print 'Content-Type: application/json'
		print ''
# escape konoha double quort
		print '{"Method": "sendScript", "Result": "Error", "Log": "No Such File: ' + name +  '"}'
		sys.exit(0);
	return ret

def wrapJson(script):
	print 'Content-Type: application/json'
	print ''
	print '{"Method": "sendScript", "Result": "Success", "Script": "' + script + '"}'

if __name__ == '__main__':
	form = cgi.FieldStorage()
	script = searchScript(form.getvalue('ScriptName'))
	#script = searchScript('script_deos.ds')
	script = escapeScript(script)
	wrapJson(script)
