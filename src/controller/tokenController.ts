import * as jwt from "jsonwebtoken";
import { JWT_SECRET, REFRESH_SECRET } from "../utils/secret";

export let refreshTokens: { [refTok: string]: [username: string]; } = {};

export function getAccessToken(payload: any) {
  return jwt.sign({ user: payload }, JWT_SECRET, { expiresIn: '30min' });
}

export function getRefreshToken(payload: any) {
  const refTok = jwt.sign({ user: payload }, REFRESH_SECRET, { expiresIn: '10 days' });
  return refTok;
}


module.exports = { getAccessToken, getRefreshToken, refreshTokens };