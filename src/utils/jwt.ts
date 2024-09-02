// utils/jwt.ts
import jwt from 'jsonwebtoken';

export function signJwtAccessToken(user: any) {
  const payload = { id: user.id, username: user.username };
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' }); // Access Token for 15 minutes
}

export function signJwtRefreshToken(user: any) {
  const payload = { id: user.id };
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' }); // Refresh Token for 7 days
}

export function verifyJwt(token: string, secret: string) {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
}
