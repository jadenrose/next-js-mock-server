import { ApolloClient, InMemoryCache } from '@apollo/client'
import Layout from '../../src/components/Layout'
import { PAGE_QUERY, PATHS_QUERY } from '../../src/queries'
import { PageQuery, PathsQuery } from '../../src/__generated__/graphql'

const Home = (props?: PageQuery['pages'][0]) => {
  if (props) return <Layout {...props} />

  return null
}

// SSG
export async function getStaticPaths() {
  const client = new ApolloClient({
    uri: process.env.HYGRAPH_ENDPOINT,
    cache: new InMemoryCache(),
  })

  const { data } = await client.query({
    query: PATHS_QUERY,
  })

  const paths = data.pages
    .map(({ path, slug }) => {
      if (path && slug)
        return {
          params: {
            path,
            slug,
          },
        }

      return null
    })
    .filter((path) => path)

  console.log(paths)

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({
  params,
}: {
  params: { path: string; slug: string }
}) {
  // Get static props
  const client = new ApolloClient({
    uri: process.env.HYGRAPH_ENDPOINT,
    cache: new InMemoryCache(),
  })

  const { data } = await client.query({
    query: PAGE_QUERY,
    variables: {
      path: params.path,
      slug: params.slug,
    },
  })

  return {
    props: {
      ...data?.pages[0],
    },
  }
}

export default Home
