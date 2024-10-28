import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SignInProps } from "../types";
import { CustomError } from "../utils/CustomError";
import { authUser, signIn } from "../services/auth";
import { RootState } from "../store/store";
import { signIn as signInRed } from "../store/slices/authSlice";
import { translations } from "../components/lang/translations";

export const useSignIn = (
  currentLang: "en" | "de",
  getCurrentLanguageTranslations: () => (typeof translations)["en"]
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const routeTo = useNavigate();
  const dispatch = useDispatch();
  const handleSignIn = async (data: SignInProps) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const user = await signIn(
        data,
        currentLang,
        getCurrentLanguageTranslations
      );
      setSuccess(true);
      localStorage.setItem("userData", JSON.stringify(user));
      dispatch(signInRed({ ...user }));
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof CustomError) {
        if (err.errors) {
          setError(err.errors);
        } else {
          setError({
            message: err.message,
          });
        }
      } else {
        setError({
          message: "An unknown error occurred.",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        routeTo("/");
      }, 1000);
    }
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }, [error, success, routeTo]);

  return { handleSignIn, loading, error, success };
};

export const useAuthUser = () => {
  const routeTo = useNavigate();
  const pathName = useLocation();

  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth); // Adjust based on your state structure

  const handleSignIn = useCallback(async () => {
    try {
      const user = await authUser();
      localStorage.setItem("userData", JSON.stringify(user));

      dispatch(signInRed({ ...user }));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
      localStorage.removeItem("userData");
      if (pathName.pathname.startsWith("/")) {
        routeTo("/signin");
      }
    }
  }, [dispatch, routeTo]);

  useEffect(() => {
    const isAuthPage = pathName.pathname.startsWith("/");

    if (isAuthPage && !user.id) {
      handleSignIn();
    }
  }, [handleSignIn, pathName, user]);

  return { handleSignIn };
};
