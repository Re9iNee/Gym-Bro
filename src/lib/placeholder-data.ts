import { DailyTip } from "../types/daily-tip.type";

export const dailyTips: DailyTip[] = [
  {
    id: 1,
    title: "Why is pull up so hard?",
    isActive: false,
    image_url:
      "https://mikereinold.com/wp-content/uploads/rookie-mistakes-the-pullup-main.jpg",
    video_url: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
    summary: "If you can't do a pull-up, try a chin-up, which is easier.",
    content:
      "The pull-up is a bodyweight exercise that targets the muscles of the back and biceps. It is a challenging exercise that requires upper body strength and core stability.",
    lastShownDate: "2021-09-25",
    references: [
      {
        title: "Oxford University",
        url: "https://www.oxfordreference.com/display/10.1093/acref/9780199891580.001.0001/acref-9780199891580-e-6390",
      },
    ],
  },
  {
    id: 2,
    isActive: true,
    title: "Tips on Cardio",
    image_url:
      "https://www.verywellfit.com/thmb/5Q6Vd6b8k3Zt5Z2Vzg9v7q8B1yM=/1500x1000/filters:fill(FFDB5D,1)/GettyImages-109265832-57c4d6b13df78c684d9f6b6b.jpg",
    video_url: "https://www.youtube.com/watch?v=9f1Y4OV3QlA",
    summary: "Cardio is important for heart health and weight loss.",
    content:
      "Cardiovascular exercise, also known as aerobic exercise, is any type of exercise that increases your heart rate and breathing rate. It is important for heart health and weight loss.",
    references: [
      {
        title: "Harvard Medical School",
        url: "https://www.health.harvard.edu/topics/exercise-and-fitness",
      },
    ],
    lastShownDate: null,
  },
];
