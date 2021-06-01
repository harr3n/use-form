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
});

const initialData = {
  heading: "",
  description: "",
  participants: [
    { firstName: "Horace", role: "Big player", test: "" },
    { firstName: "Rafael", role: "Just another dude", test: "" },
  ],
  accept: false,
};

const AnotherForm = () => {
  const { handlers, formData, setFormData, errors, validate, getFieldProps } =
    useForm({
      initialData,
      schema,
    });

  const addParticipant = () => {
    const newFormData = { ...formData };
    newFormData.participants.push({ firstName: "", role: "" });
    console.log(newFormData);
    setFormData(newFormData);
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
        <Input
          type="text"
          //   name="heading"
          //   value={formData.heading}
          //   {...handlers}
          //   error={errors["heading"]}
          {...getFieldProps("heading")}
        />
      </Label>
      <Label>
        Description
        <TextArea
          rows="5"
          name="description"
          value={formData.description}
          {...handlers}
          error={errors["description"]}
        />
      </Label>
      <h3>Who will be participatin?</h3>
      {formData.participants.map((participant, i) => (
        <div key={i}>
          <h4>{i + 1}. </h4>
          <Label>
            First Name
            <Input
              type="text"
              name={`participants[${i}].firstName`}
              value={participant.firstName}
              {...handlers}
              error={errors[`participants[${i}].firstName`]}
            />
          </Label>
          <Label>
            Role
            <Select
              name={`participants[${i}].role`}
              value={participant.role}
              {...handlers}
              error={errors[`participants[${i}].role`]}
            >
              <option>Just a placeholder role</option>
              <option value="Big boy player">Big boy player</option>
              <option value="Regular dude">Regular dude</option>
              <option value="Next level pinata">Next level pinata</option>
            </Select>
          </Label>
        </div>
      ))}
      <h3>Do you accept this challenge?</h3>
      <Label>
        <input type="checkbox" {...getFieldProps("accept")} />
        Yes, I do accept
      </Label>
      <button type="button" onClick={addParticipant}>
        Add participant
      </button>
      <button>Submit</button>
      <ErrorMessages errors={errors} />
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
