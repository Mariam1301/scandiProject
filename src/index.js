import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import exp from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';

const { store, pers } = exp();
const client = new ApolloClient({
	uri: 'http://localhost:4000',
	cache: new InMemoryCache(),
});

ReactDOM.render(
	<ApolloProvider client={client}>
		<Provider store={store}>
			<PersistGate loading={null} persistor={pers}>
				<App />
			</PersistGate>
		</Provider>
	</ApolloProvider>,
	document.getElementById('root')
);
