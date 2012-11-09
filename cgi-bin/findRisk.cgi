#! /usr/bin/env python
# -*- coding:utf-8 -*-

# ------------------------------------------------------------------------------
# This script is made for ET 2012 Demo. (2012/10/25)
# This script gets D-Control script from client and sends it to D-Controller.
# ------------------------------------------------------------------------------

import urllib, urllib2
import cgi, uuid, sys, os, json, re
import cgitb
cgitb.enable();

### Config
#RiskDB_ip = 'http://127.0.0.1:8000/'
RiskDB_ip = 'http://192.168.59.150:8000/'

def keyword2riskexpression(keyword):
	return [{"keyword": "kill", "words":"あぶない"}, \
		{"keyword": "kill", "words":"すごくあぶない"}]
# 	req = RiskDB_ip + "alertme/api/1.0/search_with_word.json?query=" + keyword
# 	return urllib.urlopen(req).read()

def returnClient(risks):
	print('Content-Type: application/json')
	print('')
	print(json.dumps({'risks': risks}))

def main():
	form = cgi.FieldStorage()
	script = form.getvalue('Script')
	#commands = parse(script) ##script parse => command extract
	commands = ["kill"]
	risks = []
	for command in commands:
		risks.append(keyword2riskexpression(command))
	returnClient(risks)

if __name__ == "__main__":
	main()
