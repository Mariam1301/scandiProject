import React, { Component } from 'react';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { connect } from 'react-redux';
import {
	addItemAction,
	incrementAction,
	createAttributeAction,
	openCartAction,
} from '../redux/actions/actions';
const DETAILS = gql`
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
		let products = this.props.data.categories.map((item) =>
			item.products.filter((product) => product.id === e.target.id)
		);
		let [[product]] = products.filter((i) => i.length !== 0);

		let price = product.prices;

		let arrOfName = Object.keys(this.props.attributes);

		if (Object.keys(this.state.attributes).length > 1) {
			if (
				arrOfName.find(
					(element) =>
						element ===
						`${Object.keys(this.state.attributes)
							.slice(1)
							.map((it) => this.state.attributes[it])
							.join('')} / ${e.target.id}`
				)
			) {
				this.props.addAttributes(e, {
					price: price,
					...this.state.attributes,
					quantity:
						this.props.attributes[
							`${Object.keys(this.state.attributes)
								.slice(1)
								.map((it) => this.state.attributes[it])
								.join('')} / ${e.target.id}`
						].quantity + 1,
				});
			} else {
				this.props.addAttributes(e, {
					price: price,
					...this.state.attributes,
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

	getDetails = () => {
		let data = this.props.data;
		if (data.loading) {
			return 'Loading...';
		} else {
			let id = window.location.href.substring(
				window.location.href.lastIndexOf('/') + 1
			);
			let products = data.categories.map((item) =>
				item.products.filter((product) => product.id === id)
			);
			let [[product]] = products.filter((i) => i.length !== 0);
			return (
				<div className='pdp-div'>
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
						<img
							className='pdp-main-pic'
							alt='pdp main product'
							src={
								this.state.imgUrl === ''
									? product.gallery[0]
									: this.state.imgUrl
							}
							width='430px'
							height='515px'
						></img>
					</div>
					<div className='about-product'>
						<h2>{product.brand}</h2>
						<h2>{product.name}</h2>
						{product.attributes.length !== 0 ? (
							<form>
								{product.attributes.map((attribute, index) => (
									<div
										className='product-attributes'
										key={'product-attributes' + index}
									>
										<p>{attribute.name}:</p>
										{attribute.name === 'Color' ? (
											<div>
												{attribute.items.map((value, index) => (
													<div
														className='product-color-input'
														key={'product-color-input' + index}
													>
														<input
															defaultChecked={value === attribute.items[0]}
															onClick={this.setAttributes}
															className='input-attribute'
															type='radio'
															id={value.value}
															name={attribute.name}
															value={value.value}
														></input>

														<label
															style={{
																background: value.value,
																color: value.value,
																border: 1,
																borderColor: '#000',
																borderStyle: 'solid',
																opacity: 1,
																width: 63,
																height: 45,
																cursor: 'pointer',
															}}
															htmlFor={value.value}
														></label>
													</div>
												))}
											</div>
										) : (
											<div>
												{attribute.items.map((value, index) => (
													<div
														className='attribute-input-div'
														key={'attribute-input-div' + index}
													>
														<input
															defaultChecked={value === attribute.items[0]}
															onClick={this.setAttributes}
															className='input-attribute'
															type='radio'
															id={attribute.name + value.value}
															name={attribute.name}
															value={value.value}
														></input>
														<label
															htmlFor={attribute.name + value.value}
															className='attribut-label'
														>
															{value.value}
														</label>
													</div>
												))}
											</div>
										)}
									</div>
								))}
							</form>
						) : (
							''
						)}

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
							required
							className='addToCartBtn'
							onClick={this.addItemToCart}
							id={product.id}
							value={product}
						>
							ADD TO CART
						</button>

						<div
							dangerouslySetInnerHTML={{ __html: product.description }}
							className='description'
						/>
					</div>
				</div>
			);
		}
	};

	render() {
		return (
			<div>
				<div>{this.getDetails()}</div>
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
		activeCategory: state.setCategory.category,
		activeCurrency: state.changeCurrency.currency,
		itemList: state.addItem.cartProducts,
		attributes: state.addAttributes.attributes,
		numberofItems: state.changeQuantity.cartQuantity,
		cartIsOpen: state.openCart.cartIsOpen,
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
	};
};
export default graphql(DETAILS)(
	connect(mapStateToProps, mapDispatchToProps)(PDP)
);
