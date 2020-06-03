import { useReducer, useState } from "react";
import Layout from "@/components/layout";
import { useInMemoryToken } from "@/auth/tokens-management";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { AUTHED_USER } from "@/auth/user-management";
import { loginUserRequest } from "@/requests/auth/loginUser";
import { registerUserRequest } from "@/requests/auth/registerUser";

let initialState = {
  email: "",
  password: "",
};

function reducer(state, { name, value }) {
  return {
    ...state,
    [name]: value,
  };
}

export default function AuthPage() {
  useAuthRedirect({ redirectIf: AUTHED_USER, redirectTo: "/private-todos" });

  let [isLoading, setIsLoading] = useState(false);
  let [errorText, setErrorText] = useState("");
  let [{ email, password }, dispatch] = useReducer(reducer, initialState);
  let setAccessToken = useInMemoryToken(
    ({ setInMemoryToken }) => setInMemoryToken
  );

  const onChange = ({ target: { name, value } }) => dispatch({ name, value });

  const onSubmit = async (actionType) => {
    let request =
      actionType === "login" ? loginUserRequest : registerUserRequest;

    setErrorText("");

    setIsLoading(true);

    try {
      const { accessToken } = await request({ email, password });
      setAccessToken(accessToken);
      // Redirection to "/private-todos" will happen as a side effect after
      // setting the access token due to using `useAuthRedirect`.
    } catch (error) {
      const { isAxiosError = null, response = {} } = error;
      if (isAxiosError && response.data) {
        return setErrorText(response.data.message);
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="auth-container">
        <form className="auth-form">
          <h1>Hey! 👋</h1>
          <input
            required
            className="auth-input"
            type="text"
            placeholder="your email..."
            name="email"
            value={email}
            onChange={onChange}
          />
          <input
            required
            className="auth-input"
            type="password"
            placeholder="your password..."
            name="password"
            value={password}
            onChange={onChange}
          />
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onSubmit("login")}
          >
            Login
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onSubmit("register")}
          >
            Register
          </button>
        </form>
        <div className="error-container">
          <p className="error-text">{errorText}</p>
        </div>
      </div>
    </Layout>
  );
}
