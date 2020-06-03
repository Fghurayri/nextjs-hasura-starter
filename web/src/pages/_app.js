import configSilentTokenRefresh from "@/network/silentRefresh";
import useRefreshTokenOnMount from "@/hooks/useRefreshTokenOnMount";

import "../../public/style.css";

configSilentTokenRefresh();

export default function App({ Component, pageProps }) {
  let isLoadingNewToken = useRefreshTokenOnMount();
  return isLoadingNewToken ? null : <Component {...pageProps} />;
}
