import { DailyTip } from "@prisma/client";

export function selectDailyTip(dts: DailyTip[]): DailyTip {
  let selected = dts.find((dt) => dt.lastShownDate === null);

  const earliestFirst = dts.sort((a, b) => {
    const d = a.lastShownDate?.getTime();
    const f = b.lastShownDate?.getTime();

    return Number(d) - Number(f);
  });

  selected = { ...earliestFirst[0] };

  if (!selected) {
    selected = dts[Math.floor(Math.random() * dts.length)];
  }

  return selected;
}
