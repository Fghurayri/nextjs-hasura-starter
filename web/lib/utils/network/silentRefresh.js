import NextRouter from "next/router";
import {
  isAccessTokenExpired,
  getNewAccessToken,
  inMemoryTokenAPI,
} from "@/auth/tokens-management";
import { UserClient } from "./clients";

export default function configSilentTokenRefresh() {
  NextRouter.events.on("routeChangeStart", ensureTokenIsUpToDate);
  UserClient.interceptors.request.use(addAccessTokenToAuthHeader);
  UserClient.interceptors.response.use(refreshTokenIfNeededAndRetryRequest);
}

async function ensureTokenIsUpToDate() {
  if (isAccessTokenExpired()) {
    await refreshToken();
  }
}

function addAccessTokenToAuthHeader(request) {
  addAuthorizationHeaderTo(request);
  return request;
}

async function refreshTokenIfNeededAndRetryRequest(response) {
  await refreshIfInvalidTokenFromHasuraAPI(response);
  return response;
}

function addAuthorizationHeaderTo(request) {
  let inMemoryToken = inMemoryTokenAPI.getState().inMemoryToken;
  if (inMemoryToken) {
    request.headers.Authorization = `Bearer ${inMemoryToken}`;
  }
}

async function refreshIfInvalidTokenFromHasuraAPI(response) {
  if (response.config.url === process.env.NEXT_PUBLIC_API_URL) {
    let { errors = [] } = response.data;
    if (errors.length && errors[0].extensions.code === "invalid-jwt") {
      await refreshToken();
      return UserClient.request(response.config);
    }
  }
}

async function refreshToken() {
  let newAccessToken = await getNewAccessToken();
  return newAccessToken
    ? inMemoryTokenAPI.setState({ inMemoryToken: newAccessToken })
    : window.location.replace("/sign-up-in"); // Router.push() doesn't work. 🤷‍♂️
}
