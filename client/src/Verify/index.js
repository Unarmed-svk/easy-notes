import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";
import { Container, Link, Typography } from "@mui/material";
import Logo from "../Common/Logo";
import { DebouncedIconField } from "../Common/EasyIconField";
import { CheckCircleOutlineRounded as CheckCircle, Email, ExitToApp } from "@mui/icons-material";
import EasyButtons from "../Common/EasyButtons";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyUserAccount } from "../store/actions/user.action";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { Link as RouterLink } from "react-router-dom";

const Verify = ({ theme }) => {
  const style = css`
    min-height: 100vh;
    background-color: #f9f9f9;

    .MuiContainer-root {
      padding-top: 1.5rem;
      padding-bottom: 1.5rem;
    }
    .Verify-form,
    .Verify-success {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      min-height: 100%;
      max-width: ${theme.breakpoints.values.sm}px;
      margin: 18vh auto 10rem;
    }
    .Verify-title {
      margin-bottom: 1.6rem;
      font-weight: bold;
      text-align: center;
    }
    .EasyIconField-root {
      margin-bottom: 3.5rem;
    }
    .Verify-submit {
      text-align: center;
    }
    .MuiLoadingButton-root {
    }

    .Verify-success {
      align-items: center;
      text-align: center;
    }

    .Verify-success .Verify-title {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      column-gap: 0.8ch;
      margin-bottom: 4.5rem;
    }

    .fade-enter {
      opacity: 0;
    }
    .fade-enter-active {
      opacity: 1;
      transition: opacity 200ms;
    }
    .fade-exit {
      opacity: 1;
    }
    .fade-exit-active {
      opacity: 0;
      transition: opacity 200ms;
    }
  `;
  const iconSx = {
    color: "action.active",
    mr: { xs: 1.5, sm: 2.5 },
    my: { xs: 1.3, sm: 1.1 },
    fontSize: { xs: theme.typography.h5.fontSize, sm: theme.typography.h4.fontSize },
  };

  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSuccess) return;

    setIsLoading(true);
    dispatch(verifyUserAccount(token));
  };

  useEffect(() => {
    setToken(searchParams.get("validation"));
  }, [searchParams]);

  useEffect(() => {
    if (notification.success) {
      setIsSuccess(true);
      setIsLoading(false);
    } else if (notification.error) {
      console.error(notification.message);
      setIsLoading(false);
    }
  }, [notification]);

  return (
    <div css={style}>
      <Container>
        <Logo variant="h2" />

        <SwitchTransition mode="out-in">
          {!isSuccess ? (
            <CSSTransition key="form" classNames="fade" timeout={{ enter: 200, exit: 500 }}>
              <form className="Verify-form" onSubmit={handleSubmit}>
                <Typography
                  variant="h5"
                  component="h3"
                  color="text.primary"
                  className="Verify-title"
                >
                  Overiť emailovú adresu
                </Typography>
                <DebouncedIconField
                  required
                  key={token ? "init" : "empty"}
                  id="token"
                  name="token"
                  label="Overovací token"
                  color="primary"
                  iconComponent={<Email fontSize="large" sx={iconSx} />}
                  onChange={(e) => setToken(e.target.value)}
                  defaultValue={token}
                  disabled={isLoading}
                />
                <div className="Verify-submit">
                  <EasyButtons.Loading
                    type="submit"
                    color="primary"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    Overiť
                  </EasyButtons.Loading>
                </div>
              </form>
            </CSSTransition>
          ) : (
            <CSSTransition key="success" classNames="fade" timeout={{ enter: 400, exit: 500 }}>
              <div className="Verify-success">
                <Typography variant="h4" component="h3" color="primary" className="Verify-title">
                  <CheckCircle sx={{ fontSize: "2.6rem" }} /> Váš účet bol overený
                </Typography>

                <Link to={!isLoading ? "/" : ""} component={RouterLink}>
                  <EasyButtons.Contained
                    type="button"
                    color="primary"
                    disabled={isLoading}
                    endIcon={<ExitToApp />}
                  >
                    Vstúpiť do aplikácie
                  </EasyButtons.Contained>
                </Link>
              </div>
            </CSSTransition>
          )}
        </SwitchTransition>
      </Container>
    </div>
  );
};

export default Verify;
