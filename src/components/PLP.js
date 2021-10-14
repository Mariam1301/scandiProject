import React, { Component } from 'react';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { connect } from 'react-redux';
import CART from '../images/add-cart.svg';
import {
	incrementAction,
	createAttributeAction,
	openCartAction,
	currencyOpenAction,
} from '../redux/actions/actions';
import '../styles/header.css';
import { NavLink } from 'react-router-dom';
import plp from '../styles/plp.css';

const PRODUCT = gql`
	query getCategory($title: String!) {
		category(input: { title: $title }) {
			name
			products {
				name
				category
				id
				name
				brand
				gallery
				inStock
				prices {
					currency
					amount
				}
				attributes {
					id
					name
					items {
						displayValue
						value
					}
				}
			}
		}
	}
`;

export class PLP extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currencies: {
				USD: '$',
				GBP: '£',
				AUD: 'A$',
				JPY: '¥',
				RUB: '₽',
			},
		};
	}
	close = () => {
		this.props.openCart(false);
		this.props.handleCurrency(false);
	};
	getPrice = (product) => {
		let filteredPrice = product.prices.filter(
			(item) => item.currency === this.props.activeCurrency
		);
		return (
			<p className='prod-list-price'>
				{this.state.currencies[filteredPrice[0].currency]}
				{filteredPrice[0].amount}
			</p>
		);
	};
	addItemToCart = (e) => {
		let product = this.props.data.category.products.filter(
			(product) => product.id === e.target.id
		)[0];

		let price = product.prices;

		let attributes = { price: price, quantity: 1 };
		product.attributes.map((at) => {
			return (attributes = { ...attributes, [at.name]: at.items[0].value });
		});
		let arrOfName = Object.keys(this.props.attributes);

		if (
			arrOfName.find(
				(element) =>
					element ===
					`${Object.keys(attributes)
						.slice(2)
						.map((it) => attributes[it])
						.join('')} / ${e.target.id}`
			)
		) {
			this.props.addAttributes(e, {
				...attributes,
				quantity:
					this.props.attributes[
						`${Object.keys(attributes)
							.slice(2)
							.map((it) => attributes[it])
							.join('')} / ${e.target.id}`
					].quantity + 1,
			});
		} else {
			this.props.addAttributes(e, attributes);
		}
		this.props.incrementQuantity();
	};

	productsForStartPage = () => {
		let data = this.props.data;
		return data.category.products.map((product, index) => (
			<div
				className={product.inStock ? 'product-wrapper' : 'unavailable'}
				key={
					product.inStock ? 'product-wrapper' + index : 'unavailable' + index
				}
			>
				<NavLink
					className='product-navlink'
					to={`/id/${product.id}`}
					key={'product-navlink' + index}
				>
					<img alt='plp product' src={product.gallery[0]}></img>
				</NavLink>
				<p className='out-of-stock'>{!product.inStock ? 'OUT OF STOCK' : ''}</p>
				<p>
					{product.brand} {product.name}
				</p>

				{this.getPrice(product)}

				<img
					alt='to add to cart from plp'
					id={product.id}
					className='add-cart-btn'
					src={CART}
					width='46px'
					onClick={this.addItemToCart}
				></img>
			</div>
		));
	};
	productsForCategoryPage = () => {
		let data = this.props.data;
		return data.category.products.map((prod, index) => (
			<div
				className={prod.inStock ? 'product-wrapper' : 'unavailable'}
				key={'product-wrapper' + index}
			>
				<NavLink
					className='product-navlink'
					to={`/id/${prod.id}`}
					activeClassName=''
				>
					<img src={prod.gallery[0]} alt='plp main product'></img>
				</NavLink>

				<p className='out-of-stock'>{!prod.inStock ? 'OUT OF STOCK' : ''}</p>
				<p>
					{prod.brand} {prod.name}
				</p>

				<img
					alt='add to cart button'
					id={prod.id}
					className='add-cart-btn'
					src={CART}
					width='46px'
					onClick={this.addItemToCart}
				></img>

				{this.getPrice(prod)}
			</div>
		));
	};

	getProducts = () => {
		let data = this.props.data;
		if (data.loading) {
			return 'loading...';
		} else {
			let path = window.location.href.substring(
				window.location.href.lastIndexOf('/') + 1
			);

			if (path === '') {
				return this.productsForStartPage();
			} else {
				return this.productsForCategoryPage();
			}
		}
	};

	render() {
		return (
			<div
				className='plp-wrapper'
				onClick={
					this.props.currencyIsOpen
						? () => this.props.handleCurrency(false)
						: () => {}
				}
			>
				<h1>
					{window.location.href.substring(
						window.location.href.lastIndexOf('/') + 1
					)}
				</h1>

				<div className='plp-div'>{this.getProducts()}</div>
				{this.props.cartIsOpen ? (
					<div
						className='cart-backdrop'
						onClick={this.close}
						style={{
							height: document.documentElement.offsetHeight,
						}}
					></div>
				) : (
					''
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		activeCurrency: state.changeCurrency.currency,
		numberofItems: state.changeQuantity.cartQuantity,
		cartIsOpen: state.openCart.cartIsOpen,
		attributes: state.addAttributes.attributes,
		currencyIsOpen: state.currencyIsOpen.currencyIsOpen,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		incrementQuantity: () => {
			dispatch(incrementAction());
		},
		addAttributes: (element, attributes, count) => {
			dispatch(createAttributeAction(element, attributes, count));
		},
		openCart: (value) => {
			dispatch(openCartAction(value));
		},
		handleCurrency: (value) => {
			dispatch(currencyOpenAction(value));
		},
	};
};

export default graphql(PRODUCT, {
	options: (props) => ({
		variables: {
			title: window.location.href.substring(
				window.location.href.lastIndexOf('/') + 1
			),
		},
	}),
})(connect(mapStateToProps, mapDispatchToProps)(PLP));
