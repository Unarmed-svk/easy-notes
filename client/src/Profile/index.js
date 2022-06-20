import { css } from "@emotion/react";
import { DeleteOutlined, Logout } from "@mui/icons-material";
import { Alert, Collapse, Container, Link, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import EasyAccordion from "../Common/EasyAccordion";
import EasyButtons from "../Common/EasyButtons";
import PageTitle from "../Common/PageTitle";
import { clearNotification } from "../store/actions";
import {
  deleteUserAccount,
  patchUserPassword,
  patchUserProfile,
} from "../store/actions/user.action";
import { DeleteConfirmDialog, DetailsChangeForm, PasswordChangeForm } from "./UserProfileForms";

const Profile = ({ theme }) => {
  const styles = {
    mainContainer: css`
      position: relative;
      min-height: 100%;
      padding-bottom: 6rem;

      & .FormsContainer {
        box-sizing: border-box;
        min-height: 500px;
        max-width: 40rem;
        margin: 0 auto;
        padding-bottom: 5rem;
      }

      & .ButtonsContainer {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        row-gap: 1.2rem;
        column-gap: 1rem;
      }

      .MuiModal-root .MuiDialogContent-root #easy-dialog-description {
        color: #f00 !important;
      }
      ${theme.breakpoints.up("xl")} {
        padding-bottom: 10rem;
        & .FormsContainer {
          margin-left: 4rem;
        }
        & .ButtonsContainer {
          padding-bottom: 8rem;
        }
      }
      ${theme.breakpoints.up("sm")} {
        & .FormsContainer {
          padding-left: 2.5rem;
          padding-right: 2.5rem;
        }
        & .ButtonsContainer {
          padding: 0 4rem;
        }
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
  };

  const [searchParams, setSearchParams] = useSearchParams();
  // console.log(searchParams);
  const notification = useSelector((state) => state.notification);
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFormState, setActiveFormState] = useState({});

  const handleSubmitStart = () => setIsLoading(true);

  const handleSubmit = (formID, formData) => {
    switch (formID) {
      case "details":
        dispatch(patchUserProfile(formData));
        break;
      case "password":
        dispatch(patchUserPassword(formData));
        break;
      case "deletePermanently":
        dispatch(deleteUserAccount(formData));
        break;
      default:
        console.error(`Incorrect formID: ${formID} in Profile submit handler`);
    }

    setIsLoading(false);
  };

  const handleFormChange = (formID, formData) => setActiveFormState(formData);

  const handleChange = (panelId, event, isExpanded) => setIsExpanded(isExpanded ? panelId : false);

  const handleCloseDialog = () => {
    setSearchParams({});
  };

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
    <Container sx={styles.mainContainer}>
      <PageTitle title="Edit Profile" linkTo="/" />

      {/* TODO: Maybe add some user statistics at the top */}

      <div className="FormsContainer">
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
        {/* TODO: Add Change Email form */}
      </div>
      <Stack
        className="ButtonsContainer"
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "center", sm: "start" }}
      >
        <Link to="/signout" underline="none" component={RouterLink}>
          <EasyButtons.Outlined color="secondary" startIcon={<Logout />}>
            Sign out
          </EasyButtons.Outlined>
        </Link>
        <Link to="?delete=true" underline="none" component={RouterLink}>
          <EasyButtons.Text color="error" startIcon={<DeleteOutlined />}>
            Delete Account
          </EasyButtons.Text>
        </Link>
      </Stack>

      <DeleteConfirmDialog
        formID="deletePermanently"
        isOpen={searchParams.get("delete") === "true"}
        onClose={handleCloseDialog}
        isDisabled={isLoading}
        onSubmitStart={handleSubmitStart}
        onSubmit={handleSubmit}
        onChange={handleFormChange}
      />
    </Container>
  );
};

export default Profile;
