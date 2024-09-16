import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { COGNITO_ACCESS_KEY, COGNITO_POOL_ENDPOINT, COGNITO_SECRET_KEY } from 'service/envValues';

export const cognitoClient = new CognitoIdentityProviderClient({
  endpoint: COGNITO_POOL_ENDPOINT,
  region: 'ap-northeast-1',
  credentials: { accessKeyId: COGNITO_ACCESS_KEY ?? '', secretAccessKey: COGNITO_SECRET_KEY ?? '' },
});
