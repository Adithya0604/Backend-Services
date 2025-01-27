import jwt from 'jsonwebtoken';

export const generateToken = (adminId: string): string => {
  return jwt.sign({ adminId }, process.env.JWT_SECRET!, {
    expiresIn: '24h'
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};