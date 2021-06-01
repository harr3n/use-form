import React, {
  useEffect,
  useState,
  useContext,
  createContext,
  useCallback,
} from "react";
import * as yup from "yup";

import { getMeeting } from "./api";
import useForm from "./useForm";

const createMeetingContext = createContext(null);

const schema = yup.object().shape({
  date: yup.string().required(),
  timeFrom: yup.string().required(),
  timeTo: yup.string().required(),
  location: yup.string().required(),
  body: yup.string().required(),
  email: yup.string().when("body", {
    is: (val) => val === "i have email", // Validate email only if body text is "i have email"
    then: yup.string().required("You said you have an email...").email(),
  }),
  inSweden: yup.boolean().required().oneOf([true], "Field must be checked"),
  municipality: yup.string().when("inSweden", {
    is: (val) => val === true,
    then: yup.string().required(),
  }),
});

const initialData = {
  date: "",
  timeFrom: "",
  timeTo: "",
  location: "",
  participants: [],
  body: "",
  email: "",
  municipality: "",
  inSweden: false,
};

export const CreateMeetingProvider = ({ children }) => {
  const [data, setData] = useState();
  const stepOneForm = useForm({ schema, initialData });
  const stepTwoForm = useForm({});
  const { setFormData: setStepOne } = stepOneForm;
  const { setFormData: setStepTwo } = stepTwoForm;

  useEffect(() => {
    const data = getMeeting();
    setData(data);
  }, []);

  useEffect(() => {
    if (!data) return;
    const stepOne = {
      date: data.date,
      timeFrom: data.timeFrom,
      timeTo: data.timeTo,
      location: data.location,
      email: data.location,
      participants: data.participants,
      municipality: "",
      inSweden: false,
      boardMembers: [
        {
          name: "Johanna Johansson",
          role: "Ordförande",
        },
        {
          name: "Jan Johansson",
          role: "Ledamot",
        },
        {
          name: "Josef Johansson",
          role: "Ledamot",
        },
        {
          name: "Jill Johansson",
          role: "Suppleant",
        },
      ],
      body: data.body,
    };
    const stepTwo = {
      agenda: data.agenda,
    };
    setStepOne(stepOne);
    setStepTwo(stepTwo);
  }, [data]);

  return (
    <createMeetingContext.Provider value={{ stepOneForm, stepTwoForm }}>
      {children}
    </createMeetingContext.Provider>
  );
};
const useCreateMeeting = (id) => {
  return useContext(createMeetingContext);
};
export default useCreateMeeting;
