import { useCallback, useEffect, useState } from "react";
import { ValidationError } from "yup";

const useValidation = (values, schema) => {
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const validate = useCallback(async () => {
    try {
      await schema.validate(values, { abortEarly: false });
      setErrors({});
      setIsValid(true);
    } catch (err) {
      if (err instanceof ValidationError) {
        const validationErrors = {};
        err.inner.forEach((item) => {
          validationErrors[item.path] = item.message;
        });
        setErrors(validationErrors);
        setIsValid(false);
      }
    }
  }, [values, schema]);

  useEffect(() => {
    validate();
  }, [validate]);

  return { errors, isValid };
};

export default useValidation;
