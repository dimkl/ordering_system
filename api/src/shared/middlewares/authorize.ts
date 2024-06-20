import {authorize as clerkAuthorize} from './clerk/authorize'
import {authorize as mockAuthorize} from './mock/authorize'

export function createAuthorize(requiredScopes: string[] = []){
  if(process.env.NODE_ENV === 'test'){
      return mockAuthorize(requiredScopes);
    }
      return clerkAuthorize(requiredScopes);
};