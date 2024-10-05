import { useState, ChangeEvent, FormEvent } from "react";
import authPortalStyle from "../../styles/authPortal.module.css";
import { useSignIn } from "../../hooks/auth";

// Define the type for the form data
interface FormData {
  username: string;
  password: string;
}

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const { loading, error, success, handleSignIn } = useSignIn();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { username, password } = formData;

      if (username && password) {
        await handleSignIn(formData);
      } else {
        window.alert("pleaseFillFields");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={authPortalStyle.authPortal}>
      <h1 className="mb-5 font-semibold text-5xl italic">{"loginTitle"}</h1>

      <form onSubmit={handleSubmit}>
        <div className={authPortalStyle.inputContainer}>
          <label htmlFor="username">{"usernamePlaceholder"}</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder={"usernamePlaceholder"}
          />
        </div>

        <div className={authPortalStyle.inputContainer}>
          <label htmlFor="password">{"passwordPlaceholder"}</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={"passwordPlaceholder"}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading || success}
            className="btn-secondary"
          >
            {"loginButton"}
          </button>
        </div>
        {error && (
          <p className="text-red-500 mx-auto text-center">{error.message}</p>
        )}
      </form>
    </div>
  );
};

export default SignIn;
