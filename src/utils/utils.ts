import { OAUTH_GOOGLE_URL } from '../constants';

export const getOauthGoogleUrl = () => {
  const { VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_AUTHORIZED_REDIRECT_URI } =
    import.meta.env;

  const options = {
    redirect_uri: VITE_GOOGLE_AUTHORIZED_REDIRECT_URI,
    client_id: VITE_GOOGLE_CLIENT_ID,
    access_type: OAUTH_GOOGLE_URL.ACCESS_TYPE,
    response_type: OAUTH_GOOGLE_URL.RESPONSE_TYPE,
    prompt: OAUTH_GOOGLE_URL.PROMPT,
    scope: OAUTH_GOOGLE_URL.SCOPE.join(' '),
  };
  const qs = new URLSearchParams(options);
  return `${OAUTH_GOOGLE_URL.ROOT_URL}?${qs.toString()}`;
};
