function A() {
    this.$a = null;
    this.$b = 0;
    this.$c = 0;
    this.$d = 0;
    this.$e = 0;
    this.$f = 0;
}

function B() {
    this.$a = 0;
    this.$b = 0;
    this.$c = 0;
    this.$d = 0;
    this.$e = 0;
    this.$f = null;
    this.$g = null;
    this.$h = null;
    this.$i = 0;
    this.$j = 0;
    this.$k = 0;
    this.$l = 0;
    this.$m = 0;
    this.$n = 0;
    this.$o = 0;
}

C.prototype = new B()
function C() {
    this.$a = 0;
    this.$b = 0;
    this.$c = 0;
    this.$d = 0;
    this.$e = 0;
    this.$f = null;
    this.$g = null;
    this.$h = null;
    this.$i = 0;
    this.$j = 0;
    this.$k = 0;
    this.$l = 0;
    this.$m = 0;
    this.$n = 0;
    this.$o = 0;
}

D.prototype = new B()
function D() {
    this.$a = 0;
    this.$b = 0;
    this.$c = 0;
    this.$d = 0;
    this.$e = 0;
    this.$f = null;
    this.$g = null;
    this.$h = null;
    this.$i = 0;
    this.$j = 0;
    this.$k = 0;
    this.$l = 0;
    this.$m = 0;
    this.$n = 0;
    this.$o = 0;
}

A.prototype.a = function ($a, $b, $c) {
    var $d = this;
    var $e = new konoha.OutputStream(true);
    var $f = new konoha.OutputStream(true);
    var $g = new konoha.OutputStream(true);
    var $h = new konoha.OutputStream(true);
    var $i = new konoha.OutputStream(true);
    var $j = new konoha.OutputStream(true);
    var $k = new konoha.String("rgb(");
    $j.send($k);
    var $l = 256;
    var $m = konoha.Int.random($l);
    $j.send($m);
    var $n = $j.tostr();
    $i.send($n);
    var $o = new konoha.String(",");
    $i.send($o);
    var $p = $i.tostr();
    $h.send($p);
    var $q = 256;
    var $r = konoha.Int.random($q);
    $h.send($r);
    var $s = $h.tostr();
    $g.send($s);
    var $t = new konoha.String(",");
    $g.send($t);
    var $u = $g.tostr();
    $f.send($u);
    var $v = 256;
    var $w = konoha.Int.random($v);
    $f.send($w);
    var $x = $f.tostr();
    $e.send($x);
    var $y = new konoha.String(")");
    $e.send($y);
    var $z = $e.tostr();
    $d.$a = $z;
    var $ba = $b;
    var $bb = 0.50000000000000000000;
    var $bc = $ba * $bb;
    $d.$b = $bc;
    var $bd = $c;
    var $be = 0.50000000000000000000;
    var $bf = $bd * $be;
    $d.$c = $bf;
    var $bg = $a;
    var $bh = konoha.math.Math.cos($bg);
    var $bi = konoha.Float.random();
    var $bj = $bh * $bi;
    var $bk = 34.00000000000000000000;
    var $bl = $bj * $bk;
    $d.$d = $bl;
    var $bm = $a;
    var $bn = konoha.math.Math.sin($bm);
    var $bo = konoha.Float.random();
    var $bp = $bn * $bo;
    var $bq = 34.00000000000000000000;
    var $br = $bp * $bq;
    $d.$e = $br;
    return $d;
};

B.prototype.a = function () {
    var $a = this;
    return $a;
};

B.prototype.b = function () {
    var $a = this;
    var $b = 600;
    $a.$a = $b;
    var $c = 400;
    $a.$b = $c;
    var $d = 800;
    $a.$d = $d;
    var $e = 0.97999999999999998224;
    $a.$e = $e;
    var $f = new konoha.Array();
    var $g = $f.new_LIST();
    $a.$f = $g;
    return;
};

B.prototype.c = function () {
    var $a = this;
    var label = 0;
    while (true) {
        switch (label) {
        case 0:
            var $b = new js.jquery.JQuery();
            var $c = new konoha.String("#mainCanvas");
            var $d = $b._new($c);
            var $e = new konoha.String("width");
            var $f = new konoha.OutputStream(true);
            var $g = $a.$a;
            $f.send($g);
            var $h = new konoha.String("");
            $f.send($h);
            var $i = $f.tostr();
            var $j = $d.attr($e, $i);
            var $k = new js.jquery.JQuery();
            var $l = new konoha.String("#mainCanvas");
            var $m = $k._new($l);
            var $n = new konoha.String("height");
            var $o = new konoha.OutputStream(true);
            $g = $a.$b;
            $o.send($g);
            $h = new konoha.String("");
            $o.send($h);
            $i = $o.tostr();
            var $p = $m.attr($n, $i);
            var $q = $a.$g;
            var $r = new konoha.String("2d");
            var $s = $q.getContext($r);
            $a.$h = $s;
            var $t = $a.$f;
            $t.clear();
            var $u = 0;
            var $v = $a;
            var $w = $u;
            label = 1;
            break;
        case 1:
            $v = $a;
            var $x = $v.$d;
            var $y = $w < $x;
            if ($y) {
                label = 2;
            } else {
                label = 4;
            }
            break;
        case 2:
            var $z = $v.$f;
            var $ba = new A();
            var $bb = $v.$a;
            var $bc = $v.$b;
            var $bd = $ba.a($w, $bb, $bc);
            $z.add($bd);
            label = 3;
            break;
        case 3:
            var $be = 1;
            var $bf = $w + $be;
            $w = $bf;
            label = 1;
            break;
        case 4:
            var $bg = $v.$a;
            var $bh = $bg;
            var $bi = 0.50000000000000000000;
            var $bj = $bh * $bi;
            $u = Math.floor($bj);
            $v.$i = $u;
            $bf = $v.$i;
            $v.$m = $bf;
            $bg = $v.$b;
            $bh = $bg;
            var $bk = 0.50000000000000000000;
            $bj = $bh * $bk;
            $u = Math.floor($bj);
            $v.$j = $u;
            $bf = $v.$j;
            $v.$n = $bf;
            var $bl = new js.jquery.JQuery();
            var $bm = new konoha.String("canvas");
            $d = $bl._new($bm);
            var $bn = new konoha.Method(js.dom.Element.onMouseMove);
            $d.mousemove($bn);
            var $bo = new js.jquery.JQuery();
            var $bp = new konoha.String("#mainCanvas");
            $m = $bo._new($bp);
            var $bq = new konoha.Method(js.dom.Element.onMouseDown);
            $m.mousedown($bq);
            var $br = new js.jquery.JQuery();
            var $bs = new konoha.String("#mainCanvas");
            var $bt = $br._new($bs);
            var $bu = new konoha.Method(js.dom.Element.onMouseUp);
            $bt.mouseup($bu);
            return;
        }
    }
};

B.prototype.d = function () {
    var $a = this;
    var $b = new js.dom.Document();
    var $c = new konoha.String("mainCanvas");
    var $d = $b.getElementById($c);
    var $e = $d;
    $a.$g = $e;
    $a.c();
    return;
};

B.prototype.e = function () {
    var $a = this;
    var $b = new js.jquery.JQuery();
    var $c = new konoha.String("body");
    var $d = $b._new($c);
    var $e = new konoha.String("<canvas class='big' id='mainCanvas'>");
    var $f = $d.append($e);
    var $g = new js.jquery.JQuery();
    var $h = new konoha.String("#mainCanvas");
    var $i = $g._new($h);
    var $j = new konoha.String("visibility");
    var $k = new konoha.String("hidden");
    var $l = $i.css($j, $k);
    var $m = new konoha.String("display");
    var $n = new konoha.String("block");
    var $o = $l.css($m, $n);
    $a.d();
    var $p = new js.jquery.JQuery();
    var $q = new konoha.String("#mainCanvas");
    var $r = $p._new($q);
    var $s = new konoha.String("display");
    var $t = new konoha.String("none");
    var $u = $r.css($s, $t);
    var $v = new konoha.String("visibility");
    var $w = new konoha.String("visible");
    $f = $u.css($v, $w);
    var $x = new js.jquery.JQuery();
    var $y = new js.dom.Window();
    var $z = $x._new($y);
    var $ba = $z.width();
    var $bb = new js.jquery.JQuery();
    var $bc = new js.dom.Window();
    var $bd = $bb._new($bc);
    var $be = $bd.height();
    var $bf = new js.jquery.JQuery();
    var $bg = new konoha.String("#mainCanvas");
    var $bh = $bf._new($bg);
    var $bi = $bh.width();
    var $bj = new js.jquery.JQuery();
    var $bk = new konoha.String("#mainCanvas");
    var $bl = $bj._new($bk);
    var $bm = $bl.height();
    var $bn = $ba - $bi;
    var $bo = 20;
    var $bp = $bn - $bo;
    var $bq = 2;
    var $br = Math.floor($bp / $bq);
    var $bs = $be - $bm;
    var $bt = 20;
    var $bu = $bs - $bt;
    var $bv = 50;
    var $bw = $bu - $bv;
    var $bx = 2;
    var $by = Math.floor($bw / $bx);
    var $bz = new js.jquery.JQuery();
    var $ca = new konoha.String("#mainCanvas");
    var $cb = $bz._new($ca);
    var $cc = new konoha.String("left");
    var $cd = new konoha.OutputStream(true);
    $cd.send($br);
    var $ce = new konoha.String("px");
    $cd.send($ce);
    var $cf = $cd.tostr();
    var $cg = $cb.css($cc, $cf);
    $bg = new konoha.String("top");
    var $ch = new konoha.OutputStream(true);
    $ch.send($by);
    var $ci = new konoha.String("px");
    $ch.send($ci);
    $bk = $ch.tostr();
    $bh = $cg.css($bg, $bk);
    var $cj = $a.$a;
    var $ck = 10;
    var $cl = Math.floor($cj / $ck);
    var $cm = 9;
    var $cn = $cl * $cm;
    $bn = $br + $cn;
    var $co = new js.jquery.JQuery();
    var $cp = new konoha.String("#close");
    var $cq = $co._new($cp);
    $cf = new konoha.String("left");
    var $cr = new konoha.OutputStream(true);
    $cr.send($bn);
    var $cs = new konoha.String("px");
    $cr.send($cs);
    $ci = $cr.tostr();
    $bj = $cq.css($cf, $ci);
    var $ct = new konoha.String("top");
    var $cu = new konoha.OutputStream(true);
    var $cv = $by + $bm;
    var $cw = 20;
    var $cx = $cv + $cw;
    $cu.send($cx);
    var $cy = new konoha.String("px");
    $cu.send($cy);
    $h = $cu.tostr();
    $bl = $bj.css($ct, $h);
    $co = new js.jquery.JQuery();
    $cp = new konoha.String("#demo1");
    var $cz = $co._new($cp);
    var $da = new konoha.String("left");
    var $db = new konoha.OutputStream(true);
    $db.send($br);
    var $dc = new konoha.String("px");
    $db.send($dc);
    $ci = $db.tostr();
    var $dd = $cz.css($da, $ci);
    var $de = new konoha.String("top");
    $cu = new konoha.OutputStream(true);
    $cv = $by + $bm;
    $cw = 20;
    $cx = $cv + $cw;
    $cu.send($cx);
    $cy = new konoha.String("px");
    $cu.send($cy);
    $h = $cu.tostr();
    var $df = $dd.css($de, $h);
    var $dg = $a.$a;
    $ck = 10;
    var $dh = Math.floor($dg / $ck);
    $bo = $br + $dh;
    $co = new js.jquery.JQuery();
    $cp = new konoha.String("#demo2");
    var $di = $co._new($cp);
    var $dj = new konoha.String("left");
    var $dk = new konoha.OutputStream(true);
    $dk.send($bo);
    var $dl = new konoha.String("px");
    $dk.send($dl);
    $ci = $dk.tostr();
    $bj = $di.css($dj, $ci);
    var $dm = new konoha.String("top");
    $cu = new konoha.OutputStream(true);
    $cv = $by + $bm;
    $cw = 20;
    $cx = $cv + $cw;
    $cu.send($cx);
    $cy = new konoha.String("px");
    $cu.send($cy);
    $h = $cu.tostr();
    $bl = $bj.css($dm, $h);
    $ck = $a.$a;
    var $dn = 10;
    var $do = Math.floor($ck / $dn);
    var $dp = 2;
    var $dq = $do * $dp;
    $bo = $br + $dq;
    $co = new js.jquery.JQuery();
    $cp = new konoha.String("#demo3");
    var $dr = $co._new($cp);
    var $ds = new konoha.String("left");
    var $dt = new konoha.OutputStream(true);
    $dt.send($bo);
    var $du = new konoha.String("px");
    $dt.send($du);
    $ci = $dt.tostr();
    $bj = $dr.css($ds, $ci);
    $bk = new konoha.String("top");
    $cu = new konoha.OutputStream(true);
    $cv = $by + $bm;
    $cw = 20;
    $cx = $cv + $cw;
    $cu.send($cx);
    $cy = new konoha.String("px");
    $cu.send($cy);
    $h = $cu.tostr();
    $bl = $bj.css($bk, $h);
    var $dv = $a.$a;
    var $dw = 10;
    $bo = Math.floor($dv / $dw);
    var $dx = new js.jquery.JQuery();
    $ci = new konoha.String("#close");
    $g = $dx._new($ci);
    var $dy = 20;
    var $dz = $bo + $dy;
    var $ea = $g.width($dz);
    var $eb = new js.jquery.JQuery();
    var $ec = new konoha.String("#demo1");
    $p = $eb._new($ec);
    var $ed = $p.width($bo);
    var $ee = new js.jquery.JQuery();
    var $ef = new konoha.String("#demo2");
    var $eg = $ee._new($ef);
    var $eh = $eg.width($bo);
    var $ei = new js.jquery.JQuery();
    var $ej = new konoha.String("#demo3");
    var $ek = $ei._new($ej);
    var $el = $ek.width($bo);
    var $em = new js.jquery.JQuery();
    var $en = new konoha.String("#mainCanvas , #close");
    var $eo = $em._new($en);
    var $ep = 500;
    $eo.fadeIn($ep);
    var $eq = new js.jquery.JQuery();
    var $er = new konoha.String("#demo1");
    var $es = $eq._new($er);
    var $et = 500;
    $es.fadeIn($et);
    var $eu = new js.jquery.JQuery();
    var $ev = new konoha.String("#demo2");
    var $ew = $eu._new($ev);
    var $ex = 500;
    $ew.fadeIn($ex);
    var $ey = new js.jquery.JQuery();
    var $ez = new konoha.String("#demo3");
    var $fa = $ey._new($ez);
    var $fb = 500;
    $fa.fadeIn($fb);
    var $fc = $a.$h;
    $h = new konoha.String("source-over");
    $fc.setGlobalCompositeOperation($h);
    var $fd = $a.$h;
    $q = new konoha.String("rgba(8,8,12,.65)");
    $fd.setFillStyle($q);
    var $fe = $a.$h;
    var $ff = 0.00000000000000000000;
    var $fg = 0.00000000000000000000;
    var $fh = $a.$a;
    var $fi = $fh;
    var $fj = $a.$b;
    var $fk = $fj;
    $fe.fillRect($ff, $fg, $fi, $fk);
    var $fl = $a.$h;
    $h = new konoha.String("#ffffff");
    $fl.setFillStyle($h);
    var $fm = $a.$h;
    $q = new konoha.String("20pt Arial");
    $fm.setFont($q);
    var $fn = $a.$h;
    var $fo = new konoha.String("JavaScript Demo Page");
    var $fp = 300.00000000000000000000;
    $fj = $a.$b;
    var $fq = 2;
    $dy = Math.floor($fj / $fq);
    $fi = $dy;
    $fn.fillText($fo, $fp, $fi);
    var $fr = $a.$h;
    var $fs = new konoha.String("lighter");
    $fr.setGlobalCompositeOperation($fs);
    return;
};

function _a($a) {
    var $b = new B(null);
    $a.$a = $b;
    return;
}

function _b($a) {
    var $b = new B(null);
    $a.$b = $b;
    return;
}

function _c($a) {
    var $b = $a.$b;
    $b.b();
    return;
}

C.prototype.k = function () {
    var $a = this;
    return $a;
};

C.prototype.l = function () {
    var $a = this;
    var $b = 600;
    $a.$a = $b;
    var $c = 400;
    $a.$b = $c;
    var $d = 800;
    $a.$d = $d;
    var $e = 1.00000000000000000000;
    $a.$e = $e;
    var $f = new konoha.Array();
    var $g = $f.new_LIST();
    $a.$f = $g;
    return;
};

C.prototype.m = function () {
    var $a = this;
    var $b = new js.jquery.JQuery();
    var $c = new konoha.String("body");
    var $d = $b._new($c);
    var $e = new konoha.String("<canvas class='big' id='mainCanvas'>");
    var $f = $d.append($e);
    var $g = new js.jquery.JQuery();
    var $h = new konoha.String("#mainCanvas");
    var $i = $g._new($h);
    var $j = new konoha.String("visibility");
    var $k = new konoha.String("hidden");
    var $l = $i.css($j, $k);
    var $m = new konoha.String("display");
    var $n = new konoha.String("block");
    var $o = $l.css($m, $n);
    $a.d();
    var $p = new js.jquery.JQuery();
    var $q = new konoha.String("#mainCanvas");
    var $r = $p._new($q);
    var $s = new konoha.String("display");
    var $t = new konoha.String("none");
    var $u = $r.css($s, $t);
    var $v = new konoha.String("visibility");
    var $w = new konoha.String("visible");
    $f = $u.css($v, $w);
    var $x = new js.jquery.JQuery();
    var $y = new js.dom.Window();
    var $z = $x._new($y);
    var $ba = $z.width();
    var $bb = new js.jquery.JQuery();
    var $bc = new js.dom.Window();
    var $bd = $bb._new($bc);
    var $be = $bd.height();
    var $bf = new js.jquery.JQuery();
    var $bg = new konoha.String("#mainCanvas");
    var $bh = $bf._new($bg);
    var $bi = $bh.width();
    var $bj = new js.jquery.JQuery();
    var $bk = new konoha.String("#mainCanvas");
    var $bl = $bj._new($bk);
    var $bm = $bl.height();
    var $bn = $ba - $bi;
    var $bo = 20;
    var $bp = $bn - $bo;
    var $bq = 2;
    var $br = Math.floor($bp / $bq);
    var $bs = $be - $bm;
    var $bt = 20;
    var $bu = $bs - $bt;
    var $bv = 50;
    var $bw = $bu - $bv;
    var $bx = 2;
    var $by = Math.floor($bw / $bx);
    var $bz = new js.jquery.JQuery();
    var $ca = new konoha.String("#mainCanvas");
    var $cb = $bz._new($ca);
    var $cc = new konoha.String("left");
    var $cd = new konoha.OutputStream(true);
    $cd.send($br);
    var $ce = new konoha.String("px");
    $cd.send($ce);
    var $cf = $cd.tostr();
    var $cg = $cb.css($cc, $cf);
    $bg = new konoha.String("top");
    var $ch = new konoha.OutputStream(true);
    $ch.send($by);
    var $ci = new konoha.String("px");
    $ch.send($ci);
    $bk = $ch.tostr();
    $bh = $cg.css($bg, $bk);
    var $cj = new js.jquery.JQuery();
    var $ck = new konoha.String("#mainCanvas");
    var $cl = $cj._new($ck);
    var $cm = 500;
    $cl.fadeIn($cm);
    var $cn = new konoha.Method(js.dom.Element.draw);
    var $co = 33;
    $bn = konoha.System.setInterval($cn, $co);
    $a.$c = $bn;
    return;
};

function _d($a) {
    var $b = new C(null);
    $a.$c = $b;
    return;
}

function _e($a) {
    var $b = $a.$c;
    $b.l();
    return;
}

D.prototype.k = function () {
    var $a = this;
    return $a;
};

D.prototype.l = function () {
    var $a = this;
    var $b = 600;
    $a.$a = $b;
    var $c = 400;
    $a.$b = $c;
    var $d = 800;
    $a.$d = $d;
    var $e = 0.97999999999999998224;
    $a.$e = $e;
    var $f = new konoha.Array();
    var $g = $f.new_LIST();
    $a.$f = $g;
    return;
};

D.prototype.m = function () {
    var $a = this;
    var $b = new js.jquery.JQuery();
    var $c = new konoha.String("body");
    var $d = $b._new($c);
    var $e = new konoha.String("<canvas class='big' id='mainCanvas'>");
    var $f = $d.append($e);
    var $g = new js.jquery.JQuery();
    var $h = new konoha.String("#mainCanvas");
    var $i = $g._new($h);
    var $j = new konoha.String("visibility");
    var $k = new konoha.String("hidden");
    var $l = $i.css($j, $k);
    var $m = new konoha.String("display");
    var $n = new konoha.String("block");
    var $o = $l.css($m, $n);
    $a.d();
    var $p = new js.jquery.JQuery();
    var $q = new konoha.String("#mainCanvas");
    var $r = $p._new($q);
    var $s = new konoha.String("display");
    var $t = new konoha.String("none");
    var $u = $r.css($s, $t);
    var $v = new konoha.String("visibility");
    var $w = new konoha.String("visible");
    $f = $u.css($v, $w);
    var $x = new js.jquery.JQuery();
    var $y = new js.dom.Window();
    var $z = $x._new($y);
    var $ba = $z.width();
    var $bb = new js.jquery.JQuery();
    var $bc = new js.dom.Window();
    var $bd = $bb._new($bc);
    var $be = $bd.height();
    var $bf = new js.jquery.JQuery();
    var $bg = new konoha.String("#mainCanvas");
    var $bh = $bf._new($bg);
    var $bi = $bh.width();
    var $bj = new js.jquery.JQuery();
    var $bk = new konoha.String("#mainCanvas");
    var $bl = $bj._new($bk);
    var $bm = $bl.height();
    var $bn = $ba - $bi;
    var $bo = 20;
    var $bp = $bn - $bo;
    var $bq = 2;
    var $br = Math.floor($bp / $bq);
    var $bs = $be - $bm;
    var $bt = 20;
    var $bu = $bs - $bt;
    var $bv = 50;
    var $bw = $bu - $bv;
    var $bx = 2;
    var $by = Math.floor($bw / $bx);
    var $bz = new js.jquery.JQuery();
    var $ca = new konoha.String("#mainCanvas");
    var $cb = $bz._new($ca);
    var $cc = new konoha.String("left");
    var $cd = new konoha.OutputStream(true);
    $cd.send($br);
    var $ce = new konoha.String("px");
    $cd.send($ce);
    var $cf = $cd.tostr();
    var $cg = $cb.css($cc, $cf);
    $bg = new konoha.String("top");
    var $ch = new konoha.OutputStream(true);
    $ch.send($by);
    var $ci = new konoha.String("px");
    $ch.send($ci);
    $bk = $ch.tostr();
    $bh = $cg.css($bg, $bk);
    var $cj = new js.jquery.JQuery();
    var $ck = new konoha.String("#mainCanvas");
    var $cl = $cj._new($ck);
    var $cm = 500;
    $cl.fadeIn($cm);
    var $cn = new konoha.Method(js.dom.Element.draw);
    var $co = 33;
    $bn = konoha.System.setInterval($cn, $co);
    $a.$c = $bn;
    return;
};

function _f($a) {
    var $b = new D(null);
    $a.$d = $b;
    return;
}

function _g($a) {
    var $b = $a.$d;
    $b.l();
    return;
}

function b() {
    var $a = script;
    var $b = $a.$d;
    var $c = $b.$c;
    konoha.System.clearInterval($c);
    var $d = $a.$b;
    var $e = $d.$c;
    konoha.System.clearInterval($e);
    var $f = $a.$c;
    var $g = $f.$c;
    konoha.System.clearInterval($g);
    return;
}

function c() {
    var $a = new js.jquery.JQuery();
    var $b = new konoha.String("#mainCanvas");
    var $c = $a._new($b);
    var $d = $c.remove();
    return;
}

js.dom.Element.click1 = function () {
    var $a = this;
    var $b = script;
    var $c = new js.jquery.JQuery();
    var $d = new js.dom.Window();
    var $e = $c._new($d);
    var $f = $e.height();
    var $g = new js.jquery.JQuery();
    var $h = new konoha.String("#back");
    var $i = $g._new($h);
    var $j = $i.height($f);
    var $k = new js.jquery.JQuery();
    var $l = new konoha.String("#back");
    var $m = $k._new($l);
    var $n = new konoha.String("opacity");
    var $o = new konoha.String("0.7");
    var $p = $m.css($n, $o);
    var $q = 200;
    $p.fadeIn($q);
    var $r = $b.$b;
    $b.$a = $r;
    var $s = $b.$b;
    $s.e();
    return;
};

js.dom.Element.click2 = function () {
    var $a = this;
    b();
    c();
    var $b = new js.jquery.JQuery();
    var $c = new konoha.String("body");
    var $d = $b._new($c);
    $d.unbind();
    var $e = new js.jquery.JQuery();
    var $f = new konoha.String("#mainCanvas");
    var $g = $e._new($f);
    $g.unbind();
    var $h = new js.jquery.JQuery();
    var $i = new konoha.String("#back , #close");
    var $j = $h._new($i);
    var $k = new konoha.String("display");
    var $l = new konoha.String("none");
    var $m = $j.css($k, $l);
    var $n = new js.jquery.JQuery();
    var $o = new konoha.String("#demo1");
    var $p = $n._new($o);
    var $q = new konoha.String("display");
    var $r = new konoha.String("none");
    var $s = $p.css($q, $r);
    var $t = new js.jquery.JQuery();
    var $u = new konoha.String("#demo2");
    var $v = $t._new($u);
    var $w = new konoha.String("display");
    var $x = new konoha.String("none");
    var $y = $v.css($w, $x);
    var $z = new js.jquery.JQuery();
    var $ba = new konoha.String("#demo3");
    var $bb = $z._new($ba);
    var $bc = new konoha.String("display");
    var $bd = new konoha.String("none");
    var $be = $bb.css($bc, $bd);
    return;
};

js.dom.Element.click3 = function () {
    var $a = this;
    var $b = script;
    b();
    c();
    var $c = $b.$d;
    $b.$a = $c;
    var $d = $b.$d;
    $d.m();
    return;
};

js.dom.Element.click4 = function () {
    var $a = this;
    var $b = script;
    b();
    c();
    var $c = $b.$b;
    $b.$a = $c;
    var $d = $b.$b;
    $d.e();
    return;
};

js.dom.Element.click5 = function () {
    var $a = this;
    var $b = script;
    b();
    c();
    var $c = $b.$c;
    $b.$a = $c;
    var $d = $b.$c;
    $d.m();
    return;
};

js.dom.Element.onMouseMove = function ($a) {
    var $b = this;
    var $c = script;
    var $d = new js.jquery.JQuery();
    var $e = new konoha.String("#mainCanvas");
    var $f = $d._new($e);
    var $g = $f.offset();
    var $h = new js.jquery.JQuery();
    var $i = new konoha.String("#canvasContainer");
    var $j = $h._new($i);
    var $k = $j.offset();
    var $l = $c.$d;
    var $m = $a.pageX();
    var $n = $g.getLeft();
    var $o = $m - $n;
    var $p = 10;
    var $q = $o - $p;
    $l.$i = $q;
    var $r = $c.$d;
    var $s = $a.pageY();
    var $t = $g.getTop();
    var $u = $s - $t;
    var $v = 10;
    var $w = $u - $v;
    $r.$j = $w;
    return;
};

js.dom.Element.onMouseDown = function ($a) {
    var $b = this;
    var $c = script;
    var $d = $c.$d;
    var $e = true;
    $d.$o = $e;
    var $f = false;
    return $f;
};

js.dom.Element.onMouseUp = function ($a) {
    var $b = this;
    var $c = script;
    var $d = $c.$d;
    var $e = false;
    $d.$o = $e;
    var $f = false;
    return $f;
};

js.dom.Element.draw = function () {
    var $a = this;
    var label = 0;
    while (true) {
        switch (label) {
        case 0:
            var $b = script;
            var $c = $b.$a;
            var $d = $c.$a;
            var $e = $b.$a;
            var $f = $e.$b;
            var $g = $b.$a;
            var $h = $g.$h;
            var $i = new konoha.String("source-over");
            $h.setGlobalCompositeOperation($i);
            var $j = new konoha.String("rgba(8,8,12,.65)");
            $h.setFillStyle($j);
            var $k = 0.00000000000000000000;
            var $l = 0.00000000000000000000;
            var $m = $d;
            var $n = $f;
            $h.fillRect($k, $l, $m, $n);
            $i = new konoha.String("lighter");
            $h.setGlobalCompositeOperation($i);
            var $o = $b.$a;
            var $p = $b.$a;
            var $q = $p.$i;
            var $r = $b.$a;
            var $s = $r.$m;
            var $t = $q - $s;
            var $u = $t;
            $o.$k = $u;
            var $v = $b.$a;
            $p = $b.$a;
            var $w = $p.$j;
            var $x = $b.$a;
            $s = $x.$n;
            $t = $w - $s;
            $u = $t;
            $v.$l = $u;
            var $y = $b.$a;
            var $z = $b.$a;
            $t = $z.$i;
            $y.$m = $t;
            var $ba = $b.$a;
            var $bb = $b.$a;
            var $bc = $bb.$j;
            $ba.$n = $bc;
            var $bd = $d;
            $u = 0.85999999999999998668;
            var $be = $bd * $u;
            var $bf = $d;
            var $bg = 0.12500000000000000000;
            var $bh = $bf * $bg;
            var $bi = $d;
            var $bj = 0.50000000000000000000;
            var $bk = $bi * $bj;
            $q = 0;
            var $bl = $a;
            var $bm = $b;
            var $bn = $d;
            var $bo = $f;
            var $bp = $h;
            var $bq = $be;
            var $br = $bh;
            var $bs = $bk;
            $w = $q;
            label = 1;
            break;
        case 1:
            $bl = $a;
            $bm = $b;
            $bn = $d;
            $bo = $f;
            $bp = $h;
            $bq = $be;
            $br = $bh;
            $bs = $bk;
            var $bt = $bm.$a;
            var $bu = $bt.$d;
            var $bv = $w < $bu;
            if ($bv) {
                label = 2;
            } else {
                label = 4;
            }
            break;
        case 2:
            var $bw = $bm.$a;
            var $bx = $bw.$f;
            var $by = $bx.get($w);
            $k = $by.$b;
            $l = $by.$c;
            $m = $by.$d;
            $n = $by.$e;
            var $bz = $bm.$a;
            var $ca = $bz.$i;
            var $cb = $ca;
            var $cc = $k - $cb;
            var $cd = $bm.$a;
            var $ce = $cd.$j;
            var $cf = $ce;
            var $cg = $l - $cf;
            var $ch = $cc * $cc;
            var $ci = $cg * $cg;
            var $cj = $ch + $ci;
            var $ck = konoha.math.Math.sqrt($cj);
            var $cl = 0.00000000000000000000;
            var $cm = $ck == $cl;
            if ($cm) {
                label = 5;
            } else {
                label = 6;
            }
            break;
        case 3:
            var $cn = 1;
            $s = $w + $cn;
            $w = $s;
            label = 1;
            break;
        case 4:
            return;
        case 5:
            var $co = 0.00100000000000000002;
            var $cp = $co;
            label = 7;
            break;
        case 6:
            $cp = $ck;
            label = 7;
            break;
        case 7:
            var $cq = $cc / $cp;
            var $cr = $cg / $cp;
            var $cs = true;
            var $ct = false;
            var $cu = $bm.$a;
            var $cv = $cu.$o;
            var $cw = $ct;
            if ($cv) {
                label = 9;
            } else {
                label = 8;
            }
            break;
        case 8:
            if ($cw) {
                label = 11;
            } else {
                label = 12;
            }
            break;
        case 9:
            var $cx = $cp < $bs;
            $cw = $ct;
            if ($cx) {
                label = 10;
            } else {
                label = 8;
            }
            break;
        case 10:
            $cw = $cs;
            label = 8;
            break;
        case 11:
            var $cy = 1.00000000000000000000;
            var $cz = $cp / $bs;
            var $da = $cy - $cz;
            var $db = 14.00000000000000000000;
            var $dc = $da * $db;
            var $dd = $cq * $dc;
            var $de = 0.50000000000000000000;
            var $df = $dd + $de;
            var $dg = konoha.Float.random();
            var $dh = $df - $dg;
            var $di = $m + $dh;
            var $dj = $cr * $dc;
            var $dk = 0.50000000000000000000;
            var $dl = $dj + $dk;
            var $dm = konoha.Float.random();
            var $dn = $dl - $dm;
            var $do = $n + $dn;
            var $dp = $di;
            var $dq = $do;
            label = 13;
            break;
        case 12:
            $dp = $m;
            $dq = $n;
            label = 13;
            break;
        case 13:
            $cm = $cp < $bq;
            if ($cm) {
                label = 14;
            } else {
                label = 15;
            }
            break;
        case 14:
            var $dr = 1.00000000000000000000;
            var $ds = $cp / $bq;
            var $dt = $dr - $ds;
            var $du = $bn;
            $da = $dt * $du;
            var $dv = 0.00139999999999999999;
            var $dw = $da * $dv;
            var $dx = $cq * $dw;
            $di = $dp - $dx;
            var $dy = $cr * $dw;
            $do = $dq - $dy;
            $dp = $di;
            $dq = $do;
            label = 16;
            break;
        case 15:
            $dp = $dp;
            $dq = $dq;
            label = 16;
            break;
        case 16:
            $cm = $cp < $br;
            if ($cm) {
                label = 17;
            } else {
                label = 18;
            }
            break;
        case 17:
            var $dz = 1.00000000000000000000;
            var $ea = $cp / $br;
            var $eb = $dz - $ea;
            var $ec = $bn;
            $da = $eb * $ec;
            var $ed = 0.00025999999999999998;
            var $ee = $da * $ed;
            var $ef = $bm.$a;
            var $eg = $ef.$k;
            var $eh = $eg * $ee;
            $di = $dp + $eh;
            var $ei = $bm.$a;
            var $ej = $ei.$l;
            var $ek = $ej * $ee;
            $do = $dq + $ek;
            $dp = $di;
            $dq = $do;
            label = 19;
            break;
        case 18:
            $dp = $dp;
            $dq = $dq;
            label = 19;
            break;
        case 19:
            var $el = $bm.$a;
            var $em = $el.$e;
            var $en = $dp * $em;
            var $eo = $bm.$a;
            var $ep = $eo.$e;
            var $eq = $dq * $ep;
            var $er = konoha.math.Math.fabs($en);
            var $es = konoha.math.Math.fabs($eq);
            $cl = $er + $es;
            var $et = 0.50000000000000000000;
            var $eu = $cl * $et;
            var $ev = 0.10000000000000000555;
            var $ew = $er < $ev;
            if ($ew) {
                label = 20;
            } else {
                label = 21;
            }
            break;
        case 20:
            var $ex = konoha.Float.random();
            $cj = $en * $ex;
            $ch = 3.00000000000000000000;
            $cz = $cj * $ch;
            $dh = $cz;
            label = 22;
            break;
        case 21:
            $dh = $en;
            label = 22;
            break;
        case 22:
            var $ey = 0.10000000000000000555;
            $ew = $es < $ey;
            if ($ew) {
                label = 23;
            } else {
                label = 24;
            }
            break;
        case 23:
            var $ez = konoha.Float.random();
            $cj = $eq * $ez;
            $dd = 3.00000000000000000000;
            $dn = $cj * $dd;
            $dr = $dn;
            label = 25;
            break;
        case 24:
            $dr = $eq;
            label = 25;
            break;
        case 25:
            $dg = 0.45000000000000001110;
            $du = $eu * $dg;
            var $fa = 3.50000000000000000000;
            var $fb = $du > $fa;
            if ($fb) {
                label = 26;
            } else {
                label = 27;
            }
            break;
        case 26:
            $dx = 3.50000000000000000000;
            $dy = $dx;
            label = 28;
            break;
        case 27:
            $dy = $du;
            label = 28;
            break;
        case 28:
            var $fc = 0.40000000000000002220;
            var $fd = $dy < $fc;
            if ($fd) {
                label = 29;
            } else {
                label = 30;
            }
            break;
        case 29:
            $dz = 0.40000000000000002220;
            $ec = $dz;
            label = 31;
            break;
        case 30:
            $ec = $dy;
            label = 31;
            break;
        case 31:
            $df = $k + $dh;
            $ch = $l + $dr;
            var $fe = $bn;
            var $ff = $df > $fe;
            if ($ff) {
                label = 32;
            } else {
                label = 33;
            }
            break;
        case 32:
            var $fg = $bn;
            var $fh = -1.00000000000000000000;
            var $fi = $dh * $fh;
            var $fj = $fi;
            var $fk = $fg;
            label = 34;
            break;
        case 33:
            $fj = $dh;
            $fk = $df;
            label = 34;
            break;
        case 34:
            var $fl = 0.00000000000000000000;
            var $fm = $fk < $fl;
            if ($fm) {
                label = 35;
            } else {
                label = 36;
            }
            break;
        case 35:
            $dl = 0.00000000000000000000;
            var $fn = -1.00000000000000000000;
            var $fo = $fj * $fn;
            var $fp = $fo;
            $ds = $dl;
            label = 37;
            break;
        case 36:
            $fp = $fj;
            $ds = $fk;
            label = 37;
            break;
        case 37:
            $by.$d = $fp;
            $by.$b = $ds;
            var $fq = $bo;
            var $fr = $ch > $fq;
            if ($fr) {
                label = 38;
            } else {
                label = 39;
            }
            break;
        case 38:
            var $fs = $bo;
            var $ft = -1.00000000000000000000;
            var $fu = $dr * $ft;
            var $fv = $fu;
            var $fw = $fs;
            label = 40;
            break;
        case 39:
            $fv = $dr;
            $fw = $ch;
            label = 40;
            break;
        case 40:
            var $fx = 0.00000000000000000000;
            var $fy = $fw < $fx;
            if ($fy) {
                label = 41;
            } else {
                label = 42;
            }
            break;
        case 41:
            $dd = 0.00000000000000000000;
            var $fz = -1.00000000000000000000;
            var $ga = $fv * $fz;
            var $gb = $ga;
            $dg = $dd;
            label = 43;
            break;
        case 42:
            $gb = $fv;
            $dg = $fw;
            label = 43;
            break;
        case 43:
            $by.$e = $gb;
            $by.$c = $dg;
            var $gc = $by.$a;
            $bp.setFillStyle($gc);
            $bp.beginPath();
            var $gd = 0.00000000000000000000;
            var $ge = 6.28318530717958623200;
            var $gf = true;
            $bp.arc($ds, $dg, $ec, $gd, $ge, $gf);
            $bp.closePath();
            $bp.fill();
            label = 3;
            break;
        }
    }
};

function d() {
    var $a = 0;
    var $b = new js.jquery.JQuery();
    var $c = new konoha.String("#back");
    var $d = $b._new($c);
    var $e = new konoha.String("top");
    var $f = new konoha.OutputStream(true);
    $f.send($a);
    var $g = new konoha.String("px");
    $f.send($g);
    var $h = $f.tostr();
    var $i = $d.css($e, $h);
    var $j = new js.jquery.JQuery();
    var $k = new konoha.String(".mini");
    var $l = $j._new($k);
    var $m = new konoha.Method(js.dom.Element.click1);
    $l.click($m);
    var $n = new js.jquery.JQuery();
    var $o = new konoha.String("#close");
    var $p = $n._new($o);
    var $q = new konoha.Method(js.dom.Element.click2);
    $p.click($q);
    var $r = new js.jquery.JQuery();
    var $s = new konoha.String("#demo1");
    var $t = $r._new($s);
    var $u = new konoha.Method(js.dom.Element.click4);
    $t.click($u);
    var $v = new js.jquery.JQuery();
    var $w = new konoha.String("#demo2");
    var $x = $v._new($w);
    var $y = new konoha.Method(js.dom.Element.click5);
    $x.click($y);
    var $z = new js.jquery.JQuery();
    var $ba = new konoha.String("#demo3");
    var $bb = $z._new($ba);
    var $bc = new konoha.Method(js.dom.Element.click3);
    $bb.click($bc);
    return;
}

function Script() {
}

function konoha_main() {
    script = new Script();
    _a(script);
    _b(script);
    _c(script);
    _d(script);
    _e(script);
    _f(script);
    _g(script);
    d(script);
}


