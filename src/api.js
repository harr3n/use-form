export const getMeeting = (id) => {
  return {
    date: "2021-05-26",
    timeFrom: "22:30",
    timeTo: "00:00",
    location: "",
    email: "",
    municipality: "",
    inSweden: false,
    participants: ["Erk", "man"],
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
    body: "",
    agenda: [
      {
        id: 1,
        name: "Styrelsemötets öppnande",
      },
      {
        id: 2,
        name: "Val av mötesfunktionärer",
      },
      {
        id: 3,
        name: "Godkännande av dagordningen",
      },
      {
        id: 4,
        name: "Föregående protokoll",
      },
    ],
  };
};
