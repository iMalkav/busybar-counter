import {
  str,
  num,
  clamp,
  bounded,
  App,
  type Settings,
  type View,
} from "./lib.ts";

export class AppModel extends App {
  count = 0;
  confirm = false;
  minimum = 0;
  maximum = 0;
  constructor(s: Settings, saved: Settings, now: number) {
    super(s, saved, now);
    this.minimum = num(s, "minimum");
    this.maximum = Math.max(this.minimum, num(s, "maximum", 999999));
    this.count = Math.round(
      bounded(saved.count, this.minimum, this.maximum, 0),
    );
  }
  key(key: string, delta: number, _now: number): boolean {
    if (key === "wheel") {
      this.confirm = false;
      this.count = clamp(
        this.count + Math.trunc(delta) * num(this.settings, "step", 1),
        this.minimum,
        this.maximum,
      );
    }
    if (key === "ok") {
      if (this.confirm) {
        this.count = clamp(0, this.minimum, this.maximum);
        this.confirm = false;
      } else this.confirm = true;
    }
    if (key === "back" && this.confirm) {
      this.confirm = false;
      return true;
    }
    return false;
  }
  save(): Settings {
    return { count: this.count };
  }
  view(_now: number): View {
    return {
      title: str(this.settings, "title"),
      value: this.confirm ? "RESET?" : String(this.count),
      rows: [
        "Step " + num(this.settings, "step"),
        this.minimum + " to " + this.maximum,
      ],
      hint: this.confirm ? "OK confirm / Back cancel" : "Wheel +/- / OK reset",
    };
  }
}
