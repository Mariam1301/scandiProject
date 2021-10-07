import { combineReducers } from 'redux';
import {
	SET_CATEGORY,
	ADD_ITEM,
	CHANGE_CURRENCY,
	INCREMENT,
	DECREMENT,
	ADD_ATTRIBUTES,
	OPEN_CART,
	INCREMNET_QUANTITY,
	DECREMENT_QUANTITY,
	CHANGE_ATTRIBUTE,
	DELETE_ITEM,
} from '../actions/actions';

export const initialState = {
	category: '',
	cartIsOpen: false,
	cartQuantity: 0,
	currencyOpen: true,
	currency: 'USD',
	cartProducts: [],
	attributes: {},
	cartItems: [],
};

export const changeCurrencyReducer = (state = initialState, action) => {
	switch (action.type) {
		case CHANGE_CURRENCY:
			return {
				...state,
				currency: action.id,
			};
		default:
			return state;
	}
};

export const addItemReducer = (state = initialState, action) => {
	switch (action.type) {
		case ADD_ITEM:
			return {
				...state,
				cartProducts: state.cartProducts.concat(action.id),
			};
		default:
			return state;
	}
};

export const cartQuantityReducer = (state = initialState, action) => {
	switch (action.type) {
		case INCREMENT:
			return {
				...state,
				cartQuantity: state.cartQuantity + 1,
			};
		case DECREMENT: {
			return {
				...state,
				cartQuantity: state.cartQuantity - 1,
			};
		}
		default:
			return state;
	}
};

export const setCategoryReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_CATEGORY:
			return {
				...state,
				category: action.category,
			};
		default:
			return state;
	}
};

export const addAttributesReducer = (state = initialState, action) => {
	switch (action.type) {
		case ADD_ATTRIBUTES:
			return {
				...state,
				attributes: { ...state.attributes, [action.key]: action.attributes },
			};

		case INCREMNET_QUANTITY:
			return {
				...state,
				attributes: {
					...action.attributes,
					[action.id]: {
						...action.attributes[action.id],
						quantity: action.attributes[action.id].quantity + 1,
					},
				},
			};
		case DECREMENT_QUANTITY:
			return {
				...state,
				attributes: {
					...action.attributes,
					[action.id]: {
						...action.attributes[action.id],
						quantity: action.attributes[action.id].quantity - 1,
					},
				},
			};

		case CHANGE_ATTRIBUTE:
			console.log(action);
			return {
				...state,
				attributes: {
					...action.attributes,
					[action.id]: {
						...action.attributes[action.id],
						[action.name]: action.value,
					},
				},
			};
		case DELETE_ITEM:
			delete action.attributes[action.id];
			return {
				...state,
				attributes: {
					...action.attributes,
				},
			};
		default:
			return state;
	}
};
export const openCartReducer = (state = initialState, action) => {
	switch (action.type) {
		case OPEN_CART:
			return {
				...state,
				cartIsOpen: action.value,
			};

		default:
			return state;
	}
};

export const rootReducer = combineReducers({
	changeCurrency: changeCurrencyReducer,
	addItem: addItemReducer,
	changeQuantity: cartQuantityReducer,
	setCategory: setCategoryReducer,
	addAttributes: addAttributesReducer,
	openCart: openCartReducer,
});
