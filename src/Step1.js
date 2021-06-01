import styled, { css } from "styled-components";
import useCreateMeeting from "./useCreateMeeting";

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

const StepOne = () => {
  const { stepOneForm } = useCreateMeeting();
  const { handlers, validate, formData, errors } = stepOneForm;
  const {
    date,
    timeFrom,
    timeTo,
    location,
    body,
    email,
    municipality,
    inSweden,
  } = formData;

  console.log(errors);

  return (
    <Form>
      <Label>
        Datum
        <Input
          type="date"
          name="date"
          value={date}
          {...handlers}
          error={errors["date"]}
        />
      </Label>
      <Label>
        Tid från
        <Input
          type="time"
          name="timeFrom"
          value={timeFrom}
          {...handlers}
          error={errors["timeFrom"]}
        />
      </Label>
      <Label>
        Tid till
        <Input
          type="time"
          name="timeTo"
          value={timeTo}
          {...handlers}
          error={errors["timeTo"]}
        />
      </Label>
      <Label>
        Plats
        <Input
          type="text"
          name="location"
          value={location}
          {...handlers}
          error={errors["location"]}
        />
      </Label>
      <Label>
        Inbjudan
        <Input
          type="text"
          name="body"
          value={body}
          {...handlers}
          error={errors["body"]}
        />
      </Label>
      <Label>
        Mail
        <Input
          type="email"
          name="email"
          value={email}
          {...handlers}
          error={errors["email"]}
        />
      </Label>

      <label>
        <input
          type="checkbox"
          name="inSweden"
          checked={inSweden}
          {...handlers}
        />
        Jag bor i Sverige
      </label>
      {inSweden && (
        <Label>
          Kommun
          <Select
            name="municipality"
            value={municipality}
            {...handlers}
            error={errors["municipality"]}
          >
            <option value="">Välj din kommun</option>
            <option value="Östersund">Östersund</option>
            <option value="Krokom">Krokom</option>
            <option value="Bräcke">Bräcke</option>
            <option value="Föllinge">Föllinge</option>
            <option value="Ragunda">Ragunda</option>
          </Select>
        </Label>
      )}
      <button type="button" onClick={validate}>
        Clickity Clack
      </button>
      <ErrorMessages errors={errors} />
    </Form>
  );
};

export default StepOne;
