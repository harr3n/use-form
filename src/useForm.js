import { useState, useCallback, useRef } from "react";
import { set, get } from "lodash-es";

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
    return res;
  };

  const validateAt = async (fieldPath, data) => {
    const { errors: yupErrors } = await yupValidateAt(fieldPath, data);

    if (isEmpty(yupErrors)) {
      const newErrors = { ...errors };
      delete newErrors[fieldPath];
      setErrors(newErrors);
      return;
    }

    errors[fieldPath] = {
      ...errors[fieldPath],
    };
    setErrors({ ...errors, ...yupErrors });
  };

  const onChange = (e) => {
    console.log("onChange triggered");
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const name = e.target.name;
    const newData = { ...formData };
    set(newData, name, value);
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
    console.log("onBlur triggered");
    validateAt(e.target.name, formData);
  };

  const onFocus = (e) => {
    console.log("onFocus triggered");
    const touched = [...new Set([...formState.touched, e.target.name])];
    setFormState({ ...formState, touched });
  };

  const getValueByName = (path) => {
    return get(formData, path);
  };

  const getFieldProps = (name) => {
    return {
      name,
      value: getValueByName(name),
      checked: getValueByName(name),
      onBlur,
      onChange,
      onFocus,
      error: errors[name],
    };
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
    getFieldProps,
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
