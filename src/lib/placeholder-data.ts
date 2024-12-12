import {
  Exercise as ServerExercise,
  DailyTip as ServerDailyTip,
  User as ServerUser,
} from "@prisma/client";

export const dailyTips: ServerDailyTip[] = [
  {
    id: 1,
    title: "Why is pull up so hard?",
    image_url:
      "https://mikereinold.com/wp-content/uploads/rookie-mistakes-the-pullup-main.jpg",
    video_url: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
    summary: "If you can't do a pull-up, try a chin-up, which is easier.",
    content:
      "The pull-up is a bodyweight exercise that targets the muscles of the back and biceps. It is a challenging exercise that requires upper body strength and core stability.",
    isActive: true,
    lastShownDate: new Date(),
    references: JSON.stringify([
      {
        title: "Oxford University",
        url: "https://www.oxfordreference.com/display/10.1093/acref/9780199891580.001.0001/acref-9780199891580-e-6390",
      },
    ]),
  },
  {
    id: 2,
    title: "How to do a proper push-up?",
    image_url:
      "https://www.verywellfit.com/thmb/3Zi3b8Yr1QbUZ1z0U2b8Q4bB4sA=/768x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/pushup-58a618b23df78c345b72d6f8.jpg",
    video_url: "https://www.youtube.com/watch?v=IODxDxX7oi4",
    summary:
      "Keep your body in a straight line from head to heels. Lower your body until your chest nearly touches the floor.",
    content:
      "The push-up is a bodyweight exercise that targets the muscles of the chest, shoulders, and triceps. It is a great exercise for building upper body strength and endurance.",
    isActive: false,
    lastShownDate: new Date("2021-01-01"),
    references: JSON.stringify([
      {
        title: "Harvard Health",
        url: "https://www.health.harvard.edu/staying-healthy/push-ups-and-other-exercises",
      },
    ]),
  },
  {
    id: 3,
    isActive: false,
    lastShownDate: null,
    title: "What is the best way to lose weight?",
    image_url:
      "https://www.verywellfit.com/thmb/3Zi3b8Yr1QbUZ1z0U2b8Q4bB4sA=/768x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/pushup-58a618b23df78c345b72d6f8.jpg",
    video_url: "https://www.youtube.com/watch?v=IODxDxX7oi4",
    summary:
      "The best way to lose weight is to eat a healthy diet and exercise regularly.",
    content:
      "Losing weight requires a combination of healthy eating, regular exercise, and lifestyle changes. It is important to create a calorie deficit by burning more calories than you consume.",
    references: JSON.stringify([
      {
        title: "Mayo Clinic",
        url: "https://www.mayoclinic.org/healthy-lifestyle/weight-loss/in-depth/weight-loss/art-20047752",
      },
    ]),
  },
  {
    id: 4,
    isActive: false,
    lastShownDate: new Date("2021-01-01"),
    title: "What are the benefits of yoga?",
    image_url:
      "https://www.verywellfit.com/thmb/3Zi3b8Yr1QbUZ1z0U2b8Q4bB4sA=/768x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/pushup-58a618b23df78c345b72d6f8.jpg",
    video_url: "https://www.youtube.com/watch?v=IODxDxX7oi4",
    summary:
      "Yoga can help improve flexibility, strength, and mental well-being.",
    content:
      "Yoga is a mind-body practice that combines physical postures, breathing exercises, and meditation. It can help reduce stress, improve flexibility, and promote overall well-being.",
    references: JSON.stringify([
      {
        title: "National Center for Complementary and Integrative Health",
        url: "https://www.nccih.nih.gov/health/yoga-what-you-need-to-know",
      },
    ]),
  },
  {
    id: 5,
    isActive: false,
    lastShownDate: new Date("2021-01-01"),
    title: "How to improve your posture?",
    image_url:
      "https://www.verywellfit.com/thmb/3Zi3b8Yr1QbUZ1z0U2b8Q4bB4sA=/768x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/pushup-58a618b23df78c345b72d6f8.jpg",
    video_url: "https://www.youtube.com/watch?v=IODxDxX7oi4",
    summary:
      "To improve your posture, focus on strengthening your core and back muscles.",
    content:
      "Good posture is important for overall health and well-being. It can help prevent back pain, improve breathing, and boost confidence. To improve your posture, focus on strengthening your core and back muscles, and practice good ergonomics.",
    references: JSON.stringify([
      {
        title: "American Chiropractic Association",
        url: "https://www.acatoday.org/Patients/Health-Wellness-Information/Posture",
      },
    ]),
  },
];

export const exercises: ServerExercise[] = [
  {
    id: 1,
    name: "Pull-up",
    difficulty: "HARD",
    muscles: ["LOWER_BACK", "BICEPS"],
    tips: [
      "If you can't do a pull-up, try a chin-up, which is easier.",
      "If you can't do a chin-up, try a negative pull-up, which is easier still.",
    ],
    steps: [
      "Hang from a pull-up bar with your hands shoulder-width apart.",
      "Pull your chest up to the bar, then lower yourself back to the starting position.",
      "Repeat.",
    ],
    equipments: ["PULL_UP_BAR"],
    goals: ["STRENGTH", "MUSCLE_GAIN"],
    focuses: ["UPPER_BODY", "BACK"],
    alternate_names: ["Chin-up", "Barfix"],
    video_url: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
    image_url:
      "https://mikereinold.com/wp-content/uploads/rookie-mistakes-the-pullup-main.jpg",
    description:
      "The pull-up is a bodyweight exercise that targets the muscles of the back and biceps. It is a challenging exercise that requires upper body strength and core stability.",
  },
];

export const users: ServerUser[] = [
  {
    id: 1,
    age: 27,
    weight: 84,
    height: 176,
    gender: "Male",
    name: "John Doe",
    username: "john.doe",
    phone: "123-456-7890",
    goals: ["WEIGHT_LOSS"],
    password: "hashedPassword",
    email: "john.doe@gmail.com",
    birthday: new Date("1994-07-06"),
    avatar: "https://avatars.githubusercontent.com/u/139426",
  },
];
