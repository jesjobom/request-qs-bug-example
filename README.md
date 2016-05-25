# Example for a bug in NodeJS module Request

[Request Issue #2223](https://github.com/request/request/issues/2223)

When trying to access an URL using GET method and adding a Query by *qs* function AND using a Proxy configured with *http_proxy*, the request will be configured without protocol or host.

Given the NodeJS app as published, running `http_proxy=http://localhost:3128 node index.js` will give me the content of [error.page.html](error.page.html):

>  <div>
>  <p>The following error was encountered while trying to retrieve the URL: <a href="/?format=json">/?format=json</a></p>
>  <blockquote>
>  <p><b>Invalid URL</b></p>
>  </blockquote>
>  </div>

Notice that I am using Squid as a local proxy runing at *localhost:3128*.

Running `http_proxy='' node index.js` will work:

```json
{"ip":"172.0.0.1"}
```

I was able to correct this behavior by modifying the `request.js` from Request Module.

```diff
diff --git a/original/node_modules/request/request.js b/modified/node_modules/request/request.js
index 124157e..e7eef40 100644
--- a/original/node_modules/request/request.js
+++ b/modified/node_modules/request/request.js
@@ -1142,7 +1142,7 @@ Request.prototype.qs = function (q, clobber) {

   self.uri = url.parse(self.uri.href.split('?')[0] + '?' + qs)
   self.url = self.uri
-  self.path = self.uri.path
+  self.path = self.uri.href

   if (self.uri.host === 'unix') {
     self.enableUnixSocket()
```

## request-debug

```
$ http_proxy=http://localhost:3128 node index-debug.js
```

```
{ request:
   { debugId: 1,
     uri: 'http://api.ipify.org/?format=json',
     method: 'GET',
     headers: { host: 'api.ipify.org' } } }

{ response:
   { debugId: 1,
     headers:
      { server: 'squid/3.3.8',
        'mime-version': '1.0',
        date: 'Wed, 25 May 2016 17:06:02 GMT',
        'content-type': 'text/html',
        'content-length': '3177',
        'x-squid-error': 'ERR_INVALID_URL 0',
        vary: 'Accept-Language',
        'content-language': 'en',
        'x-cache': 'MISS from jesjobom-note',
        'x-cache-lookup': 'NONE from jesjobom-note:3128',
        via: '1.1 jesjobom-note (squid/3.3.8)',
        connection: 'close' },
     statusCode: 400,
     body: '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">\n<html><head>\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n<title>ERROR: The requested URL could not be retrieved</title>\n<style type="text/css"><!-- \n /*\n Stylesheet for Squid Error pages\n Adapted from design by Free CSS Templates\n http://www.freecsstemplates.org\n Released for free under a Creative Commons Attribution 2.5 License\n*/\n\n/* Page basics */\n* {\n\tfont-family: verdana, sans-serif;\n}\n\nhtml body {\n\tmargin: 0;\n\tpadding: 0;\n\tbackground: #efefef;\n\tfont-size: 12px;\n\tcolor: #1e1e1e;\n}\n\n/* Page displayed title area */\n#titles {\n\tmargin-left: 15px;\n\tpadding: 10px;\n\tpadding-left: 100px;\n\tbackground: url(\'http://www.squid-cache.org/Artwork/SN.png\') no-repeat left;\n}\n\n/* initial title */\n#titles h1 {\n\tcolor: #000000;\n}\n#titles h2 {\n\tcolor: #000000;\n}\n\n/* special event: FTP success page titles */\n#titles ftpsuccess {\n\tbackground-color:#00ff00;\n\twidth:100%;\n}\n\n/* Page displayed body content area */\n#content {\n\tpadding: 10px;\n\tbackground: #ffffff;\n}\n\n/* General text */\np {\n}\n\n/* error brief description */\n#error p {\n}\n\n/* some data which may have caused the problem */\n#data {\n}\n\n/* the error message received from the system or other software */\n#sysmsg {\n}\n\npre {\n    font-family:sans-serif;\n}\n\n/* special event: FTP / Gopher directory listing */\n#dirmsg {\n    font-family: courier;\n    color: black;\n    font-size: 10pt;\n}\n#dirlisting {\n    margin-left: 2%;\n    margin-right: 2%;\n}\n#dirlisting tr.entry td.icon,td.filename,td.size,td.date {\n    border-bottom: groove;\n}\n#dirlisting td.size {\n    width: 50px;\n    text-align: right;\n    padding-right: 5px;\n}\n\n/* horizontal lines */\nhr {\n\tmargin: 0;\n}\n\n/* page displayed footer area */\n#footer {\n\tfont-size: 9px;\n\tpadding-left: 10px;\n}\n\n\nbody\n:lang(fa) { direction: rtl; font-size: 100%; font-family: Tahoma, Roya, sans-serif; float: right; }\n:lang(he) { direction: rtl; }\n --></style>\n</head><body id=ERR_INVALID_URL>\n<div id="titles">\n<h1>ERROR</h1>\n<h2>The requested URL could not be retrieved</h2>\n</div>\n<hr>\n\n<div id="content">\n<p>The following error was encountered while trying to retrieve the URL: <a href="/?format=json">/?format=json</a></p>\n\n<blockquote id="error">\n<p><b>Invalid URL</b></p>\n</blockquote>\n\n<p>Some aspect of the requested URL is incorrect.</p>\n\n<p>Some possible problems are:</p>\n<ul>\n<li><p>Missing or incorrect access protocol (should be <q>http://</q> or similar)</p></li>\n<li><p>Missing hostname</p></li>\n<li><p>Illegal double-escape in the URL-Path</p></li>\n<li><p>Illegal character in hostname; underscores are not allowed.</p></li>\n</ul>\n\n<p>Your cache administrator is <a href="mailto:webmaster?subject=CacheErrorInfo%20-%20ERR_INVALID_URL&amp;body=CacheHost%3A%20jesjobom-note%0D%0AErrPage%3A%20ERR_INVALID_URL%0D%0AErr%3A%20%5Bnone%5D%0D%0ATimeStamp%3A%20Wed,%2025%20May%202016%2017%3A06%3A02%20GMT%0D%0A%0D%0AClientIP%3A%20127.0.0.1%0D%0A%0D%0AHTTP%20Request%3A%0D%0A%0D%0A%0D%0A">webmaster</a>.</p>\n<br>\n</div>\n\n<hr>\n<div id="footer">\n<p>Generated Wed, 25 May 2016 17:06:02 GMT by jesjobom-note (squid/3.3.8)</p>\n<!-- ERR_INVALID_URL -->\n</div>\n</body></html>\n' } }
```
