import { gql } from '../__generated__'

export const GET_HOMEPAGE_QUERY = gql(`
    query GetHomePage {
        pages (where: {path: null, slug: null}) {
            id
            path
            slug
            articles {
              html
            }
        }
    }
`)
