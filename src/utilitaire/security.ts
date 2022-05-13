require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = `${process.env.SECRET_JWT}`;

export type Payload = {
  user?: string;
};

export const getToken = (payload: any): string => {
  const token = jwt.sign(payload, secret, {
    expiresIn: 604800, // 1 Week
  });
  return token;
};

export const verifyToken = (token: string): Payload => {
  const payload = jwt.verify(token, secret) as Payload;
  return payload;
};
