import Head from "next/head";
import Header from "@/components/header";

export default function Layout({ children }) {
  return (
    <div className="container">
      <Head>
        <title>Fullstack React GraphQL Starter</title>
      </Head>
      <Header />
      <main>{children}</main>
    </div>
  );
}
