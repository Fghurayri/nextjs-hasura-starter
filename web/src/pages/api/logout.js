import { deleteCookies } from "@/auth/tokens-management";

export default function logout({ method }, res) {
  if (method !== "GET") {
    return res.status(404).send("");
  }
  deleteCookies(res);
  return res.status(200).send("");
}
