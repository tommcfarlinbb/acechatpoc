import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';

// let middleware = [thunk];

// if (__DEV__) {
// 	const reduxImmutableStateInvariant = require('redux-immutable-state-invariant').default();
// 	middleware = [...middleware, reduxImmutableStateInvariant, logger];
// } else {
// 	middleware = [...middleware];
// }

export default function configureStore() {
	return createStore(
		rootReducer
	//	initialState,
	//	applyMiddleware(...middleware)
	);
}