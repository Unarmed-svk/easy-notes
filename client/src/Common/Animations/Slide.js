import React from "react";
import { motion } from "framer-motion";
import { transitions } from "../../helpers/consts";

const Slide = ({ children, start, exit, className }) => {
  const states = {
    hidden: {
      x: start.x || 0,
      y: start.y || 0,
    },
    enter: {
      x: 0,
      y: 0,
      transition: {
        duration: 0.35,
        ease: transitions.easeOut,
      },
    },
    exit: {
      x: exit.x || 0,
      y: exit.y || 0,
      transition: {
        duration: 0.25,
        ease: transitions.easeIn,
      },
    },
  };

  return (
    <motion.div
      className={className || ""}
      initial={states.hidden}
      animate={states.enter}
      exit={states.exit}
    >
      {children}
    </motion.div>
  );
};

export default Slide;
