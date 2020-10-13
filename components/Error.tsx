import React from 'react'

type ApiError = any // TODO load from graphql-hooks

type Props = {
  errors?: ApiError
}

export function hasQueryError(error: ApiError) {
  return error.fetchError || error.httpError || error.graphQLErrors.length
}

export default function Error(props: Props) {
  const { errors } = props

  return (
    <div className="loading">
      error
      <br />
      {errors && JSON.stringify(errors)}
      <a href='https://gitlab.fit.cvut.cz/learnshell-2.0/learnshell-2-issues/issues/new'>Please, let us know</a>
    </div>
  )
}
