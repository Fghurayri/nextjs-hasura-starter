export const GET_USER_BY_EMAIL = `
  query getUserByEmail($email: String!) {
    users(where: {email: {_eq: $email}}){
      id
      email
      password
      default_role
      user_roles {
        role
      }
    }
  }
`;

export const CREATE_USER = `
  mutation CreateNewUser($email: String!, $password: String!) {
    insert_users_one(object: {email: $email, password: $password}) {
      id
      default_role
      email
    }
  }
`;

export const CREATE_ROLE_FOR_USER = `
  mutation CreateRoleForUser($user_id: bigint!, $role: roles_enum) {
    insert_user_roles(objects: {user_id: $user_id, role: $role}) {
      affected_rows
    }
  }
`;
