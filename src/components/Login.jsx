import { useState } from "react";
import axios from "axios";
import { FiLock, FiMail, FiShield } from "react-icons/fi";
import { useNavigate } from "react-router";

export default function Login() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!values.email.trim()) nextErrors.email = "Admin email is required.";
    if (!values.password) nextErrors.password = "Admin password is required.";
    setErrors(nextErrors);
    setMessage("");
    if (Object.keys(nextErrors).length) return;

    try {
      setIsLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        values,
      );

      if (!data?._status || !data?._token) {
        setMessage(data?._message || "Unable to login. Please try again.");
        return;
      }

      localStorage.setItem("admin_token", data._token);
      localStorage.setItem(
        "admin_data",
        JSON.stringify({
          _id: data._data?._id,
          name: data._data?.name,
          email: data._data?.email,
          role_type: data._data?.role_type,
          status: data._data?.status,
        }),
      );
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setMessage(
        error.response?.data?._message ||
          "Unable to login. Please check your credentials and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand">
          <span className="login-brand-mark">
            <FiShield />
          </span>
          <span>Quiz Nova</span>
        </div>

        <div className="login-intro">
          <p>ADMIN WORKSPACE</p>
          <h1 id="login-title">Welcome back</h1>
          <span>Sign in to manage your Quiz Nova learning platform.</span>
        </div>

        <form className="login-form" noValidate onSubmit={handleSubmit}>
          <label className="login-field" htmlFor="admin-email">
            <span>Admin Email</span>
            <div
              className={errors.email ? "login-input has-error" : "login-input"}
            >
              <FiMail />
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="admin@example.com"
                value={values.email}
                onChange={handleChange}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "admin-email-error" : undefined
                }
              />
            </div>
            {errors.email && (
              <small id="admin-email-error">{errors.email}</small>
            )}
          </label>

          <label className="login-field" htmlFor="admin-password">
            <span>Admin Password</span>
            <div
              className={
                errors.password ? "login-input has-error" : "login-input"
              }
            >
              <FiLock />
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={values.password}
                onChange={handleChange}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "admin-password-error" : undefined
                }
              />
            </div>
            {errors.password && (
              <small id="admin-password-error">{errors.password}</small>
            )}
          </label>

          {message && (
            <p className="login-message" role="alert">
              {message}
            </p>
          )}

          <button className="login-submit" type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}
