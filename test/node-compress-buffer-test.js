/* node-compress-buffer (C) 2011 Egor Egorov <me@egorfine.com>  */

require.paths.unshift('../lib');
sys = require('sys');
fs = require('fs');
crypto=require('crypto');
compress = require('compress-buffer').compress;
uncompress = require('compress-buffer').uncompress;

function md5(data) {
	var md5=crypto.createHash('md5');
	md5.update(data);
	return md5.digest('hex');
}

var loremIpsum="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

exports['basic compress']= function(test) {
	test.expect(2);
	var uncompressed = new Buffer(loremIpsum);
	var compressed = compress(uncompressed);
	test.equal(compressed.length,265);
	test.equal(md5(compressed), "8415ce600fe321d94af65257abc6a9f8");
	test.done();
}

exports['basic uncompress']= function(test) {
	test.expect(2);
	var uncompressed = new Buffer(loremIpsum);
	var compressed = compress(uncompressed);
	uncompressed = uncompress(compressed, uncompressed.length);
	test.equal(uncompressed.length,loremIpsum.length);
	test.equal(md5(uncompressed), "fa5c89f3c88b81bfd5e821b0316569af");
	test.done();
}

exports['compress with compression levels']= function(test) {
	test.expect(1);
	var uncompressedBuffer = fs.readFileSync("node-compress-buffer-test.js");
	
	var compressed1 = compress(uncompressedBuffer, 1);
	var compressed9 = compress(uncompressedBuffer, 9);
	test.ok(compressed1.length>compressed9.length);

	test.done();
}

exports['compress string']= function(test) {
	test.expect(2);
	var buffer = new Buffer(loremIpsum);
	var compressed1 = compress(buffer);
	var compressed2 = compress(loremIpsum);
	test.equal(compressed1.length,compressed2.length);
	test.equal(md5(compressed1), md5(compressed2));
	test.done();
}

exports['compress short']= function(test) {
	test.expect(2);
	var buffer = new Buffer("too short");
	var compressed;
  try { compressed = compress(buffer); }
  catch(e) { test.ok(e); }
	test.ok(compressed == null);
	test.done();
}

exports['errors']= function(test) {
	test.expect(4);
	var uncompressed, compressed;
  try { compressed = compress(""); }
  catch(e) { test.ok(e); }
  test.ok(compressed == null);
	
	try {
		uncompressed = uncompress(" sfsdcfgdfgsdgfdsgdgdsgdfgsdfgsdfgdfgfsfd ", 1000);
	}
  catch(e) { test.ok(e); }
	test.ok(!uncompressed);
	
	test.done();
}
