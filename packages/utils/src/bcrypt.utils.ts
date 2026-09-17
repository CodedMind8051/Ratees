import bcrypt from "bcrypt";
import { bcryptSaltRounds } from "@ratees/constants/src/constants";

export const hashPassword = async (password: string): Promise<string> => {

    try {
        if (!password || typeof password !== "string" || password.toString().trim() === "") {
            throw new Error("Password is required");
        }

        if (password.length < 8 || password.length > 50) {
            throw new Error("Password must be at least 8 characters and no more than 50 characters");
        }

        const hashedPassword = await bcrypt.hash(password, bcryptSaltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error("Error occurred while hashing password");
    }



}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
        if (!password || typeof password !== "string" || password.toString().trim() === "") {
            throw new Error("Password is required");
        }

        if (password.length < 8 || password.length > 50) {
            throw new Error("Password must be at least 8 characters and no more than 50 characters");
        }

        if (!hashedPassword || typeof hashedPassword !== "string" || hashedPassword.toString().trim() === "") {
            throw new Error("Hashed password is required");
        }

        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        throw new Error("Error occurred while comparing password");
    }


}