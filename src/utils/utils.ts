import { jwtDecode, JwtPayload } from 'jwt-decode';
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

export function parseJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  // Decode base64 and convert each character to its corresponding hex code
  const decodedString = window.atob(base64);
  const charArray = decodedString.split('');
  const hexCodes = charArray.map(
    (char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`
  );

  // Combine hex codes into a single string with % encoding
  const jsonPayload = hexCodes.join('');

  return JSON.parse(jsonPayload);
}

export function isAccessTokenExpired(accessToken: string) {
  try {
    if (!accessToken) {
      return {
        name: 'No Token Found!',
        message: 'You are not logged in',
      };
    }
    const decoded = jwtDecode<JwtPayload>(accessToken);
    if (decoded.exp) {
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return true; // Assume expired if decoding fails (better to be cautious)
  }
}
