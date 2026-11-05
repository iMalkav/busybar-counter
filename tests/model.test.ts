import assert from "node:assert/strict";
import test from "node:test";
import schema from "../src/appmeta/settings.json" with { type: "json" };
import { AppModel } from "../src/model.ts";
import { schemaDefaults, type Settings } from "../src/lib.ts";
const NOW = 1700000000000;
const make = (values: Settings = {}, saved: Settings = {}, now = NOW) =>
  new AppModel({ ...schemaDefaults(schema.fields), ...values }, saved, now);

test("step clamps at both boundaries and persists", () => {
  const a = make({ step: 3, maximum: 5 });
  a.key("wheel", 3, NOW);
  assert.equal(a.count, 5);
  assert.equal(make({ maximum: 5 }, a.save()).count, 5);
  a.key("wheel", -9, NOW);
  assert.equal(a.count, 0);
});
test("reset requires confirmation and Back cancels it", () => {
  const a = make();
  a.key("wheel", 5, NOW);
  a.key("ok", 0, NOW);
  assert.equal(a.key("back", 0, NOW), true);
  assert.equal(a.count, 5);
  a.key("ok", 0, NOW);
  a.key("ok", 0, NOW);
  assert.equal(a.count, 0);
});
