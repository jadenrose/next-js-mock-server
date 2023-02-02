import { gql } from '../__generated__'

export const PATHS_QUERY = gql(`
  query Paths {
    pages  {
      path
      slug
    }
  }
`)

export const PAGE_QUERY = gql(`
    query Page ($path: String, $slug: String) {
        pages (where: {path: $path, slug: $slug}) {
            id
            path
            slug
            articles {
              html
            }
        }
    }
`)
