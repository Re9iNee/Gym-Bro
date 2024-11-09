import { DailyTip } from "@prisma/client";
import { formatDate } from "../lib/utils/date.utils";
import { DailyTip as DTClientType } from "../types/daily-tip.type";

export function selectDailyTip(dts: DailyTip[]): DailyTip {
  let selected: DailyTip | undefined;

  selected = dts.find((dt) => dt.lastShownDate === null);
  if (selected) return selected;

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

export function convertToClientType(dt: DailyTip): DTClientType {
  const { references, lastShownDate } = dt;

  return {
    ...dt,
    lastShownDate: lastShownDate ? formatDate(lastShownDate) : null,
    references: JSON.parse(String(references)),
  };
}
