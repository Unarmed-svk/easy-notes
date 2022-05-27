import {
  Alert,
  Collapse,
  Container,
  FormControl,
  FormLabel,
  Stack,
  Typography,
} from "@mui/material";
import { css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import Logo from "../Common/Logo";
import { Email, Key } from "@mui/icons-material";
import { DebouncedIconField } from "../Common/EasyIconField";
import { DebouncedTextField } from "../Common/EasyTextField";
import EasyButtons from "../Common/EasyButtons";
import * as Yup from "yup";
import useValidation from "../helpers/useValidation";
import { userLogin, userRegister } from "../store/actions/user.action";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearNotification } from "../store/actions";

const initialFormValues = {
  email: "test@gmail.com",
  password: "test12345",
  firstname: "",
  lastname: "",
};

const registerSchema = Yup.object().shape({
  email: Yup.string()
    .email("Prosím zadajte platnú emailovú adresu")
    .required("Email je povinný údaj"),
  password: Yup.string()
    .required("Heslo je povinný údaj")
    .min(8, "Heslo musí mať aspoň 8 znakov")
    .max(32, "Heslo nesmie mať viac ako 32 znakov"),
  firstname: Yup.string(),
  lastname: Yup.string(),
});

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Prosím zadajte platný email").required("Prosím zadajte svoj email"),
  password: Yup.string().required("Prosím zadajte svoje heslo"),
});

const SignIn = ({ theme }) => {
  const styles = {
    root: css`
      min-height: 100vh;
      background-color: #f9f9f9;
    `,
    container: css`
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      padding: 2rem 1rem;
    `,
    logoWrapper: css`
      position: absolute;
      left: 2rem;
      top: 1rem;
    `,
    formContainer: css`
      box-sizing: border-box;
      min-width: 28rem;
      margin: 4rem auto 10rem;
    `,
    form: css`
      & .icon-padding {
        padding-left: 3.4rem;
      }
    `,
    formHeadline: css`
      margin-bottom: 1.6rem;
      color: ${theme.palette.text.primary};
      font-weight: bold;
      text-align: center;
    `,
    alert: css``,
    buttonWrapper: css`
      justify-content: space-around;
      text-align: center;
      margin-top: 2.2rem;
    `,
    formButton: css`
      padding: 0.45rem 2rem;
      border-radius: 1rem;
      font-size: 1rem;
      font-weight: bold;
    `,
    detailsContainer: css`
      box-sizing: border-box;
      margin-top: 1.8rem;

      & > .MuiFormLabel-root {
        margin-bottom: 1rem;
        font-size: 0.9rem;
        text-align: center;
        text-transform: uppercase;
      }
    `,
  };

  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [formMessage, setFormMessage] = useState({});
  const [form, setForm] = useState(initialFormValues);
  const { errors, isValid } = useValidation(form, isRegister ? registerSchema : loginSchema);

  const toggleFormType = () => setIsRegister(!isRegister);
  const setInput = (newValue) => {
    setForm((form) => ({ ...form, ...newValue }));
  };
  const isError = (value) => errors[value] !== undefined;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setShouldSubmit(true), 700);
  };

  useEffect(() => {
    if (notification.success) {
      setTimeout(() => {
        navigate("../");
      }, 1000);
      setFormMessage(notification);
      dispatch(clearNotification());
    } else if (notification.error) {
      console.error(`There was an error! ${notification.message}`);
      setFormMessage(notification);
      dispatch(clearNotification());
    }
  }, [notification, navigate, dispatch]);

  useEffect(() => {
    if (shouldSubmit) {
      setIsLoading(false);
      setShouldSubmit(false);
      dispatch(isRegister ? userRegister(form) : userLogin(form));
    }
    if (formMessage.error || formMessage.success) {
      setFormMessage({});
    }
  }, [form.email, form.password, isRegister, shouldSubmit, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearNotification());
    };
  }, [dispatch]);

  return (
    <div css={styles.root}>
      <Container sx={styles.container}>
        <div css={styles.logoWrapper}>
          <Logo variant="h2" textAlign="left" />
        </div>
        <div css={styles.formContainer}>
          <form css={styles.form} onSubmit={handleSubmit}>
            <Typography
              variant="h5"
              component="h3"
              sx={styles.formHeadline}
              className="icon-padding"
            >
              {isRegister ? "Nový účet" : "Prihlásiť sa"}
            </Typography>
            <Stack direction="column" spacing={2.5}>
              <Collapse in={formMessage.error || formMessage.success} className="icon-padding">
                <Alert
                  variant="filled"
                  severity={formMessage.error ? "error" : "success"}
                  sx={styles.alert}
                >
                  {formMessage.message}
                </Alert>
              </Collapse>
              <DebouncedIconField
                required
                id="emailField"
                name="emailField"
                label="Email užívateľa"
                color="primary"
                iconComponent={
                  <Email fontSize="large" sx={{ color: "action.active", mr: 2.5, my: 1.1 }} />
                }
                onChange={(e) => setInput({ email: e.target.value })}
                defaultValue={form.email}
                error={isError("email")}
                helperText={errors.email}
                disabled={isLoading}
              />
              <DebouncedIconField
                required
                id="passwordField"
                name="passwordField"
                label="Heslo užívateľa"
                color="primary"
                type="password"
                autoComplete="current-password"
                iconComponent={
                  <Key fontSize="large" sx={{ color: "action.active", mr: 2.5, my: 1.1 }} />
                }
                onChange={(e) => setInput({ password: e.target.value })}
                defaultValue={form.password}
                error={isError("password")}
                helperText={errors.password}
                disabled={isLoading}
              />
            </Stack>

            {isRegister && (
              <FormControl fullWidth sx={styles.detailsContainer} className="icon-padding">
                <FormLabel>Doplňujúce údaje</FormLabel>
                <Stack direction="column" spacing={2.5} alignContent={"stretch"}>
                  <DebouncedTextField
                    id="nameField"
                    name="nameField"
                    label="Meno"
                    color="primary"
                    onChange={(e) => setInput({ firstname: e.target.value })}
                    defaultValue={form.firstname}
                  />
                  <DebouncedTextField
                    id="lastNameField"
                    name="lastNameField"
                    label="Priezvysko"
                    color="primary"
                    onChange={(e) => setInput({ lastname: e.target.value })}
                    defaultValue={form.lastname}
                  />
                </Stack>
              </FormControl>
            )}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              sx={styles.buttonWrapper}
              className="icon-padding"
            >
              <EasyButtons.Outlined color="secondary" onClick={toggleFormType} disabled={isLoading}>
                {isRegister ? "Prihlásenie" : "Nový účet"}
              </EasyButtons.Outlined>
              <EasyButtons.Loading
                type="submit"
                color="primary"
                loading={isLoading}
                disabled={!isValid || isLoading}
              >
                {isRegister ? "Založiť účet" : "Prihlásiť sa"}
              </EasyButtons.Loading>
            </Stack>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default SignIn;
