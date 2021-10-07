import React, { Component } from 'react';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import {
	incrementAction,
	decrementAction,
	changeCurrencyAction,
	decrementQuantityAction,
	openCartAction,
	incrementQuantityAction,
	changeAttributeAction,
	deleteItemAction,
} from '../redux/actions/actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setCategoryAction } from '../redux/actions/actions';
import nextPic from '../images/nextPic.svg';
import prevPic from '../images/prevPic.svg';
const CATEGORY = gql`
	{
		categories {
			name
			products {
				id
				description
				category
				name
				brand
				gallery
				attributes {
					id
					name
					items {
						displayValue
						value
					}
				}
				prices {
					currency
					amount
				}
			}
		}
		currencies
	}
`;
export class Cart extends Component {
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
			picIndex: {},
		};
	}
	fillState = () => {
		let obj = {};
		Object.keys(this.props.attributes).map(
			(key) => (obj = { ...obj, [key]: 0 })
		);
		this.setState({
			picIndex: obj,
		});
	};
	componentDidMount() {
		this.fillState();
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
	changeAttribute = (id, name, value) => {
		let attributes = this.props.attributes;
		this.props.changeAttribute(id, name, attributes, value);
	};
	prevPic = (e) => {
		if (this.state.picIndex[e.target.id] > 0) {
			this.setState({
				picIndex: {
					...this.state.picIndex,
					[e.target.id]: this.state.picIndex[e.target.id] - 1,
				},
			});
		}
	};

	nextPic = (e) => {
		let cartProducts = this.props.data.categories.map((item) =>
			item.products.filter(
				(product) =>
					product.id === e.target.id.substring(e.target.id.lastIndexOf('/') + 2)
			)
		);
		let [[cartProduct]] = cartProducts.filter((i) => i.length !== 0);

		if (this.state.picIndex[e.target.id] < cartProduct.gallery.length - 1) {
			this.setState({
				picIndex: {
					...this.state.picIndex,
					[e.target.id]: this.state.picIndex[e.target.id] + 1,
				},
			});
		}
	};
	getProducts = (id, index) => {
		let data = this.props.data;
		if (data.loading) {
			return 'Loading ...';
		} else {
			let cartProducts = data.categories.map((item) =>
				item.products.filter(
					(product) => product.id === id.substring(id.lastIndexOf('/') + 2)
				)
			);
			let [[cartProduct]] = cartProducts.filter((i) => i.length !== 0);

			return (
				<div
					className='cart-product-wrapper'
					key={'cart-product-wrapper' + index}
				>
					<div className='cart-wrapper'>
						<div>
							<h3>{cartProduct.brand}</h3>
							<h3>{cartProduct.name}</h3>
							<p className='cart-price'>
								{this.state.currencies[this.props.activeCurrency]}
								{
									cartProduct.prices.filter(
										(price) => price.currency === this.props.activeCurrency
									)[0].amount
								}
							</p>
							<div>
								{cartProduct.attributes.length !== 0
									? cartProduct.attributes.map((att, index) => (
											<form key={'cart-form' + index}>
												{att.name === 'Color' ? (
													<div>
														<p>{att.name}</p>

														<div className='cart-cont-attributes-div'>
															{att.items.map((item, index) => (
																<div
																	key={'cart-cont-color-attributes' + index}
																	className='cart-cont-color-attributes'
																	onClick={() =>
																		this.changeAttribute(
																			id,
																			att.name,
																			item.value
																		)
																	}
																>
																	<input
																		defaultChecked={
																			this.props.attributes[id][att.name] ===
																			item.value
																		}
																		type='radio'
																		name={att.name}
																		id={item.value + att.name + cartProduct.id}
																		value={item.value}
																	></input>

																	<label
																		htmlFor={
																			item.value + att.name + cartProduct.id
																		}
																		style={{
																			background: item.value,
																			color: item.value,
																			display: 'inline-block',
																			border: 1,
																			borderColor: '#000',
																			borderStyle: 'solid',
																			width: 20,
																			height: 20,
																		}}
																	></label>
																</div>
															))}
														</div>
													</div>
												) : (
													<div>
														<p>{att.name}</p>
														<div className='cart-cont-attributes-div'>
															{att.items.map((item, index) => (
																<div
																	key={'cart-cont-attributes' + index}
																	className='cart-cont-attributes'
																	onClick={() =>
																		this.changeAttribute(
																			id,
																			att.name,
																			item.value
																		)
																	}
																>
																	<input
																		defaultChecked={
																			this.props.attributes[id][att.name] ===
																			item.value
																		}
																		type='radio'
																		name={att.name}
																		id={
																			id +
																			item.value +
																			att.name +
																			cartProduct.id
																		}
																		value={item.value}
																	></input>

																	<label
																		htmlFor={
																			id +
																			item.value +
																			att.name +
																			cartProduct.id
																		}
																	>
																		{item.value}
																	</label>
																</div>
															))}
														</div>
													</div>
												)}
											</form>
									  ))
									: ''}
							</div>
						</div>{' '}
						<div className='cart-img-quantity-div'>
							<div className='cart-cont-nav-quantity'>
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
							<div className='cart-img-div'>
								{cartProduct.gallery.length > 1 ? (
									<img
										alt='previous arrow'
										className='prev-pic'
										src={prevPic}
										id={id}
										onClick={this.prevPic}
									></img>
								) : (
									''
								)}
								<Link
									to={`/id/${id.substring(id.lastIndexOf('/') + 2)}`}
									onClick={() => this.props.openCart(false)}
								>
									<img
										alt='product'
										className='product-pic'
										src={cartProduct.gallery[this.state.picIndex[id]]}
										width='141px'
										height='185px'
									></img>
								</Link>

								{cartProduct.gallery.length > 1 ? (
									<img
										alt='next arrow'
										className='next-pic'
										src={nextPic}
										id={id}
										onClick={this.nextPic}
									></img>
								) : (
									''
								)}
							</div>
						</div>
					</div>
				</div>
			);
		}
	};
	render() {
		return (
			<div className='cart-container'>
				<h1 className='cart-title'>CART</h1>
				<div className='cart'>
					{Object.keys(this.props.attributes).map((item, index) => {
						return this.getProducts(item, index);
					})}
				</div>
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
		itemList: state.addItem.cartProducts,
		attributes: state.addAttributes.attributes,
		cartIsOpen: state.openCart.cartIsOpen,
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
		changeAttribute: (id, name, attributes, value) => {
			dispatch(changeAttributeAction(id, name, attributes, value));
		},
		deleteItem: (id, attributes) => {
			dispatch(deleteItemAction(id, attributes));
		},
	};
};

export default graphql(CATEGORY)(
	connect(mapStateToProps, mapDispatchToProps)(Cart)
);
