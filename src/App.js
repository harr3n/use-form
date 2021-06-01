import { CreateMeetingProvider } from "./useCreateMeeting";
import StepOne from "./Step1";
import AnotherForm from "./AnotherForm";

function App() {
  return (
    <div className="App">
      <CreateMeetingProvider>
        <div>Welcome to superform</div>
        <CreateMeeting />
      </CreateMeetingProvider>
    </div>
  );
}

export default App;

const CreateMeeting = () => {
  return (
    <div>
      {/* <StepOne /> */}
      <AnotherForm />
    </div>
  );
};
