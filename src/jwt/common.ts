
import * as jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;
export const accessExpiration = 24 * 60 * 60; // 24 hours
export const refreshExpiration = 30 * 24 * 60 * 60; // 30 days

if (!secret) throw new Error('JWT_SECRET must be set');

// wrapping async verify into a promise
export function verify(token: string): Promise<jwt.JwtPayload | string> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, function (err, payload) {
      if (err) return reject(err);
      resolve(payload);
    });
  });
}

// wrapping async sign into a promise
export function sign(
  payload: object | string,
  expiresIn: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn }, (err, token) => {
      if (err) return reject(err);
      resolve(token);
    });
  });
}