import {
  REFRESH_TOKEN_COOKIE_NAME,
  JWT_REFRESH_TOKEN_SECRET,
  createAccessToken,
  verifyToken,
  createAccessTokenCookie,
  deleteCookies,
} from "@/auth/tokens-management";
import { getUserByEmail } from "@/auth/index";

export default async function RefreshToken({ method, cookies }, res) {
  if (method !== "GET") {
    return res.status(404).send("");
  }

  try {
    let refreshToken = cookies[REFRESH_TOKEN_COOKIE_NAME];
    let decoded = verifyToken(refreshToken, JWT_REFRESH_TOKEN_SECRET);
    let user = await getUserByEmail(decoded.email);
    let accessToken = createAccessToken(user);
    createAccessTokenCookie(res, { accessToken });
    return res.status(200).json({ accessToken });
  } catch (error) {
    deleteCookies(res);
    return res.status(200).json({});
  }
}
