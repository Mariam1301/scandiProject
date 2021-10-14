import React, { Component } from 'react';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { connect } from 'react-redux';
import {
	addItemAction,
	incrementAction,
	createAttributeAction,
	openCartAction,
	currencyOpenAction,
} from '../redux/actions/actions';
import ReactHtmlParser from 'react-html-parser';
import pdp from '../styles/pdp.css';
const DETAILS = gql`
	query getProduct($id: String!) {
		product(id: $id) {
			name
			id
			inStock
			gallery
			description
			category
			attributes {
				type
				name
				items {
					value
					displayValue
				}
			}
			prices {
				currency
				amount
			}
			brand
		}
	}
`;

export class PDP extends Component {
	constructor(props) {
		super(props);
		this.state = {
			imgUrl: '',
			currencies: {
				USD: '$',
				GBP: '£',
				AUD: 'A$',
				JPY: '¥',
				RUB: '₽',
			},
			attributeId: '',
			attributes: { quantity: 1 },
		};
	}

	componentDidMount() {
		window.scrollTo(0, 0);
	}
	changePic = (e) => {
		this.setState({
			imgUrl: e.target.id,
		});
	};
	addItemToCart = (e) => {
		let product = this.props.data.product;
		let price = product.prices;
		let arrOfName = Object.keys(this.props.attributes);
		if (Object.keys(this.state.attributes).length > 1) {
			let attributes = { price: price, quantity: 1 };
			product.attributes.map((at) => {
				return (attributes = { ...attributes, [at.name]: at.items[0].value });
			});
			attributes = { ...attributes, ...this.state.attributes };
			this.setState({
				attributes: { ...this.state.attributes, ...attributes },
			});

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
					price: price,
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
				let attributes = { price: price, quantity: 1 };
				product.attributes.map((at) => {
					return (attributes = { ...attributes, [at.name]: at.items[0].value });
				});
				attributes = { ...attributes, ...this.state.attributes };

				this.props.addAttributes(e, {
					price: price,
					...attributes,
				});
			}
			this.props.addToCart(e.target.id);
			this.props.incrementQuantity();
		} else {
			let attributes = { price: price, quantity: 1 };
			product.attributes.map((at) => {
				return (attributes = { ...attributes, [at.name]: at.items[0].value });
			});

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
		}
	};

	setAttributes = (e) => {
		this.setState({
			attributes: { ...this.state.attributes, [e.target.name]: e.target.value },
		});
	};

	getImages = (product) => {
		return (
			<div className='product-images'>
				<ul className='gallery'>
					{product.gallery.map((item, index) => (
						<li key={'pdp-li' + index}>
							<img
								alt='same product but different'
								onClick={this.changePic}
								id={item}
								src={item}
								width='50px'
							></img>
						</li>
					))}
				</ul>
				<div className='pdp-main-pic-div'>
					<img
						className={product.inStock ? 'pdp-main-pic' : 'pdp-main-pic-out'}
						alt='pdp main product'
						src={
							this.state.imgUrl === '' ? product.gallery[0] : this.state.imgUrl
						}
					></img>
					<p className='pdp-out-of-stock-text'>
						{product.inStock ? '' : 'OUT OF STOCK'}
					</p>
				</div>
			</div>
		);
	};

	getAttributes = (product) => {
		return (
			<form>
				{product.attributes.map((attribute, index) => (
					<div
						className='product-attributes'
						key={'product-attributes' + index}
					>
						<p>{attribute.name}:</p>

						<div>
							{attribute.items.map((value, index) => (
								<div
									className={
										attribute.type === 'swatch'
											? 'product-color-input'
											: 'attribute-input-div'
									}
									key={
										attribute.type === 'swatch'
											? 'product-color-input' + index
											: 'attribute-input-div' + index
									}
								>
									<input
										defaultChecked={value === attribute.items[0]}
										onClick={this.setAttributes}
										className='input-attribute'
										type='radio'
										id={
											attribute.type === 'swatch'
												? value.value
												: attribute.name + value.value
										}
										name={attribute.name}
										value={value.value}
									></input>
									{attribute.type === 'swatch' ? (
										<label
											style={{
												background: value.value,
												color: value.value,
											}}
											htmlFor={value.value}
										></label>
									) : (
										<label
											htmlFor={attribute.name + value.value}
											className='attribut-label'
										>
											{value.value}
										</label>
									)}
								</div>
							))}
						</div>
					</div>
				))}
			</form>
		);
	};

	getDetails = () => {
		let data = this.props.data;
		if (data.loading) {
			return 'Loading...';
		} else {
			let product = data.product;
			return (
				<div className='pdp-div'>
					{this.getImages(product)}
					<div className='about-product'>
						<h2>{product.brand}</h2>
						<h2>{product.name}</h2>

						{product.attributes.length !== 0 ? this.getAttributes(product) : ''}

						<p className='product-price-name'>PRICE:</p>
						<p className='product-price-amount'>
							{this.state.currencies[this.props.activeCurrency]}
							{
								product.prices.filter(
									(price) => price.currency === this.props.activeCurrency
								)[0].amount
							}
						</p>
						<button
							disabled={!product.inStock}
							required
							className={product.inStock ? 'addToCartBtn' : 'cantAddtoCart'}
							onClick={this.addItemToCart}
							id={product.id}
							value={product}
						>
							ADD TO CART
						</button>

						<div className='description'>
							{ReactHtmlParser(product.description)}
						</div>
					</div>
				</div>
			);
		}
	};

	render() {
		return (
			<div
				onClick={
					this.props.currencyIsOpen
						? () => this.props.handleCurrency(false)
						: () => {}
				}
			>
				<div>{this.getDetails()}</div>
				{this.props.cartIsOpen ? (
					<div
						className='cart-backdrop'
						onClick={() => this.props.openCart(false)}
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
		activeCategory: state.setCategory.category,
		activeCurrency: state.changeCurrency.currency,
		itemList: state.addItem.cartProducts,
		attributes: state.addAttributes.attributes,
		numberofItems: state.changeQuantity.cartQuantity,
		cartIsOpen: state.openCart.cartIsOpen,
		currencyIsOpen: state.currencyIsOpen.currencyIsOpen,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		addToCart: (id) => {
			dispatch(addItemAction(id));
		},
		incrementQuantity: () => {
			dispatch(incrementAction());
		},
		addAttributes: (element, attributes) => {
			dispatch(createAttributeAction(element, attributes));
		},
		openCart: (value) => {
			dispatch(openCartAction(value));
		},
		handleCurrency: (value) => {
			dispatch(currencyOpenAction(value));
		},
	};
};
export default graphql(DETAILS, {
	options: (props) => ({
		variables: {
			id: window.location.href.substring(
				window.location.href.lastIndexOf('/') + 1
			),
		},
	}),
})(connect(mapStateToProps, mapDispatchToProps)(PDP));
