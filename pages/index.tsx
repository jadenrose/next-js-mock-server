import { ApolloClient, InMemoryCache } from '@apollo/client'
import Layout from '../src/components/Layout'
import { PAGE_QUERY } from '../src/queries'
import { PageQuery } from '../src/__generated__/graphql'

const Home = (props?: PageQuery['pages'][0]) => {
  if (props) return <Layout {...props} />

  return null
}

// SSG
export async function getStaticProps() {
  // Get static props
  const client = new ApolloClient({
    uri: process.env.HYGRAPH_ENDPOINT,
    cache: new InMemoryCache(),
  })

  const { data } = await client.query({
    query: PAGE_QUERY,
    variables: {
      path: null,
      slug: null,
    },
  })

  return {
    props: {
      ...data?.pages[0],
    },
  }
}

export default Home
