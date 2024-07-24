// ApolloClientSetup.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'https://api-us-east-1-shared-usea1-02.hygraph.com/v2/clwt6l7rm004n07w8upkcznlw/master',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;