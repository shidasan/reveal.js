#!/usr/bin/python
# -*- coding: utf-8 -*-
#
# (C) Copyright 2009, 2011 JST - Japan Science and Technology Agency
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#

import sys, os, commands, cgi

#attach = {"node1":"cat /etc/hosts", "node2":"ls -l /tmp/dcase"}
attach = {}

def read_dict(d):
	for line in open("node.attachment", 'r'):
		line = line.rstrip()
		(a, b) = line.split(':')
		d[a] = b

#print("""""")

args = cgi.FieldStorage()

if args.has_key("file"):
	path = args["file"].value
	print("""""")
	print "--- file = " + path
	f = open(path, 'r')
	for line in f:
		print line,
	f.close()

elif args.has_key("node"):
	read_dict(attach)
	key = args["node"].value
	if key not in attach:
		print("""""")
		print "--- node = " + key + ": No Data"
		exit(0)
	action = attach[key]
	#print "--- node = " + key + ": action = " + action
	result = commands.getoutput(action)
	print result

elif args.has_key("action"):
        action = args["action"].value
	print("""""")
	print "--- action = " + action
	result = commands.getoutput(action)
	print result

#print("\n")

