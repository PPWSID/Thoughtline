import type { Request, Response } from "express";
import usersevice from "../service/usersevice.js";
import responebuilder from "../utils/responebuilder.js";

async function registerUser(req: Request, res: Response) {
    try {
        const result: any = await usersevice.registerUser(req.body);
        if (result && result.error) {
            return responebuilder.responseError(res, 400, "Error registering user", result.error);
        }
        return responebuilder.responseSuccess(res, result, 200, "User registered successfully");
    } catch (error) {
        return responebuilder.responseError(res, 500, "Internal server error", error);
    }
}

async function loginUser(req: Request, res: Response) {
    try {
        const result: any = await usersevice.loginUser(req.body);
        if (result && result.error) {
            return responebuilder.responseError(res, 401, "Error logging in user", result.error);
        }

        const { token, user } = result;

        // res.cookie('token', token, {
        //     httpOnly: true,
        //     secure: false, // ใช้ได้กับ http
        //     maxAge: 24 * 60 * 60 * 1000 // 1 วัน
        // });
        
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,        // จำเป็นเมื่อใช้ https
          sameSite: "none",    //  จำเป็นเมื่อข้าม domain
          maxAge: 24 * 60 * 60 * 1000,
        });

        // ส่งกลับเฉพาะข้อมูล User (ซ่อน Token จาก Network Tab)
        return responebuilder.responseSuccess(res, user, 200, "Login successful");

    } catch (error) {
        return responebuilder.responseError(res, 500, "Internal server error", error);
    }
}

async function getProfile(req: Request, res: Response) {
    try {
        const userId = (req as any).user.id;
        const result: any = await usersevice.getProfile(userId);
        if (result && result.error) {
            return responebuilder.responseError(res, 400, "Error getting profile", result.error);
        }
        return responebuilder.responseSuccess(res, result, 200, "Profile retrieved successfully");
    } catch (error) {
        return responebuilder.responseError(res, 500, "Internal server error", error);
    }
}

async function updateProfile(req: Request, res: Response) {
    try {
        const userId = (req as any).user.id;
        const result: any = await usersevice.updateProfile(userId, req.body);
        if (result && result.error) {
            return responebuilder.responseError(res, 400, "Error updating profile", result.error);
        }
        return responebuilder.responseSuccess(res, result, 200, "Profile updated successfully");
    } catch (error) {
        return responebuilder.responseError(res, 500, "Internal server error", error);
    }
}

async function logoutUser(req: Request, res: Response) {
    res.clearCookie('token');
    return responebuilder.responseSuccess(res, null, 200, "Logged out successfully");
}

export default {
    registerUser,
    loginUser,
    logoutUser,
    getProfile,
    updateProfile
};
