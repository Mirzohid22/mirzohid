type Education = {
  institution: string;
  degree: string;
  field: string;
  period: string;
  grade: string;
  activities: string[];
}

export const educationList: Education[] = [
  {
    institution: 'Tashkent University of Information Technologies (TUIT)',
    degree: "Bachelor's degree",
    field: 'Software Engineering',
    period: 'Sep 2019 – Jul 2023',
    grade: '4.59 / 5 (A-)',
    activities: [
      "Youth Union — VCE (Vice President of Community Engagement) Leader",
      "TUIT Zakovat Club Championship — 2× Champion",
      "Sports: Chess, Ping-pong, Football",
    ],
  },
]
