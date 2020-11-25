import { ApolloClient, ApolloProvider, gql, InMemoryCache } from '@apollo/client';
import Products from './components/Products';

const client = new ApolloClient({
  uri: 'https://pangaea-interviews.now.sh/api/graphql',
    cache: new InMemoryCache()
})

function App() {
  return (
    <ApolloProvider client={client}>
    <div className="App">
      <div>
        <Products />
      </div>
    </div>
  </ApolloProvider>

  );
}

export default App;
