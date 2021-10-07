import { createStore } from 'redux';
import { rootReducer } from './reducers/rootReducer';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
	key: 'root',
	storage,
	blacklist: ['openCart'],
};

const perReducer = persistReducer(persistConfig, rootReducer);

let exp = () => {
	let store = createStore(perReducer);
	let pers = persistStore(store);
	return { store, pers };
};

export default exp;
