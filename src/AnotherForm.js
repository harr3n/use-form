import styled, { css } from "styled-components";
import * as yup from "yup";
import useForm from "./useForm";

const schema = yup.object().shape({
  heading: yup.string().required("Heading is a required field"),
  description: yup.string().required("Description is a required field"),
  participants: yup.array().of(
    yup.object().shape({
      firstName: yup.string().required("First name is a required field"),
      role: yup.string().required("Role is a required field"),
    })
  ),
  accept: yup.bool().oneOf([true], "You must accept your destiny"),
});

const initialData = {
  heading: "",
  description: "",
  participants: [{ firstName: "", role: "" }],
  accept: false,
};

const AnotherForm = () => {
  const { formData, setFormData, errors, validate, getFieldProps, formState } =
    useForm({
      initialData,
      schema,
    });

  const addParticipant = () => {
    setFormData({
      ...formData,
      participants: [...formData.participants, { firstName: "", role: "" }],
    });
  };

  const removeParticipant = (i) => {
    setFormData({
      ...formData,
      participants: formData.participants.filter((_, index) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { errors: validationErrors } = await validate();
    console.log(validationErrors);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h3>Just some general information</h3>
      <Label>
        Heading
        <Input type="text" {...getFieldProps("heading")} />
      </Label>
      <Label>
        Description
        <TextArea rows="5" {...getFieldProps("description")} />
      </Label>
      <h3>Who will be participatin?</h3>
      {formData.participants.map((_participant, i) => (
        <div key={i}>
          <h4>{i + 1}.</h4>
          <Label>
            First Name
            <Input
              type="text"
              {...getFieldProps(`participants[${i}].firstName`)}
            />
          </Label>
          <Label>
            Role
            <Select {...getFieldProps(`participants[${i}].role`)}>
              <option value="">Pick a role...</option>
              <option value="Big boy player">Big boy player</option>
              <option value="Regular dude">Regular dude</option>
              <option value="Next level pinata">Next level pinata</option>
            </Select>
          </Label>
          <button onClick={() => removeParticipant(i)}>
            Remove this participant
          </button>
        </div>
      ))}
      <button type="button" onClick={addParticipant}>
        Add participant
      </button>
      <h3>Do you accept this challenge?</h3>
      <label>
        <input type="checkbox" {...getFieldProps("accept")} />
        Yes, I do accept
      </label>
      <ErrorMessages errors={errors} />
      <button>Submit</button>
      <>
        <strong>Result (data):</strong>
        <pre>{JSON.stringify(formData, null, "\t")}</pre>
      </>
      <>
        <strong>Errors:</strong>
        <pre>{JSON.stringify(errors, null, "\t")}</pre>
      </>
      <>
        <strong>Other form state:</strong>
        <pre>{JSON.stringify(formState, null, "\t")}</pre>
      </>
    </Form>
  );
};

export default AnotherForm;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 5rem;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const InputAppearance = css`
  min-height: 2rem;
  padding: 0.5rem;
  border: ${({ error }) => (error ? "1px solid red" : "1px solid black")};

  :focus {
    outline: none;
  }
`;

const Input = styled.input`
  ${InputAppearance}
`;

const TextArea = styled.textarea`
  ${InputAppearance}
`;

const Select = styled.select`
  ${InputAppearance}
`;

const StyledErrorMessages = styled.ul`
  padding: 2rem;
  color: red;
`;

const ErrorMessages = ({ errors }) => {
  const errorKeys = Object.keys(errors);
  if (!errorKeys.length) return null;
  return (
    <StyledErrorMessages>
      {errorKeys.map((key, i) => {
        const { message } = errors[key];
        return <li key={message + i}>{message}</li>;
      })}
    </StyledErrorMessages>
  );
};
