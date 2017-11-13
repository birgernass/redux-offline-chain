export default ({ dispatch, getState }) => next => action => {
  const result = next(action)
  if (action.meta && typeof action.meta.then === 'function') {
    const invoked = action.meta.then(action.payload)
    if (typeof invoked === 'function') {
      invoked(dispatch, getState)
    } else {
      dispatch(invoked)
    }
  }
  return result
}
