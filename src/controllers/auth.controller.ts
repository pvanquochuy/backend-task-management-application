import { Request, Response } from "express";
import { User } from "../models/user.model";
import { generateToken } from "../config/jwt";

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Tạo user mới
    const user = new User({ username, email, password });
    await user.save();

    return res
      .status(201)
      .json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ message: "Registration failed", error: error });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Tạo token
    const token = generateToken({ id: user.id, role: user.role });

    return res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      username: user.username,
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error });
  }
};
