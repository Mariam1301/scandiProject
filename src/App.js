import React, { Component } from 'react';
import Header from './components/Header';
import PLP from './components/PLP';
import { BrowserRouter } from 'react-router-dom';
import { Route } from 'react-router';
import PDP from './components/PDP';
import Cart from './components/Cart';
import { Switch } from 'react-router';
export default class App extends Component {
	render() {
		return (
			<div>
				<BrowserRouter>
					<Header />
					<Route component={PLP} exact path={'/'} />
					<Switch>
						<Route component={PLP} path={'/category/'} />
						<Route component={PDP} path='/id/' />
						<Route component={Cart} path='/cart' />
					</Switch>
				</BrowserRouter>
			</div>
		);
	}
}
