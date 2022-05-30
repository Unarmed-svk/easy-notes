import ExpandMoreIcon from "@mui/icons-material/ExpandMoreRounded";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { css, useTheme } from "@emotion/react";
import React from "react";

const EasyAccordion = ({ children, expanded, id, summary, accordionSx, onChange, ...rest }) => {
  const theme = useTheme();
  const styles = {
    acc: css`
      background-color: transparent;

      &:before {
        display: none;
      }
      &:after {
        position: absolute;
        bottom: 1px;
        left: 0;
        right: 0;
        height: 1px;
        content: "";
        opacity: 0;
        background-color: ${theme.palette.divider};
        transition: opacity 150ms ${theme.transitions.easing.easeInOut};
        transition-delay: 180ms;
      }
      &.Mui-expanded::after {
        opacity: 1;
        transition-delay: 0ms;
      }
    `,
    accSummary: css`
      flex-direction: row-reverse;

      & .MuiAccordionSummary-expandIconWrapper {
        color: ${theme.palette.text.primary};
        transform: rotate(-90deg);
      }
      & .MuiAccordionSummary-expandIconWrapper.Mui-expanded {
        transform: rotate(0deg);
      }

      & .MuiAccordionSummary-content {
        margin: ${theme.spacing(2)} 0 ${theme.spacing(2)} ${theme.spacing(1.2)};
      }
      & .MuiAccordionSummary-content .MuiTypography-root {
      }

      ${theme.breakpoints.down("sm")} {
        padding-left: 0;
        padding-right: 0;
      }
    `,
  };

  return (
    <Accordion
      expanded={expanded}
      disableGutters
      elevation={0}
      sx={css`
        ${styles.acc}
        ${accordionSx}
      `}
      onChange={(...params) => onChange(id, ...params)}
      {...rest}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ fontSize: "1.75rem" }} />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
        sx={styles.accSummary}
      >
        <Typography variant="h6">{summary}</Typography>
      </AccordionSummary>

      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};

export default EasyAccordion;
