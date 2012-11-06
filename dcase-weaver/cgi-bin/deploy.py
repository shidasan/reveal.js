#!/usr/bin/env python
# -*- coding: utf-8 -*-

print "Content-Type: text/plain; charset: utf-8;"
print ""

import cgi
import datetime
import os
import shutil
import subprocess
import tempfile

DPKGBASE = "/home/developer/www-data/D-Package"
GNUPGHOME = "/home/developer/www-data/.gnupg"
DPKGSTORE = "/home/developer/www-data/store"
DREPATH = "/usr/share/dre/bin"

def main():
    tmpdir = tempfile.mkdtemp("", "D-Package-")
    print tmpdir
    print ""

    try:
        #
        # copy base D-Package
        #
        print "copy %s %s/D-Package" % (DPKGBASE, tmpdir)
        shutil.copytree(DPKGBASE, "%s/D-Package" % tmpdir)

        form = cgi.FieldStorage()
        contents_dir = "%s/D-Package/Contents" % tmpdir

        #
        # create d-case.xml
        #
        if "dcase" in form:
            print "create %s/dcase.xml" % contents_dir
            with open("%s/dcase.xml" % contents_dir, "w") as f:
                f.write(form["dcase"].value)

        #
        # create d-script.xml
        #
        if "dscript" in form:
            print "create %s/dscript.xml" % contents_dir
            with open("%s/dscript.xml" % contents_dir, "w") as f:
                f.write(form["dscript"].value)

        #
        # create package
        #
        make_cmd = "make GNUPGHOME=%s -C %s/D-Package" % (GNUPGHOME, tmpdir)

        print make_cmd

        p = subprocess.Popen(make_cmd, shell=True,
                             stdout=subprocess.PIPE,
                             stdin=subprocess.PIPE,
                             stderr=subprocess.PIPE)
        out, err = p.communicate()

        print out, err

        if p.returncode != 0:
            return


        #
        # deploy package
        #
        deploy_cmd = "GNUPGHOME=/tmp %(drepath)s/deploy-package.sh %(tmpdir)s/D-Package/ET2011-demo-0.5.tgz" % {"drepath": DREPATH, "tmpdir": tmpdir}

        print deploy_cmd

        p = subprocess.Popen(deploy_cmd, shell=True,
                             stdout=subprocess.PIPE,
                             stdin=subprocess.PIPE,
                             stderr=subprocess.PIPE)
        out, err = p.communicate()

        print out, err

        #
        # store package
        #
        if not os.path.exists(DPKGSTORE):
            os.makedirs(DPKGSTORE)

        now = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        shutil.copyfile(
            "%s/D-Package/ET2011-demo-0.5.tgz" % tmpdir,
            "%s/%s_ET2011-demo-0.5.tgz" % (DPKGSTORE, now))

    except Exception, e:
        print e

    finally:
        shutil.rmtree(tmpdir)


if __name__ == "__main__":
    main()
