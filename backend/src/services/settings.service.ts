import { Settings, type ISettings } from "@/models/Settings.model";

/**
 * Settings is a single-document collection. This is the one place that
 * reads/creates it — every other service (e.g. order.service.ts for
 * delivery/tax/service-charge rates) calls `getSettings()` rather than
 * querying the model directly, so there's exactly one lazy-creation path.
 */
export async function getSettings(): Promise<ISettings> {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
}

export async function updateSettings(patch: Partial<ISettings>): Promise<ISettings> {
  const settings = await getSettings();
  Object.assign(settings, patch);
  await settings.save();
  return settings;
}
