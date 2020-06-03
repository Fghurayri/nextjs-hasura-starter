import { decode } from "jsonwebtoken";
import { AdminClient, UserClient } from "@/network/clients";
import {
  CREATE_USER,
  CREATE_ROLE_FOR_USER,
  GET_USER_BY_EMAIL,
} from "@/graphql/auth";
import { REFRESH_TOKEN_COOKIE_PATH } from "@/auth/tokens-management";

export const AUTHED_USER = "AUTHED_USER";
export const GUEST_USER = "GUEST_USER";

export function getUserIdFromAccessToken(inMemoryToken) {
  let { hasura } = decode(inMemoryToken);
  return Number(hasura["x-hasura-user-id"]);
}
export async function createUserMutation(variables) {
  let { data } = await AdminClient({
    data: {
      query: CREATE_USER,
      variables: {
        ...variables,
      },
    },
  });
  return data;
}

export async function createRoleForUserMutation(variables) {
  let { data } = await AdminClient({
    data: {
      query: CREATE_ROLE_FOR_USER,
      variables: {
        ...variables,
      },
    },
  });
  console.log({ data });
  return data;
}

export async function getUserByEmailQuery(variables) {
  let { data } = await AdminClient({
    data: {
      query: GET_USER_BY_EMAIL,
      variables: {
        ...variables,
      },
    },
  });
  return data;
}

export function refreshTokenRequest() {
  return UserClient({
    url: REFRESH_TOKEN_COOKIE_PATH,
    method: "GET",
  });
}
