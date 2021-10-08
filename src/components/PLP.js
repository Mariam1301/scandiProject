import React, { Component } from 'react';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { connect } from 'react-redux';
import CART from '../images/add-cart.svg';
import {
	incrementAction,
	createAttributeAction,
	openCartAction,
} from '../redux/actions/actions';
import '../styles/header.css';
import { NavLink } from 'react-router-dom';

const PRODUCT = gql`
	{
		categories {
			name
			products {
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
		let products = this.props.data.categories.map((item) =>
			item.products.filter((product) => product.id === e.target.id)
		);
		let [[product]] = products.filter((i) => i.length !== 0);

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

	getProducts = () => {
		let data = this.props.data;
		if (data.loading) {
			return 'loading...';
		} else {
			let path = window.location.href.substring(
				window.location.href.lastIndexOf('/') + 1
			);

			if (path === '') {
				return data.categories.map((i) =>
					i.products.map((product, index) => (
						<div
							className={product.inStock ? 'product-wrapper' : 'unavailable'}
						>
							<NavLink
								className='product-navlink'
								to={`/id/${product.id}`}
								key={'product-navlink' + index}
							>
								<img
									alt='plp product'
									src={product.gallery[0]}
									width='338px'
									height='356px'
								></img>
							</NavLink>
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
					))
				);
			} else {
				let filtered = data.categories.filter((item) => item.name === path);
				return filtered[0]['products'].map((prod, index) => (
					<div
						className={prod.inStock ? 'product-wrapper' : 'unavailable'}
						key={'product-wrapper' + index}
					>
						<NavLink
							className='product-navlink'
							to={prod.inStock ? `/id/${prod.id}` : `/category/${path}`}
							activeClassName=''
						>
							<img
								src={prod.gallery[0]}
								width='330px'
								height='306px'
								alt='plp main product'
							></img>
						</NavLink>
						<p className='out-of-stock'>
							{!prod.inStock ? 'OUT OF STOCK' : ''}
						</p>
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
			}
		}
	};

	render() {
		return (
			<div className='plp-wrapper'>
				<h1>
					{window.location.href.substring(
						window.location.href.lastIndexOf('/') + 1
					)}
				</h1>

				<div className='plp-div'>{this.getProducts()}</div>
				{this.props.cartIsOpen ? (
					<div
						onClick={() => this.props.openCart(false)}
						style={{
							width: '100%',
							height: document.documentElement.offsetHeight,
							background: 'black',
							opacity: 0.5,
							position: 'absolute',
							top: '79px',
							left: 0,
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
	};
};

export default graphql(PRODUCT)(
	connect(mapStateToProps, mapDispatchToProps)(PLP)
);
