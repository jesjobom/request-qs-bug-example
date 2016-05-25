# Example for a bug in NodeJS module Request

When trying to access an URL using GET method and adding a Query by *qs* function AND using a Proxy configured with *http_proxy*, the request will be configured without protocol or host.

Given the NodeJS app as published, running `http_proxy=http://localhost:3128 node index.js` will give me the content of error.page.html:

  <div>
  <p>The following error was encountered while trying to retrieve the URL: <a href="/?format=json">/?format=json</a></p>
  <blockquote>
  <p><b>Invalid URL</b></p>
  </blockquote>
  </div>

Notice that I am using Squid as a local proxy runing at *localhost:3128*.

Running `http_proxy='' node index.js` will work:

```json
{"ip":"172.0.0.1"}
```

I was able to correct this behavior by modifying the `request.js` from Request Module.

```diff
diff --git a/node_modules/request/request.js b/../project/node_modules/request/request.js
index 124157e..e7eef40 100644
--- a/node_modules/request/request.js
+++ b/../project/node_modules/request/request.js
@@ -1142,7 +1142,7 @@ Request.prototype.qs = function (q, clobber) {

   self.uri = url.parse(self.uri.href.split('?')[0] + '?' + qs)
   self.url = self.uri
-  self.path = self.uri.path
+  self.path = self.uri.href

   if (self.uri.host === 'unix') {
     self.enableUnixSocket()
```
