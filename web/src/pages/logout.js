import Layout from "@/components/layout";
import { useEffect } from "react";
import { UserClient } from "@/network/clients";
import Router from "next/router";
import { inMemoryTokenAPI } from "@/auth/tokens-management";

export default function LogoutPage() {
  useEffect(function () {
    async function logout() {
      await UserClient({
        method: "GET",
        url: "/api/logout",
      });
      inMemoryTokenAPI.setState({ inMemoryToken: "" });
      Router.push("/");
    }
    logout();
  }, []);
  return <Layout></Layout>;
}
