import { fetchAuthSession, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { isAxiosError } from 'axios';
import { useLoading } from 'components/loading/useLoading';
import { useAlert } from 'hooks/useAlert';
import { useUser } from 'hooks/useUser';
import { useCallback, useEffect } from 'react';
import { apiAxios, apiClient } from 'utils/apiClient';
import { catchApiErr } from 'utils/catchApiErr';

export const AuthLoader = () => {
  const { user, setUser } = useUser();
  const { setLoading } = useLoading();
  const { setAlert } = useAlert();
  const updateCookie = useCallback(async () => {
    const tokens = await fetchAuthSession()
      .then((e) => e.tokens)
      .catch(catchApiErr);

    if (!tokens?.idToken) return setUser(null);

    const result = await apiClient.session
      .$post({
        body: { idToken: tokens.idToken.toString(), accessToken: tokens.accessToken.toString() },
      })
      .catch(catchApiErr);

    if (result?.status === 'success') {
      await apiClient.private.me.$get().catch(catchApiErr).then(setUser);
    }
  }, [setUser]);

  useEffect(() => {
    void updateCookie();
  }, [updateCookie]);

  useEffect(() => {
    // eslint-disable-next-line complexity
    const useId = apiAxios.interceptors.response.use(undefined, async (err) => {
      if (user.data && isAxiosError(err) && err.response?.status === 401 && err.config) {
        const { config } = err;
        return updateCookie()
          .then(() => apiAxios.request(config))
          .catch(() => Promise.reject(err));
      }

      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
      return Promise.reject(err);
    });

    return () => apiAxios.interceptors.response.eject(useId);
  }, [user.data, updateCookie, setAlert]);

  useEffect(() => {
    return Hub.listen(
      'auth',
      // eslint-disable-next-line complexity
      async (data) => {
        switch (data.payload.event) {
          case 'customOAuthState':
          case 'signInWithRedirect':
          case 'signInWithRedirect_failure':
          case 'tokenRefresh':
            break;
          case 'signedOut':
            await apiClient.session.$delete().catch(catchApiErr);
            setUser(null);
            break;
          case 'signedIn':
            await updateCookie();
            break;
          case 'tokenRefresh_failure':
            await signOut();
            break;
          /* v8 ignore next 2 */
          default:
            throw new Error(data.payload satisfies never);
        }
      },
    );
  }, [setAlert, updateCookie, setLoading, setUser]);

  return <></>;
};
