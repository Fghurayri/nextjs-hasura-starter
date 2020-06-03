import Link from "next/link";
import { useInMemoryToken } from "@/auth/tokens-management";

function GuestHeader() {
  return (
    <>
      <Link href="/sign-up-in">
        <a>Login/Register</a>
      </Link>
    </>
  );
}

function AuthedHeader() {
  return (
    <>
      <Link href="/private-todos">
        <a>Private Todos</a>
      </Link>
      ,
      <Link href="/logout">
        <a>Logout</a>
      </Link>
    </>
  );
}

export default function () {
  let accessToken = useInMemoryToken(({ inMemoryToken }) => inMemoryToken);
  return (
    <header className="header">
      <Link href="/">
        <a>Home</a>
      </Link>
      <Link href="/public-todos">
        <a>Public Todos</a>
      </Link>
      {accessToken ? <AuthedHeader /> : <GuestHeader />}
    </header>
  );
}
