import { useEffect, useState } from "react";
import { getNewAccessToken, inMemoryTokenAPI } from "@/auth/tokens-management";

export default function useRefreshTokenOnMount() {
  let [loading, setLoading] = useState(true);

  useEffect(function () {
    async function refreshTokenOnMount() {
      try {
        const newToken = await getNewAccessToken();
        inMemoryTokenAPI.setState({ inMemoryToken: newToken });
      } catch {
      } finally {
        setLoading(false);
      }
    }
    refreshTokenOnMount();
  }, []);

  return loading;
}
