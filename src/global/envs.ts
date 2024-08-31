import { Env, Event } from "../enums";
import {
  EnvsLoadProps,
  GlobalEnvsType,
  GlobalEventsType,
  GlobalWindowType,
} from "../types";

export const envs = () => {
  let $events: GlobalEventsType;
  let $window: GlobalWindowType;
  //@ts-ignore
  const lastEnvsMap: Record<Env, number> = {};

  const load = ({ events, window }: EnvsLoadProps) => {
    $events = events;
    $window = window;

    let envList = Object.values(Env);
    envList = envList.slice(0, envList.length / 2);

    const style = document.createElement("style");
    style.textContent = `:root {\n${envList
      .map((env: string) => env.toLowerCase().replaceAll("_", "-"))
      .map((env) => `--${env}: env(${env})`)
      .join(";\n")}`;
    document.head.appendChild(style);

    for (const envKey of envList) lastEnvsMap[envKey] = get(Env[envKey]);

    setInterval(() => {
      for (const envString of envList) {
        const envKey = Env[envString];
        const targetEnvValue = get(envKey);
        if (lastEnvsMap[envKey] === targetEnvValue) continue;

        $events.$emit(Event[envString] as Event, { value: targetEnvValue });
        lastEnvsMap[envKey] = targetEnvValue;
      }
    }, 10);
  };

  const get = (env: Env, scale: boolean = true): number => {
    const computedStyle = getComputedStyle(document.body);
    const envString = Env[env].toLowerCase().replaceAll("_", "-");
    let value = parseFloat(
      computedStyle.getPropertyValue(`--${envString}`) || "0",
    );

    if ($window && scale) {
      value /= $window.getScale();
      value = $window.isPixelPerfect() ? Math.round(value) : value;
    }

    return value;
  };

  const mutable: GlobalEnvsType = {
    load,
    get,
  };

  return mutable;
};
