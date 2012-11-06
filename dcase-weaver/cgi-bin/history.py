#!/usr/bin/env python
# -*- coding: utf-8 -*-

print "Content-Type: application/json; charset: utf-8;"
print ""

import json
import sys

sys.path.append("/usr/share/dre/lib/dcase")

import dcaseweaver

history = dcaseweaver.history()

print json.dumps(history)
