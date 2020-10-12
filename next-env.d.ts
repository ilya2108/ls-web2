/// <reference types="next" />
/// <reference types="next/types/global" />

declare module '*.gql' {
  import { DocumentNode } from 'graphql';

  const value: DocumentNode;
  export = value;
}
