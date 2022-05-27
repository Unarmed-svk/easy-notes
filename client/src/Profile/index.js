import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Collapse, Container, Link, Typography } from "@mui/material";
import { clearNotification } from "../store/actions";
import { patchUserPassword, patchUserProfile } from "../store/actions/user.action";
import EasyAccordion from "../Common/EasyAccordion";
import { DetailsChangeForm, PasswordChangeForm } from "./UserProfileForms";
import { ArrowBack } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import PageTitle from "../Common/PageTitle";

const styles = {
  formTitle: css`
    font-weight: bold;
    margin-top: 12px;
    margin-bottom: 25px;

    & .MuiLink-root {
      display: inline-block;
      line-height: 1;
    }

    & .MuiSvgIcon-root {
      display: inline-block;
      line-height: 1;
      vertical-align: top;
    }
  `,
  formsContainer: css`
    box-sizing: border-box;
    max-width: 40rem;
    margin: 0 4rem;
    padding: 0 2.5rem 2.5rem;
  `,
  accordion: css`
    border-bottom: none;
    &:before {
      display: none;
    }
    & .MuiAccordionDetails-root {
      padding: 1.25rem 4rem 2rem 4rem;
    }
  `,
  notificationContainer: css`
    margin-bottom: 0.8rem;
    min-height: 3em;
  `,
};

const Profile = () => {
  const notification = useSelector((state) => state.notification);
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFormState, setActiveFormState] = useState({});

  const handleSubmitStart = (e, formID) => {
    console.log(`Submission of ${formID} started`);
    setIsLoading(true);
  };

  const handleSubmit = (formID, formData) => {
    // console.log(`Form ${formID} was submitted`, formData);

    switch (formID) {
      case "details":
        dispatch(patchUserProfile(formData));
        break;
      case "password":
        dispatch(patchUserPassword(formData));
        break;
    }

    setIsLoading(false);
  };

  const handleFormChange = (formID, formData) => setActiveFormState(formData);

  const handleChange = (panelId, event, isExpanded) => setIsExpanded(isExpanded ? panelId : false);

  useEffect(() => {
    if (notification.success) {
    } else if (notification.error) {
      console.error(notification.message);
    }
    return () => {
      if (notification.error || notification.success) {
        dispatch(clearNotification());
      }
    };
  }, [notification, dispatch]);

  useEffect(() => {
    if (notification.error || notification.success) {
      dispatch(clearNotification());
    }
  }, [activeFormState, dispatch]);

  return (
    <Container>
      {/* <Typography variant="h4" component="h3" sx={styles.formTitle}>
        <Link color="secondary" underline="none" component={RouterLink} to="/">
          <ArrowBack sx={{ fontSize: "inherit" }} />
        </Link>
        &nbsp; Edit Profile
      </Typography> */}

      <PageTitle title="Edit Profile" linkTo="/" />

      <div css={styles.formsContainer}>
        <div css={styles.notificationContainer}>
          <Collapse in={notification.error || notification.success}>
            <Alert
              variant="filled"
              severity={notification.error ? "error" : "success"}
              onClose={() => dispatch(clearNotification())}
            >
              {notification && notification.message}
            </Alert>
          </Collapse>
        </div>

        <EasyAccordion
          id="p1"
          expanded={isExpanded === "p1"}
          summary="Edit Profile"
          accordionSx={styles.accordion}
          onChange={handleChange}
        >
          <DetailsChangeForm
            formID="details"
            disableForm={isLoading}
            initialValues={user}
            onSubmitStart={handleSubmitStart}
            onSubmit={handleSubmit}
            onChange={handleFormChange}
          />
        </EasyAccordion>
        <EasyAccordion
          id="p2"
          expanded={isExpanded === "p2"}
          summary="Change Password"
          accordionSx={styles.accordion}
          onChange={handleChange}
        >
          <PasswordChangeForm
            formID="password"
            disableForm={isLoading}
            onSubmitStart={handleSubmitStart}
            onSubmit={handleSubmit}
            onChange={handleFormChange}
          />
        </EasyAccordion>
      </div>
    </Container>
  );
};

export default Profile;