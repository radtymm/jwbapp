import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import rootReducer from './reducer/reducers';
import thunk from 'redux-thunk';

const configureStore = preloadedState => {
    return createStore (
        rootReducer,
        preloadedState,
        compose (
            applyMiddleware(thunk, createLogger())
        )
    );
}

const store = configureStore();

export default store;
