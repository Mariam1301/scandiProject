import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import '../styles/header.css';
import LOGO from '../images/scandi-logo.svg';
import dropDown from '../images/scandi-dropdown-arrow.svg';
import emptyCart from '../images/Empty Cart.svg';
import arrowUp from '../images/arrow-up.svg';
import {
	incrementAction,
	decrementAction,
	changeCurrencyAction,
	decrementQuantityAction,
	openCartAction,
	incrementQuantityAction,
	deleteItemAction,
	currencyOpenAction,
} from '../redux/actions/actions';
import { setCategoryAction } from '../redux/actions/actions';
import header from '../styles/header.css';
const CATEGORY = gql`
	query getCategory($title: String!) {
		categories {
			name
		}
		currencies
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
					type
					items {
						displayValue
						value
					}
				}
			}
		}
	}
`;

export class Header extends Component {
	constructor(props) {
		super(props);
		this.getCategory = this.getCategory.bind(this);
		this.state = {
			cartIsOpen: false,
			currencies: {
				USD: '$',
				GBP: '£',
				AUD: 'A$',
				JPY: '¥',
				RUB: '₽',
			},
		};
		this.openCurrency = this.openCurrency.bind(this);
	}
	updateCurrency = (e) => {
		this.props.changeCurrency(e.target.id);
		this.props.handleCurrency(false);
	};
	updateCategory = (e) => {
		this.props.setCategory(e.target.id);
		this.props.openCart(false);
	};

	getCategory() {
		let data = this.props.data;
		if (data.loading) {
			return '';
		} else {
			return data.categories.map((item, index) => {
				return (
					<NavLink
						key={item.name + index}
						id={item.name}
						onClick={this.updateCategory}
						to={`/category/${item.name}`}
					>
						{item.name}
					</NavLink>
				);
			});
		}
	}

	getCurrency() {
		let data = this.props.data;
		if (data.loading) {
			return 'LOADING...';
		} else {
			return data.currencies.map((item, index) => {
				return (
					<li onClick={this.updateCurrency} id={item} key={item + index}>
						{this.state.currencies[item] + ' ' + item}
					</li>
				);
			});
		}
	}
	openCart = () => {
		this.props.handleCurrency(false);
		this.props.openCart(!this.props.cartIsOpen);
	};

	openCurrency() {
		this.props.handleCurrency(!this.props.currencyIsOpen);
		this.props.openCart(false);
	}

	incrementQuantity = (e) => {
		let attributes = this.props.attributes;
		let id = e.target.id;
		this.props.incrementQuantity(id, attributes);
		this.props.incrementQuantityLogo();
	};

	decrementQuantity = (e) => {
		let attributes = this.props.attributes;
		let id = e.target.id;
		if (
			this.props.attributes[id] !== 0 &&
			this.props.attributes[id].quantity <= 1
		) {
			this.props.deleteItem(id, attributes);
			this.props.decrementQuantityLogo();
		} else {
			this.props.decrementQuantity(id, attributes);
			this.props.decrementQuantityLogo();
		}
	};

	getTotalPrice = () => {
		let arrOfPrices = Object.keys(this.props.attributes).map(
			(i) =>
				this.props.attributes[i].price
					.filter((k) => k.currency === this.props.activeCurrency)
					.map((p) => p.amount)[0] * this.props.attributes[i].quantity
		);

		let totalPrice = 0;
		arrOfPrices.map((item) => (totalPrice += item));
		return (
			<p>
				{this.state.currencies[this.props.activeCurrency]}
				{Math.round((totalPrice + Number.EPSILON) * 100) / 100}
			</p>
		);
	};
	getAttributes = (cartProduct, id) => {
		return cartProduct.attributes.map((att, index) => (
			<form key={'header-form' + index}>
				<div>
					<p>{att.name}</p>
					<div className='cart-attributes-div'>
						{att.items.map((item, index) => (
							<div
								key={
									att.type === 'swatch'
										? 'cart-color-attributes' + index
										: 'cart-attributes' + index
								}
								className={
									att.type === 'swatch'
										? 'cart-color-attributes'
										: 'cart-attributes'
								}
							>
								<input
									defaultChecked={
										this.props.attributes[id][att.name] === item.value
									}
									type='radio'
									name={att.name}
									id={item.value}
									value={item.value}
									disabled
								></input>
								{att.type === 'swatch' ? (
									<label
										htmlFor={item.value}
										style={{
											background: item.value,
											color: item.value,
										}}
									></label>
								) : (
									<label htmlFor={item.value}>{item.value}</label>
								)}
							</div>
						))}
					</div>
				</div>
			</form>
		));
	};
	createCart = (id, index) => {
		let data = this.props.data;
		if (data.loading) {
			return 'Loading ...';
		} else {
			let cartProduct = data.category.products.find(
				(product) => product.id === id.substring(id.lastIndexOf('/') + 2)
			);

			return (
				<div className='cart-nav-wrapper' key={'cart-nav-wrapper' + index}>
					<div className='about-product-in-nav'>
						<h3>{cartProduct.brand}</h3>
						<h3>{cartProduct.name}</h3>
						<p className='price'>
							{this.state.currencies[this.props.activeCurrency]}
							{
								cartProduct.prices.filter(
									(price) => price.currency === this.props.activeCurrency
								)[0].amount
							}
						</p>
						<div>
							{cartProduct.attributes.length !== 0
								? this.getAttributes(cartProduct, id)
								: ''}
						</div>
					</div>
					<div className='cart-quantity-and-img'>
						<div className='cart-nav-quantity'>
							<button
								onClick={this.incrementQuantity}
								id={id}
								className={this.props.attributes[id].quantity}
							>
								+
							</button>
							<p>{this.props.attributes[id].quantity}</p>
							<button
								onClick={this.decrementQuantity}
								id={id}
								className={this.props.attributes[id].quantity}
							>
								-
							</button>
						</div>
						<Link
							className='nav-cart-pic-link'
							to={`/id/${id.substring(id.lastIndexOf('/') + 2)}`}
							onClick={() => this.props.openCart(false)}
						>
							<img alt='product in cart' src={cartProduct.gallery[0]}></img>
						</Link>
					</div>
				</div>
			);
		}
	};

	render() {
		return (
			<div>
				<div
					onClick={
						this.props.cartIsOpen
							? () => this.props.openCart(false)
							: this.props.currencyIsOpen
							? () => this.props.handleCurrency(false)
							: () => {}
					}
					className='nav-container'
				>
					<div className='nav-buttons'>{this.getCategory()}</div>
					<Link to='/'>
						<img className='logo' src={LOGO} alt='logo'></img>
					</Link>
					<div className='currency-cart'>
						<div className='nav-currency'>
							<button onClick={this.openCurrency}>
								{this.state.currencies[this.props.activeCurrency]}{' '}
								<img
									src={this.props.currencyIsOpen ? arrowUp : dropDown}
									alt='dropdown'
								></img>
							</button>

							{this.props.currencyIsOpen ? (
								<div className='currency-div'>{this.getCurrency()}</div>
							) : (
								''
							)}
						</div>
						<div className='cart-div'>
							{this.props.numberofItems > 0 ? (
								<div className='number-of-items'>
									{this.props.numberofItems}
								</div>
							) : (
								''
							)}

							<img onClick={this.openCart} src={emptyCart} alt='cart'></img>
						</div>
					</div>
				</div>
				{this.props.cartIsOpen ? (
					<div className='cart-in-nav'>
						<div className='my-bag'>
							<span>My Bag,</span> {this.props.numberofItems} items
						</div>
						<div>
							{Object.keys(this.props.attributes).map((item, index) => {
								return this.createCart(item, index);
							})}
						</div>
						<div className='total-price'>
							<p>Total</p>
							{this.getTotalPrice()}
						</div>

						<div className='nav-cart-buttons'>
							<Link to={`/cart`} onClick={() => this.props.openCart(false)}>
								<button>VIEW BAG</button>
							</Link>
							<button id='nav-cart-checkOut'>CHECK OUT</button>
						</div>
					</div>
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
		itemList: state.addItem.cartProducts,
		attributes: state.addAttributes.attributes,
		cartIsOpen: state.openCart.cartIsOpen,
		currencyIsOpen: state.currencyIsOpen.currencyIsOpen,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		changeCurrency: (id) => {
			dispatch(changeCurrencyAction(id));
		},
		setCategory: (category) => {
			dispatch(setCategoryAction(category));
		},

		openCart: (value) => {
			dispatch(openCartAction(value));
		},
		incrementQuantity: (id, attributes) => {
			dispatch(incrementQuantityAction(id, attributes));
		},

		decrementQuantity: (id, attributes) => {
			dispatch(decrementQuantityAction(id, attributes));
		},
		incrementQuantityLogo: () => {
			dispatch(incrementAction());
		},
		decrementQuantityLogo: () => {
			dispatch(decrementAction());
		},
		deleteItem: (id, attributes) => {
			dispatch(deleteItemAction(id, attributes));
		},
		handleCurrency: (value) => {
			dispatch(currencyOpenAction(value));
		},
	};
};

export default graphql(CATEGORY, {
	options: (props) => ({
		variables: {
			title: '',
		},
	}),
})(connect(mapStateToProps, mapDispatchToProps)(Header));
