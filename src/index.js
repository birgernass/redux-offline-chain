export default ({ dispatch, getState }) => next => action => {
  if (action.meta && typeof action.meta.then === 'function') {
    const invoked = action.meta.then(action.payload)
    typeof invoked === 'function'
      ? invoked(dispatch, getState)
      : dispatch(invoked)
  }
  return next(action)
}
