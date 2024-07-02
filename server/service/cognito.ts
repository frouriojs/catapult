import {
  CognitoIdentityProviderClient,
  ListUserPoolsCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  COGNITO_ACCESS_KEY,
  COGNITO_POOL_ENDPOINT,
  COGNITO_REGION,
  COGNITO_SECRET_KEY,
} from './envValues';

export const cognitoClient = new CognitoIdentityProviderClient({
  endpoint: COGNITO_POOL_ENDPOINT,
  region: COGNITO_REGION,
  credentials: { accessKeyId: COGNITO_ACCESS_KEY, secretAccessKey: COGNITO_SECRET_KEY },
});

export const cognito = {
  health: async (): Promise<boolean> => {
    const command = new ListUserPoolsCommand({ MaxResults: 1 });

    return await cognitoClient.send(command).then(() => true);
  },
};
