import { useState, useCallback, useRef } from "react";

const isEmpty = (obj) => {
  if (!obj) return true;
  return !Object.keys(obj).length;
};

const useForm = ({ initialData = {}, schema, reValidateOn = "onChange" }) => {
  const [formData, setFormData] = useState(initialData);
  const [formState, setFormState] = useState({
    dirty: [],
    touched: [],
  });
  const [errors, setErrors] = useState({});
  const { validateAll: yupValidateAll, validateAt: yupValidateAt } =
    useYupValidationResolver(schema);

  const validate = async () => {
    const res = await yupValidateAll(formData);
    // const newErrors = Object.keys(res.errors);
    setErrors(res.errors);
  };

  const validateAt = async (fieldPath, data) => {
    const { errors: yupErrors } = await yupValidateAt(fieldPath, data);

    if (isEmpty(yupErrors)) {
      const newErrors = { ...errors };
      delete newErrors[fieldPath];
      setErrors(newErrors);
      return;
    }
    console.log(errors);
    errors[fieldPath] = {
      ...errors[fieldPath],
    };
    setErrors({ ...errors, ...yupErrors });
  };

  const onChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const name = e.target.name;
    console.log(name);
    const newData = {
      ...formData,
      [name]: value,
    };
    setFormData(newData);

    // const targetIsDirty = formState.dirty.some((item) => item === name);
    // const targetIsTouched = formState.touched.some((item) => item === name);
    const targetIsInvalid = Object.keys(errors).some((key) => key === name);

    if (targetIsInvalid && reValidateOn === "onChange") {
      validateAt(name, newData);
    }

    const dirty = [...new Set([...formState.dirty, name])];
    setFormState({ ...formState, dirty });
  };

  const onBlur = (e) => {
    validateAt(e.target.name, formData);
  };

  const onFocus = (e) => {
    const touched = [...new Set([...formState.touched, e.target.name])];
    setFormState({ ...formState, touched });
  };

  const handlers = {
    onBlur,
    onChange,
    onFocus,
  };

  return {
    formData,
    setFormData,
    formState,
    setFormState,
    errors,
    handlers,
    validate,
  };
};

export default useForm;

export const useYupValidationResolver = (validationSchema) => {
  const validateAll = useCallback(
    async (data) => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (allErrors, currentError) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? "validation",
                message: currentError.message,
              },
            }),
            {}
          ),
        };
      }
    },
    [validationSchema]
  );

  const validateAt = useCallback(
    async (fieldPath, data) => {
      try {
        const values = await validationSchema.validateAt(fieldPath, data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors) {
        return {
          values: {},
          errors: errors.inner?.reduce(
            (allErrors, currentError) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? "validation",
                message: currentError.message,
              },
            }),
            {}
          ),
        };
      }
    },
    [validationSchema]
  );

  return {
    validateAll,
    validateAt,
  };
};