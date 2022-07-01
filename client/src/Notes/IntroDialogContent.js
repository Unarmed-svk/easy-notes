import { Container, Typography } from "@mui/material";
import React from "react";

const styles = {
  mainContainer: {
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    alignItems: "center",
    rowGap: 4,
    columnGap: 3.2,
    "& img": {
      maxWidth: { xs: "35%", sm: "20%" },
    },
    "& .email": {
      color: "secondary.dark",
    },
  },
};

const IntroDialogContent = ({ userEmail }) => {
  return (
    <Container maxWidth="sm" sx={styles.mainContainer}>
      <img src="/mail-open.svg" alt="Email icon" />
      <Typography>
        Na vašu emailovú adresu <span className="email">"{userEmail}"</span> bol zaslaný overovací
        email, ktorým môžete potrvrdiť svoj účet.
      </Typography>
    </Container>
  );
};

export default IntroDialogContent;
