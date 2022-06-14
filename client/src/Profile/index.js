import { css } from "@emotion/react";
import { Alert, Collapse, Container, Link, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EasyAccordion from "../Common/EasyAccordion";
import EasyButtons from "../Common/EasyButtons";
import PageTitle from "../Common/PageTitle";
import { clearNotification } from "../store/actions";
import { patchUserPassword, patchUserProfile } from "../store/actions/user.action";
import { DetailsChangeForm, PasswordChangeForm } from "./UserProfileForms";
import { DeleteOutlined, Logout } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

const Profile = ({ theme }) => {
  const styles = {
    formsContainer: css`
      box-sizing: border-box;
      min-height: 500px;
      max-width: 40rem;
      margin-left: 4rem;
      padding: 0 2.5rem 5rem;

      ${theme.breakpoints.down("md")} {
        margin: 0 auto;
      }
      ${theme.breakpoints.down("sm")} {
        padding-left: 0;
        padding-right: 0;
      }
    `,
    accordion: css`
      border-bottom: none;

      & .MuiAccordionDetails-root {
        padding: 1.25rem 4rem 2rem 4rem;
      }

      ${theme.breakpoints.down("sm")} {
        & .MuiAccordionDetails-root {
          padding-left: 0;
          padding-right: 0;
        }
      }
    `,
    notificationContainer: css`
      margin-bottom: 0.8rem;
      min-height: 3em;
    `,
    buttonsContainer: css`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      max-width: 40rem;
      margin-left: 4rem;
    `,
  };

  const notification = useSelector((state) => state.notification);
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFormState, setActiveFormState] = useState({});

  const handleSubmitStart = (e, formID) => {
    // console.log(`Submission of ${formID} started`);
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
    <Container sx={{ minHeight: "100%" }}>
      <PageTitle title="Edit Profile" linkTo="/" />

      {/* TODO: Maybe add some user statistics at the top */}

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
          className="FirstAccordion"
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
        {/* TODO: Add Change Email form and Delete Account form */}
      </div>

      <Stack sx={styles.buttonsContainer}>
        <Link to="/signout" underline="none" component={RouterLink}>
          <EasyButtons.Outlined color="secondary" startIcon={<Logout />}>
            Sign out
          </EasyButtons.Outlined>
        </Link>

        {/* TODO: Make a RouterLink with delete accout parameter  */}

        <EasyButtons.Text color="error" startIcon={<DeleteOutlined />}>
          Delete Account
        </EasyButtons.Text>
      </Stack>
    </Container>
  );
};

export default Profile;
