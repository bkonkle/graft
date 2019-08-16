/**
 * A generic type representing a Connection with either `edges` or `nodes`.
 */
export interface Connection<T> {
  nodes?: T[]
  edges?: {
    cursor?: string
    node?: T
  }[]
}

/**
 * Strip empty elements from an array, removing them from the type.
 */
export const stripEmptyElements = <T>(array: Array<T>) =>
  array.filter(Boolean) as NonNullable<T>[]

/**
 * Get `nodes` or `edges` from a Connection object. Use `stripEmptyElements`
 * filter out any empty array elements in the result.
 */
export const getNodesFromConnection = <T>(
  pagination?: Connection<T> | null
): NonNullable<T>[] => {
  if (!pagination) {
    return []
  }

  if (pagination.nodes) {
    return stripEmptyElements(pagination.nodes)
  }

  return pagination.edges
    ? stripEmptyElements(pagination.edges.map(edge => edge.node))
    : []
}
