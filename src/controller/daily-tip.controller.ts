import { DailyTip } from "@prisma/client";

export function selectDailyTip(dts: DailyTip[]): DailyTip {
  let selected: DailyTip | undefined;

  selected = dts.find((dt) => dt.lastShownDate === null);

  const sortedDailyTips = earliestFirst(dts);

  selected = { ...sortedDailyTips[0] };

  return selected;
}

// returns ["2020-01-01" , "2024-12-12"] => "2020-01-01"
const earliestFirst = (dts: DailyTip[]): DailyTip[] => {
  return dts.sort(
    (a, b) =>
      Number(a.lastShownDate?.getTime()) - Number(b.lastShownDate?.getTime())
  );
};
