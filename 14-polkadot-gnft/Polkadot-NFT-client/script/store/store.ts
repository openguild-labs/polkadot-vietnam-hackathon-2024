import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk'
import rootReducer from "../reducer/reducers";

const middleware = [ thunk ]
const myStore = createStore(
    rootReducer,
//    applyMiddleware(...middleware)
)

export default myStore