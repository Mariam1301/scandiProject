export const CART_IS_OPEN = 'CART_IS_OPEN';
export const HANDLE_CURRENCY = 'HANDLE_CURRENCY';
export const OPEN_CURRENCY = 'OPEN_CURRENCY';
export const SET_CATEGORY = 'SET_CATEGORY';
export const CHANGE_CURRENCY = 'CHANGE_CURRENCY';
export const ADD_ITEM = 'ADD_ITEM';
export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const ADD_ATTRIBUTES = 'ADD_ATTRIBUTES';
export const OPEN_CART = 'OPEN_CART';
export const INCREMNET_QUANTITY = 'INCREMNET_QUANTITY';
export const DECREMENT_QUANTITY = 'DECREMENT_QUANTITY';
export const CHANGE_ATTRIBUTE = 'CHANGE_ATTRIBUTE';
export const DELETE_ITEM = 'DELETE_ITEM';

export const currencyOpenAction = (value) => {
	return {
		type: HANDLE_CURRENCY,
		value: value,
	};
};
export const changeCurrencyAction = (id) => {
	return {
		type: CHANGE_CURRENCY,
		id,
	};
};

export const addItemAction = (id) => {
	return {
		type: ADD_ITEM,
		id,
	};
};

export const incrementAction = () => {
	return {
		type: INCREMENT,
	};
};
export const decrementAction = () => {
	return {
		type: DECREMENT,
	};
};

export const setCategoryAction = (category) => {
	return {
		type: SET_CATEGORY,
		category,
	};
};

export const createAttributeAction = (element, attributes) => {
	return {
		type: ADD_ATTRIBUTES,
		key: [
			`${Object.keys(attributes)
				.slice(2)
				.map((it) => attributes[it])
				.join('')} / ${element.target.id}`,
		],
		name: element.target.id,
		attributes: attributes,
	};
};

export const openCartAction = (value) => {
	return {
		type: OPEN_CART,
		value,
	};
};

export const incrementQuantityAction = (id, attributes) => {
	return {
		type: INCREMNET_QUANTITY,
		id: id,
		attributes: attributes,
	};
};
export const decrementQuantityAction = (id, attributes) => {
	return {
		type: DECREMENT_QUANTITY,
		id: id,
		attributes: attributes,
	};
};

export const changeAttributeAction = (id, name, attributes, value) => {
	return {
		type: CHANGE_ATTRIBUTE,
		id: id,
		name: name,
		attributes: attributes,
		value: value,
	};
};

export const deleteItemAction = (id, attributes) => {
	return {
		type: DELETE_ITEM,
		id: id,
		attributes: attributes,
	};
};
