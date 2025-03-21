import bcrypt from "bcryptjs"; // Import bcrypt

export const verifyAnswer = (user_answer: string | undefined, hashed_correct_answer: string | undefined): boolean => {
    if (!user_answer || !hashed_correct_answer) return false;

    return bcrypt.compareSync(user_answer.trim().toLowerCase(), hashed_correct_answer);
};