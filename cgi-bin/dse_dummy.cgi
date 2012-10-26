#! /usr/bin/env python
# -*- coding:utf-8 -*-

# ------------------------------------------------------------------------------
# This script is made for ET 2012 Demo. (2012/10/25)
# This script gets D-Control script from WebServer, run script and return success or not
# ------------------------------------------------------------------------------

DummyDCtrlResponce_suc = '{"Method": "ResponseDSE", "Result": "success", "Cid": "ffffffffffffffffffffffffffffffff"}';
DummyDCtrlResponce_err = '{"Method": "ResponseDSE", "Result": "error", "ErrorLog": "[Unregistered Node] 192.168.0.1"}';

if __name__ == '__main__':
	print "Content-Type: application/json"
	print ''
	print DummyDCtrlResponce_suc
