import Layout from "@/components/layout";

export default function HomePage() {
  return (
    <Layout>
      <div className="home-container">
        <h1>
          Fullstack React & GraphQL App with Authentication and Authorization
        </h1>
        <h2>Example Todo App Using Next JS and Hasura 🚀</h2>
        <div className="image-container">
          <img className="stack" src="/stack.png" />
        </div>
      </div>
    </Layout>
  );
}
