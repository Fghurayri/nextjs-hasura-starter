import {
  createAccessToken,
  createRefreshToken,
} from "@/auth/tokens-management";
import {
  hashPassword,
  compareHashedPassword,
} from "@/auth/password-management";
import {
  getUserByEmailQuery,
  createUserMutation,
  createRoleForUserMutation,
} from "@/auth/user-management";

export async function registerUser(email, password) {
  const hashedPassword = await hashPassword(password);

  let {
    data: { insert_users_one: createdUser },
  } = await createUserMutation({
    email,
    password: hashedPassword,
  });

  await createRoleForUserMutation({
    user_id: createdUser.id,
    role: createdUser.default_role,
  });

  console.log({ createdUser });

  return {
    accessToken: createAccessToken(createdUser),
    refreshToken: createRefreshToken(createdUser),
  };
}

export async function loginUser(email, password) {
  let user = await getUserByEmail(email);

  let { password: hashedPassword } = user;

  const match = await compareHashedPassword(password, hashedPassword);

  if (!match) {
    throw new Error("Invalid password");
  }

  return {
    accessToken: createAccessToken(user),
    refreshToken: createRefreshToken(user),
  };
}

export async function getUserByEmail(email) {
  const {
    data: { users = [] },
  } = await getUserByEmailQuery({ email });

  if (!users.length) {
    throw new Error("The user is not registered yet.");
  }

  let user = users[0];

  user = {
    ...user,
    user_roles: user.user_roles.map(({ role }) => role),
  };

  return user;
}

export async function isAlreadyRegistered(email) {
  const {
    data: { users = [] },
  } = await getUserByEmailQuery({ email });
  return Boolean(users.length);
}

export function isEmailValid(email) {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}
