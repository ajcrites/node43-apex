**NOTE: THIS REPO IS NOT MAINTAINED**
The [original apex.js package](https://npmjs.com/package/apex.js)
supports Node 4.3 in version 2.

You don't need to use this repository.

# Apex Node.js (For AWS Lambda node 4.3)

This is a separate version of [node-apex](https://github.com/apex/node-apex)
designed specifically for the AWS Lambda nodejs4.3
runtime which [recommends using the `callback` parameter
to complete functions](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-using-old-runtime.html#transition-to-new-nodejs-runtime)

This can be used in an identical fashion as apex.js for
the node 0.10 runtime; it's just designed specifically for
the new runtime.

Node.js module that makes AWS Lambda's user experience a little nicer.

```js
export default λ(e => 'Hello World')
```

## Installation

```
$ npm install --save node43apex.js
```

## Features

- return promises
- return results
- actually report uncaught errors (Lambda does not)

## Example

The following example fetches some urls and reports the response status of each. The context is also passed, but is not
shown here.

```js
import axios from 'axios'
import λ from 'apex.js'
import 'babel-polyfill'

export default λ(e => {
  console.log('fetching %d urls', e.urls.length)
  return Promise.all(e.urls.map(async (url) => {
    console.log('fetching %s', url)
    return {
      status: (await axios.get(url)).status,
      url
    }
  }))
})
```

Without this module it looks something like the following, as Lambda does not try/catch, and the Context
provided has awkward method names that are not idiomatic.

```js
import axios from 'axios'
import 'babel-polyfill'

// Vanilla Lambda function.
export default async (e, ctx) => {
  console.log('fetching %d urls', e.urls.length)

  try {
    const res = await Promise.all(e.urls.map(async (url) => {
      console.log('fetching %s', url)
      return {
        status: (await axios.get(url)).status,
        url
      }
    }))

    ctx.succeed(res)
  } catch (err) {
    ctx.fail(err)
  }
}
```

## Contributors

- [TJ Holowaychuk](https://github.com/tj)
- [Andrew Crites](https://github.com/ajcrites)

## Badges

![](https://img.shields.io/badge/license-MIT-blue.svg)
![](https://img.shields.io/badge/status-stable-green.svg)

---

> [tjholowaychuk.com](http://tjholowaychuk.com) &nbsp;&middot;&nbsp;
> GitHub [@tj](https://github.com/tj) &nbsp;&middot;&nbsp;
> GitHub [@ajcrites](https://github.com/ajcrites) &nbsp;&middot;&nbsp;
> Twitter [@tjholowaychuk](https://twitter.com/tjholowaychuk)
> Twitter [@ExplosionPills](https://twitter.com/ExplosionPills)
