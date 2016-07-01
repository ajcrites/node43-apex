
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
export default lambda_main(e => 'Hello World')
```

## Installation

Add the following to package.json
```
"apex_sentry.js": "github:biainc/exceptional_apex.js"
```

## Sentry use

You must have SENTRY_DSN and BUILD_VER defined in the environment, then any exception caught will be reported to your
Sentry account

## Features

- return promises
- return results
- actually report uncaught errors (Lambda does not)

## Example

The following example fetches some urls and reports the response status of each. The context is also passed, but is not
shown here.

```js
import axios from 'axios'
import 'babel-polyfill'
var lambda_main = require('exceptional_apex.js').lambda_main


export default lambda(event => {
  console.log('fetching %d urls', event.urls.length)
  return Promise.all(event.urls.map(async (url) => {
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

## Contributing

Because NPM doesn't run prepublish a part of git dependencies (https://github.com/npm/npm/issues/3055), before committing, you should run:

```
npm run build
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
