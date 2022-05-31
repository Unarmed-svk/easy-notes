import { Event, KeyboardArrowRight, TimerOffOutlined, TimerOutlined } from "@mui/icons-material";
import {
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
  FormHelperText,
  Link,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import EasyButtons from "../Common/EasyButtons";
import { DebouncedTextField } from "../Common/EasyTextField";
import useValidation from "../helpers/useValidation";
import { createNote } from "../store/actions/note.actions";
import { clearNotification } from "../store/actions";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { toDateOnlyFormat } from "../helpers/optimisations";
import PageTitle from "../Common/PageTitle";

const initialValues = {
  title: "",
  description: "",
  deadline: null,
  category: 0,
};

const noteSchema = Yup.object().shape({
  title: Yup.string().required("Názov je povinný").max(70, "Názov nesmie mať viac ako 70 znakov"),
  description: Yup.string().max(300, "Popis nesmie mať viac ako 300 znakov"),
  category: Yup.number().min(0, "Chybná kategória").max(50, "Chybná kategória"),
});

const Create = ({ theme }) => {
  const styles = {
    btn: css``,
    title: css`
      color: ${theme.palette.grey[800]};
      font-weight: ${theme.typography.fontWeightBold};
      margin-top: 12px;
      margin-bottom: 25px;
    `,
    field: css`
      margin: 1.3rem 0 1.8rem;
    `,
    category: css`
      margin: 1.3rem 0 1.8rem;
      align-items: start;
    `,
    deadlineBtn: css`
      margin-right: 1.2rem;
      padding: 0.3rem 0.75rem;
      border-radius: 99px;
      font-size: ${theme.typography.button.fontSize};
    `,
    deadlineLink: css`
      display: inline-flex;
      align-items: start;
      column-gap: 0.5rem;
      margin-top: 0.4rem;
      color: ${theme.palette.grey[800]};
    `,
    radioGroup: css`
      & .MuiFormControlLabel-root {
        margin-right: 0rem;
        padding-right: 1.5rem;
      }
    `,
    alert: css`
      min-width: 32ch;
    `,
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState(initialValues);
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(null);
  const { errors, isValid } = useValidation(form, noteSchema);

  const setInput = (newValue) => {
    setForm((form) => ({ ...form, ...newValue }));
  };
  const isError = (value) => errors[value] !== undefined;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setShouldSubmit(true), 700);
  };

  const handleDeadlineChange = (newVal) => {
    // console.log(`DEADLINE CHANGE ${newVal}`);
    setCurrentDate(newVal);
  };

  const handleDeadlineAccept = (newVal) => {
    // console.log(`DEADLINE ACCEPT ${newVal}`);
    setInput({ deadline: newVal });
  };

  const handleDeadlineClick = () => {
    if (form.deadline === null) setIsDateOpen(true);
    else clearDeadline();
  };

  const clearDeadline = () => {
    setInput({ deadline: null });
    setCurrentDate("");
  };

  const renderDeadlineButton = () => {
    const hasDeadline = form.deadline !== null;

    return (
      <EasyButtons.Outlined
        sx={styles.deadlineBtn}
        color={hasDeadline ? "error" : "secondary"}
        startIcon={hasDeadline ? <TimerOffOutlined /> : <TimerOutlined />}
        onClick={handleDeadlineClick}
      >
        {hasDeadline ? "Zrušiť termín" : "Nastaviť termín"}
      </EasyButtons.Outlined>
    );
  };

  const renderDateInput = (params) => {
    const { value } = params.inputProps;
    // console.log(params);
    if (form.deadline !== null)
      return (
        <Link
          href="#"
          underline="hover"
          variant="button"
          sx={styles.deadlineLink}
          onClick={() => setIsDateOpen(true)}
        >
          {value}
          <Event />
        </Link>
      );
    else return null;
  };

  useEffect(() => {
    if (notification.success) {
      navigate("/");
    } else if (notification.error) {
      console.error(`Boo: ${notification.message}`);
    }
    return () => {
      if (notification.error || notification.success) {
        dispatch(clearNotification());
      }
    };
  }, [notification, dispatch]);

  useEffect(() => {
    if (shouldSubmit) {
      setIsLoading(false);
      setShouldSubmit(false);
      const convertedForm = {
        ...form,
        deadline: form.deadline ? toDateOnlyFormat(form.deadline) : undefined,
      };
      // console.log(convertedForm);
      dispatch(createNote(convertedForm));
    }
    if (notification.error || notification.success) dispatch(clearNotification());
  }, [shouldSubmit, form, dispatch]);

  return (
    <Container>
      <PageTitle title="Nová Poznámka" linkTo="/" />

      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <DebouncedTextField
          fullWidth
          required
          key="titleField"
          id="titleField"
          name="titleField"
          label="Názov Poznámky"
          color="primary"
          sx={styles.field}
          onChange={(e) => setInput({ title: e.target.value })}
          defaultValue={form.title}
          error={isError("title")}
          helperText={errors.title}
          disabled={isLoading}
        />

        <DebouncedTextField
          fullWidth
          multiline
          rows={4}
          key="descriptionField"
          id="descriptionField"
          name="descriptionField"
          label="Podrobnosti"
          color="primary"
          sx={styles.field}
          onChange={(e) => setInput({ description: e.target.value })}
          defaultValue={form.description}
          error={isError("description")}
          helperText={errors.description}
          disabled={isLoading}
        />

        {renderDeadlineButton()}

        <MobileDatePicker
          open={isDateOpen}
          clearable={true}
          disablePast
          label="Termín"
          value={currentDate}
          cancelText="Zavrieť"
          clearText="Zmazať"
          renderInput={renderDateInput}
          onChange={handleDeadlineChange}
          onClose={() => setIsDateOpen(false)}
          onAccept={handleDeadlineAccept}
        />

        <FormControl
          sx={styles.category}
          fullWidth
          error={isError("category")}
          disabled={isLoading}
        >
          <FormLabel color="primary">Kategória Poznámky</FormLabel>
          <RadioGroup
            key="categoryField"
            id="categoryField"
            name="categoryField"
            sx={styles.radioGroup}
            onChange={(e) => setInput({ category: Number.parseInt(e.target.value) })}
            value={form.category}
          >
            <FormControlLabel control={<Radio color="primary" />} value="0" label="Úlohy" />
            <FormControlLabel control={<Radio color="primary" />} value="1" label="Pripomienky" />
            <FormControlLabel control={<Radio color="primary" />} value="2" label="Financie" />
            <FormControlLabel control={<Radio color="primary" />} value="3" label="Práca" />
          </RadioGroup>
          <FormHelperText>{errors.category}</FormHelperText>
        </FormControl>

        <EasyButtons.Loading
          type="submit"
          color="primary"
          endIcon={<KeyboardArrowRight />}
          sx={css`
            padding-left: 1.2rem;
            padding-right: 1.2rem;
          `}
          disabled={isLoading || !isValid}
        >
          Vytvoriť
        </EasyButtons.Loading>
      </form>
    </Container>
  );
};

export default Create;
