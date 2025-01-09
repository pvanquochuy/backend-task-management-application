import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../config/jwt";
import { User } from "../models/user.model";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  // Đảm bảo trả về Promise<void>
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied" });
  }

  try {
    const decoded: any = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = { id: decoded.id, email: decoded.email }; // Gắn thông tin user
    next(); // Gọi next() để chuyển đến middleware hoặc route handler tiếp theo
  } catch (error) {
    return res.status(401).json({ message: "Token verification failed" });
  }
};
