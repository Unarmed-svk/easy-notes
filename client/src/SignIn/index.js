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
  email: "",
  password: "",
  confirmPassword: "",
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
  confirmPassword: Yup.string()
    .required("Zopakujte heslo")
    .oneOf([Yup.ref("password"), null], "Heslá nie sú zhodné"),
  firstname: Yup.string().max(64, "Meno nesmie presahovať 64 znakov"),
  lastname: Yup.string().max(64, "Priezvysko nesmie presahovať 64 znakov"),
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
      min-height: 100vh;
      padding-top: 1.5rem;
      padding-bottom: 1.5rem;
    `,
    logo: css`
      ${theme.breakpoints.down("sm")} {
        font-size: ${theme.typography.h3.fontSize};
      }
    `,
    formContainer: css`
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      min-height: 100%;
      margin: 18vh 0 10rem;
    `,
    form: css`
      min-width: 26rem;
      min-height: 35rem;
      & .fields-padding {
        padding-left: 3.4rem;
      }
      & .controls-padding {
        padding-left: 3.4rem;
      }
      ${theme.breakpoints.down("sm")} {
        min-width: 100%;
        & .fields-padding {
          padding-left: 2.4rem;
        }
        & .controls-padding {
          padding-left: 0rem;
        }
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
      row-gap: 0.8rem;
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
    confirmPass: css`
      display: flex;
      margin-top: ${theme.spacing(3.5)};
    `,
    iconSx: {
      color: "action.active",
      mr: { xs: 1.5, sm: 2.5 },
      my: { xs: 1.3, sm: 1.1 },
      fontSize: { xs: theme.typography.h5.fontSize, sm: theme.typography.h4.fontSize },
    },
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
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => setShouldSubmit(true), 700);
  };

  useEffect(() => {
    if (notification.success) {
      setTimeout(() => {
        navigate(`/`);
      }, 500);
      setIsLoading(false);
      setFormMessage(notification);
      dispatch(clearNotification());
    } else if (notification.error) {
      console.error(`There was an error! ${notification.message}`);
      setFormMessage(notification);
      setIsLoading(false);
      dispatch(clearNotification());
    }
  }, [notification, navigate, dispatch]);

  useEffect(() => {
    if (shouldSubmit) {
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
        <div>
          <Logo variant="h2" sx={styles.logo} />
        </div>
        <div css={styles.formContainer}>
          <form css={styles.form} onSubmit={handleSubmit}>
            <Typography
              variant="h5"
              component="h3"
              sx={styles.formHeadline}
              className="controls-padding"
            >
              {isRegister ? "Nový účet" : "Prihlásiť sa"}
            </Typography>
            <Stack direction="column" spacing={2.5}>
              <Collapse in={formMessage.error || formMessage.success} className="fields-padding">
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
                iconComponent={<Email fontSize="large" sx={styles.iconSx} />}
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
                iconComponent={<Key fontSize="large" sx={styles.iconSx} />}
                onChange={(e) => setInput({ password: e.target.value })}
                defaultValue={form.password}
                error={isError("password")}
                helperText={errors.password}
                disabled={isLoading}
              />
            </Stack>

            <Collapse in={isRegister} className="fields-padding">
              <DebouncedTextField
                required={isRegister}
                fullWidth
                id="confirmPassField"
                name="confirmPassField"
                label="Zopakovať heslo"
                color="primary"
                type="password"
                onChange={(e) => setInput({ confirmPassword: e.target.value })}
                defaultValue={form.confirmPassword}
                error={isError("confirmPassword")}
                helperText={errors.confirmPassword}
                disabled={isLoading}
                sx={styles.confirmPass}
              />
              <FormControl fullWidth sx={styles.detailsContainer}>
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
            </Collapse>

            <Stack
              direction={{ xs: "column-reverse", sm: "row" }}
              sx={styles.buttonWrapper}
              className="controls-padding"
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
