import styled, { css } from "styled-components";
import * as yup from "yup";
import useForm from "./useForm";

const schema = yup.object().shape({
  heading: yup.string().required(),
  description: yup.string().required(),
});

const initialData = {
  heading: "",
  description: "",
  participants: ["Erk", "man"],
};

const AnotherForm = () => {
  const { handlers, formData, formState, errors } = useForm({
    initialData,
    schema,
  });
  return (
    <Form>
      <Label>
        Heading
        <Input
          type="text"
          name="heading"
          value={formData.heading}
          {...handlers}
          error={errors["date"]}
        />
      </Label>
      {formData.participants.map((participant, i) => (
        <Label>
          Name
          <Input
            type="text"
            name={`participants[${i}]`}
            value={formData.participants[i]}
            {...handlers}
          />
        </Label>
      ))}
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
  height: 2rem;
  padding: 0.5rem;
  border: ${({ error }) => (error ? "1px solid red" : "1px solid black")};

  :focus {
    outline: none;
  }
`;

const Input = styled.input`
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
      {errorKeys.map((key) => {
        const { message } = errors[key];
        return <li key={message}>{message}</li>;
      })}
    </StyledErrorMessages>
  );
};
