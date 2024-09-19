// const BASE_URL = process.env.REACT_APP_BASE_URL
const BASE_URL = "https://localhost:4000/api/v1"

export const endpoints = {
    SENDOTP_API: BASE_URL + "/auth/sendotp",
    SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL + "/auth/login",
    RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
}
export const categories = {
    CATEGORIES_API: BASE_URL + "/course/showAllCategories",
}