# Example for a bug in NodeJS module Request

When trying to access an URL using GET method and adding a Query by 'qs' function AND using a Proxy configured with 'http_proxy', the request will be configured without protocol or host.

Given the NodeJS app as published, running `http_proxy=http://localhost:3128 node index.js` will give me the content of error.page.html.

<div>
<p>The following error was encountered while trying to retrieve the URL: <a href="/?format=json">/?format=json</a></p>
<blockquote>
<p><b>Invalid URL</b></p>
</blockquote>
</div>
