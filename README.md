# redux-offline-chain

A [redux-middleware](http://redux.js.org/docs/advanced/Middleware.html) for
[redux-offline](https://github.com/jevakallio/redux-offline), inspired by
[redux-thunk](https://github.com/gaearon/redux-thunk).

redux-offline-chain allows you to chain offline actions. It looks for
action.meta.then functions and invokes them in a redux-thunk like manner. The
then callback gets the payload from the effect reconciler and optionally redux's
dispatch and getState functions.

**Caveat: Please note that the functions cannot be persisted and therefore only
work within the same session.**

## Installation

```bash
$ npm install --save redux-offline-chain
```

```js
import { applyMiddleware, compose, createStore, Store } from 'redux'
import { offline } from 'redux-offline'
import offlineConfig from 'redux-offline/lib/defaults'
import offlineChain from 'redux-offline-chain'

const store = offline(offlineConfig)(createStore)(
  rootReducer,
  compose(applyMiddleware(offlineChain))
)
```

## Usage

```diff
type OfflineAction = {
  type: string,
  payload: any,
  meta: {
    offline: {
      effect: any,
      rollback: Action
      commit: {
        type: string,
        meta: {
+         then: Function,
        },
      },
    },
  }
}
```

```js
export const actionCreator = payload => ({
  type: 'SOME_ACTION,'
  payload,
  meta: {
    offline: {
      effect: { path: '/some/endpoint' },
      rollback: { type: 'SOME_ACTION_ROLLBACK' },
      commit: {
        type: 'SOME_ACTION_COMMIT',
        meta: {
          then: payload => ({
            type: 'ANOTHER_ACTION',
            payload,
            meta: {
              offline: {
                effect: { path: '/another/endpoint', method: 'POST' },
                rollback: { type: 'ANOTHER_ACTION_ROLLBACK' },
                commit: {
                  type: 'ANOTHER_ACTION_COMMIT',
                  meta: {
                    then: payload => (dispatch, getState) => {
                      // ....
                    },
                  }
                },
              },
            },
          }),
        },
      },
    },
  },
})
```
