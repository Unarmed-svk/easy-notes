import ExpandMoreIcon from "@mui/icons-material/ExpandMoreRounded";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { css, useTheme } from "@emotion/react";
import React from "react";

const EasyAccordion = ({ children, expanded, id, summary, accordionSx, onChange }) => {
  const theme = useTheme();
  const styles = {
    acc: css`
      background-color: transparent;
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
