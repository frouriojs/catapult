import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { COGNITO_POOL_ENDPOINT } from 'service/envValues';

export const cognitoClient = new CognitoIdentityProviderClient({
  endpoint: COGNITO_POOL_ENDPOINT,
  region: 'ap-northeast-1',
  credentials: { accessKeyId: 'cognito-access-key', secretAccessKey: 'cognito-secret-key' },
});
