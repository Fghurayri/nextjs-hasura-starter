import { useEffect } from "react";
import Router from "next/router";
import { useInMemoryToken } from "@/auth/tokens-management";
import { AUTHED_USER, GUEST_USER } from "@/auth/user-management";

export default function useAuthRedirect({ redirectIf, redirectTo }) {
  let accessToken = useInMemoryToken(({ inMemoryToken }) => inMemoryToken);
  let userType = accessToken ? AUTHED_USER : GUEST_USER;
  useEffect(
    function () {
      if (redirectIf === userType) {
        Router.push(redirectTo);
      }
    },
    [accessToken]
  );
}
