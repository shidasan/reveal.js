#!/usr/bin/env python
# -*- coding: utf-8 -*-

print "Content-Type: text/plain; charset: utf-8;"
print ""

import sys

sys.path.append("/usr/share/dre/lib/dcase")

import dcaseweaver

rows = dcaseweaver.view()

for row in rows:
    print "id=\"%(id)s\" status=\"%(status)s\" message=\"%(message)s\"" % row
