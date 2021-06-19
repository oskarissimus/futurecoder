import {createStore, applyMiddleware, compose, combineReducers} from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import {connect} from "react-redux";
import {
  TextContainer,
  redact,
  dispatcher
} from "./frontendlib";
import {bookReducer, navigate} from "./book/store";

import createSentryMiddleware from "redux-sentry-middleware";
import * as Sentry from "@sentry/browser";

const sentryDsn = process.env.REACT_APP_SENTRY_DSN;
if (sentryDsn) {
  console.log('Configuring sentry');
  Sentry.init({dsn: sentryDsn});
}

const {delegateReducer, stateSet} = redact("root");

TextContainer.connect = connect;

const reducer = delegateReducer(
  combineReducers({
    book: bookReducer,
  })
);

// noinspection JSUnresolvedVariable
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(
    thunk,
    logger,
    createSentryMiddleware(Sentry),
  ))
);

dispatcher.store = store;
redact.store = store;
window.reduxStore = store;

navigate();
