import { locale } from "svelte-i18n";

export async function handle({ event, resolve }) {
  const lang = event.request.headers.get("accept-language")?.split(",")[0];
  if (lang) {
    locale.set(lang);
  }
  return resolve(event);
}
