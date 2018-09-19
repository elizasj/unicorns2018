---
date: '2018-03-15T00:00:00Z'
tags: ['api', 'data', 'webdev101']
title: 'CORS'
category: 'webdev101'
---

**CORS** stands for **C**ross **O**rigin **R**equest **S**haring - it's a <a href="https://www.w3.org/TR/cors/" target="_blank">w3c standard</a> that gives access to resources across web domains. So basically if you've ever made an API call, you've likely encountered **CORS**.

**CORS** exists because of the <a href="https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy" target="_blank">same-origin-policy</a> - a rule that states that HTTP requests made from one domain can only access endpoints on that same domain.

When using `fetch()` or axios, or whatever your prefered API requesting habits may have you reaching for, (though `fetch()` is suppose to be the standard accross all browsers ~~soon~~ one day...) to access a URL that has a different origin than where you're requesting from, **CORS** needs to be explicitly enabled on the “different origin” side of things, aka the place you're making a request _to_ (an API).

In the scenario where your application is running on `http://localhost:3000` and you're fetching data from an api with an endpoint that doesn't include

```javascript
“Access-Control-Allow-Origin = http://localhost:3000”
```

in the header that it sends back, you'll end up getting a really annoying **CORS** error.

This happens because the request you’re making is coming from the browser and not from a server. Any "public" APIs that don’t support **CORS** won’t work with `fetch()` or `XMLHttpRequest()` requests.

I put _public_ in quotes up there because if they aren't supporting **CORS**, technically they aren't public API's and really shouldn't be branding themselves as such...

There are actually a surprising amount of web sites with such _not-so-public_ API's, which use the default **CORS** security setting. The default doesn't set `Access-Control-Allow-Origin` and thus blocks access to the API, which means we can only access their API from the command line or from the server, but not from the browser.

Not ideal.

Of course, if the API is your own you can go ahead and set the proper **CORS** response on the server that you’re making the call to. Express has a really easy to implement <a href="https://www.npmjs.com/package/cors" target="_blank">**CORS** package</a>, for example.

## Solution

Otherwise, for when you're dealing with an API that you have no jurisdiction over there exists a bit of a hacky work-around to get you past that pesky **CORS** error.

Assuming that the API in question allows access from 3rd-party apps, that you're not missing a token in your request, and that the API isn't restricted to server-side applications only, **you can write a proxy that will act as a go-between for the browser and the API**.

The proxy doesn't have to be on the same domain as your site/app/whatever, as long as the proxy itself properly supports **CORS** when communicating with the client.

You can either write your own, or use a ready made proxy like the very handy <a href="https://www.npmjs.com/package/cors-anywhere" target="_blank">cors-anywhere</a>, implimented like so:

```javascript
var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
  targetUrl = 'http://catfacts-api.appspot.com/api/facts?number=99'

fetch(proxyUrl + targetUrl)
  .then(blob => blob.json())
  .then(data => {
    console.table(data)
    document.querySelector('pre').innerHTML = JSON.stringify(data, null, 2)
    return data
  })
  .catch(e => {
    console.log(e)
    return e
  })
```
