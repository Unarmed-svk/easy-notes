import { FormControl, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { css } from "@emotion/react";
import React, { useEffect, useRef, useState } from "react";
import { wrapInt } from "../helpers/optimisations";
import { FILTER_TYPES } from "../helpers/consts";
import EasyButtons from "../Common/EasyButtons";

const filterOptions = {
  sortDate: [
    { name: "Date", value: FILTER_TYPES.NEWEST },
    { name: "Date", value: FILTER_TYPES.OLDEST },
  ],
  sortDeadline: [
    { name: "Deadline", value: FILTER_TYPES.CLOSEST },
    { name: "Deadline", value: FILTER_TYPES.FARTHEST },
  ],
  showOnly: [
    { name: "Active", value: FILTER_TYPES.ACTIVE },
    { name: "Completed", value: FILTER_TYPES.COMPLETED },
    { name: "Deleted", value: FILTER_TYPES.DELETED },
  ],
};

const styles = {
  title: {
    pb: "2px",
    fontSize: "1.25rem",
    color: "text.secondary",
    textTransform: "uppercase",
  },
  selectControl: css`
    min-width: 17ch;
  `,
  cycleButton: css`
    padding: 0.4rem 1rem;
    border-radius: 0.4rem;
  `,
  buttonItem: css`
    align-items: center;
    font-size: 1rem;
    text-transform: initial;

    & .MuiTypography-root {
      font-size: 1.15rem;
      font-weight: 800;
    }
    & .ButtonItem-icon {
      line-height: 1;
    }
  `,
};

const FiltersBar = ({ values, disabled, onChange, ...rest }) => {
  const renderOptions = (list) =>
    list.map((item) => (
      <MenuItem value={item.value} key={item.value}>
        {item.name}
      </MenuItem>
    ));

  const renderItems = (list) =>
    list.map((item, index) => (
      <ButtonItem
        value={item.value}
        key={item.value}
        icon={index < 1 ? <ArrowDropUp /> : <ArrowDropDown />}
      >
        {item.name}
      </ButtonItem>
    ));
  return (
    <Stack direction={{ md: "row" }} {...rest}>
      <ButtonCycle
        disabled={disabled}
        value={values.sortDate}
        offFocus={!values.sortDate}
        onChange={(newValue) => onChange({ type: "sortDate", payload: newValue })}
      >
        {renderItems(filterOptions.sortDate)}
      </ButtonCycle>

      <ButtonCycle
        disabled={disabled}
        value={values.sortDeadline}
        offFocus={!values.sortDeadline}
        onChange={(newValue) => onChange({ type: "sortDeadline", payload: newValue })}
      >
        {renderItems(filterOptions.sortDeadline)}
      </ButtonCycle>

      <FormControl sx={styles.selectControl} color="secondary">
        <InputLabel id="selectShowOnlyLabel">Show only</InputLabel>
        <Select
          disabled={disabled}
          labelId="selectShowOnlyLabel"
          label="Show only"
          id="showOnly"
          name="showOnly"
          variant="standard"
          value={values.showOnly}
          onChange={(e) => onChange({ type: "showOnly", payload: e.target.value })}
        >
          {renderOptions(filterOptions.showOnly)}
        </Select>
      </FormControl>
    </Stack>
  );
};

const ButtonItem = ({ children, icon, innerRef, ...rest }) => (
  <Stack
    sx={styles.buttonItem}
    direction="row"
    alignItems="start"
    spacing={1.5}
    ref={innerRef}
    {...rest}
  >
    <Typography>{children}</Typography>
    <span className="ButtonItem-icon">{icon}</span>
  </Stack>
);

const ButtonCycle = ({ children, value, offFocus, disabled, onChange }) => {
  const [childrenClone, setChildrenClone] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const childRefs = useRef([]);

  const handleClick = (e) => {
    const childCount = React.Children.count(children);
    if (childCount < 2) onChange(e.target.value);
    else {
      if (offFocus) {
        onChange(childrenClone[currentIndex].props.value);
        return;
      }
      const newIndex = wrapInt(currentIndex + 1, childCount);
      const newValue = childrenClone[newIndex].props.value;
      setCurrentIndex(newIndex);
      // console.log(`new index: ${newIndex}`, childrenClone);
      onChange(newValue);
    }
  };

  useEffect(() => {
    // console.log("BUTTON ITEM: value change");
    React.Children.forEach(children, (child, index) => {
      // console.log(`Looping value: ${child.props.value}, seeking: ${value}`);
      if (child.props.value === value) {
        setCurrentIndex(index);
      }
    });
    // if (!value) setCurrentIndex(0);
  }, [value]);

  useEffect(() => {
    setChildrenClone(
      React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          innerRef: (element) => (childRefs.current[index] = element),
        })
      )
    );
  }, [children]);

  const renderChild = () => (
    <EasyButtons.Text
      disabled={disabled}
      color={value ? "secondary" : "neutral"}
      sx={styles.cycleButton}
      onClick={handleClick}
    >
      {childrenClone.length > 0 ? childrenClone[currentIndex] : null}
    </EasyButtons.Text>
  );

  return renderChild();
};

export default FiltersBar;
