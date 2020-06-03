import { sign, verify, decode } from "jsonwebtoken";
import create from "zustand";
import { serialize } from "cookie";
import { refreshTokenRequest } from "./user-management";

const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;

// 900 = 15 minutes
const JWT_ACCESS_TOKEN_AGE_IN_SECONDS = Number(
  process.env.JWT_ACCESS_TOKEN_AGE_IN_SECONDS
);

// 2592000 = 1 month
const JWT_REFRESH_TOKEN_AGE_IN_SECONDS = Number(
  process.env.JWT_REFRESH_TOKEN_AGE_IN_SECONDS
);

export const ACCESS_TOKEN_COOKIE_NAME = "access-token";
export const REFRESH_TOKEN_COOKIE_NAME = "refresh-token";

export const ACCESS_TOKEN_COOKIE_PATH = "/";
export const REFRESH_TOKEN_COOKIE_PATH = "/api/refresh-token";

const DEFAULT_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

const ACCESS_TOKEN_COOKIE_OPTIONS = {
  ...DEFAULT_COOKIE_OPTIONS,
  maxAge: JWT_ACCESS_TOKEN_AGE_IN_SECONDS,
  path: ACCESS_TOKEN_COOKIE_PATH,
};

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  ...DEFAULT_COOKIE_OPTIONS,
  maxAge: JWT_REFRESH_TOKEN_AGE_IN_SECONDS,
  path: REFRESH_TOKEN_COOKIE_PATH,
};

export const [useInMemoryToken, inMemoryTokenAPI] = create((set) => ({
  inMemoryToken: "",
  setInMemoryToken: (inMemoryToken) => set({ inMemoryToken }),
}));

export async function getNewAccessToken() {
  let {
    data: { accessToken },
  } = await refreshTokenRequest();
  return accessToken;
}

export function createRefreshToken(user) {
  return generateToken(user, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: JWT_REFRESH_TOKEN_AGE_IN_SECONDS,
  });
}

export function createAccessToken(user) {
  return generateToken(user, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: JWT_ACCESS_TOKEN_AGE_IN_SECONDS,
  });
}

export function verifyToken(token, secret) {
  return verify(token, secret);
}

export function createAccessTokenCookie(res, { accessToken }) {
  res.setHeader("Set-Cookie", createAccessTokenCookieValue(accessToken));
}

export function createCooikesFromTokens(res, { accessToken, refreshToken }) {
  res.setHeader("Set-Cookie", [
    createAccessTokenCookieValue(accessToken),
    createRefreshTokenCookieValue(refreshToken),
  ]);
}

export function createAccessTokenCookieValue(accessToken) {
  return serialize(
    ACCESS_TOKEN_COOKIE_NAME,
    accessToken,
    ACCESS_TOKEN_COOKIE_OPTIONS
  );
}

export function createRefreshTokenCookieValue(refreshToken) {
  return serialize(
    REFRESH_TOKEN_COOKIE_NAME,
    refreshToken,
    REFRESH_TOKEN_COOKIE_OPTIONS
  );
}

export function deleteCookies(res) {
  res.setHeader("Set-Cookie", [
    serialize(ACCESS_TOKEN_COOKIE_NAME, "", ACCESS_TOKEN_COOKIE_OPTIONS),
    serialize(REFRESH_TOKEN_COOKIE_NAME, "", REFRESH_TOKEN_COOKIE_OPTIONS),
  ]);
}

export function isAccessTokenExpired() {
  let decoded = decode(inMemoryTokenAPI.getState().inMemoryToken);
  return Boolean(decoded && decoded.exp < parseInt(new Date() / 1000));
}

function generateToken(user, secret, options) {
  const body = {
    email: user.email,
    hasura: {
      "x-hasura-allowed-roles": user.user_roles || [user.default_role],
      "x-hasura-default-role": user.default_role,
      "x-hasura-user-id": String(user.id),
    },
  };
  return sign(body, secret, options);
}
