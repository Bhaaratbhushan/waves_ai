"use client";

import Image from "next/image";
import { useId } from "react";
import DoorLink from "../_doors/DoorLink";
import { PLATES } from "./plates";
import s from "./registration.module.css";

export type Mode = "individual" | "team";

/** Each mode links to the other; the chip is the only route out. */
const OTHER: Record<Mode, { href: string; label: string; aria: string }> = {
  individual: {
    href: "/register/team",
    label: "Team",
    aria: "Switch to team registration",
  },
  team: {
    href: "/register/individual",
    label: "Individual",
    aria: "Switch to individual registration",
  },
};

/**
 * Field definitions mirror the Figma frames. Two labels in the team frame were
 * left as scratch text by the designer ("College ??", "bruhh") and both of its
 * right-hand password fields were labelled "Password"; those are named here as
 * the surrounding fields imply. Change them freely -- nothing else reads them.
 */
type Field = {
  name: string;
  label: string;
  placeholder: string;
  type?: "text" | "email" | "tel" | "password";
  /** Passed straight to the input; defaults to "off" for the free-text fields. */
  autoComplete?: string;
  options?: string[];
  /** Renders alongside the next field inside one grid column. */
  pairWith?: Field;
};

const INDIVIDUAL_FIELDS: Field[] = [
  {
    name: "username",
    label: "Username",
    placeholder: "Username",
    autoComplete: "username",
  },
  { name: "college", label: "College Name", placeholder: "e.g BITS Pilani" },
  {
    name: "email",
    label: "Email",
    placeholder: "abc@gmail.com",
    type: "email",
    autoComplete: "email",
  },
  {
    name: "city",
    label: "City",
    placeholder: "City",
    pairWith: { name: "state", label: "State", placeholder: "State" },
  },
  {
    name: "phone",
    label: "Phone Number",
    placeholder: "+91 1234567890",
    type: "tel",
    autoComplete: "tel",
  },
  {
    name: "events",
    label: "Select Events :",
    placeholder: "Events",
    options: ["Moot Court", "Contention", "Queries"],
  },
];

const TEAM_FIELDS: Field[] = [
  { name: "teamName", label: "Team Name", placeholder: "Team name" },
  { name: "college", label: "College Name", placeholder: "e.g BITS Pilani" },
  {
    name: "email",
    label: "Email",
    placeholder: "abc@gmail.com",
    type: "email",
    autoComplete: "email",
  },
  {
    name: "phone",
    label: "Phone Number",
    placeholder: "+91 1234567890",
    type: "tel",
    autoComplete: "tel",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Password",
    type: "password",
    autoComplete: "new-password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Password",
    type: "password",
    autoComplete: "new-password",
  },
];

function Control({ field, idPrefix }: { field: Field; idPrefix: string }) {
  const id = `${idPrefix}-${field.name}`;
  return (
    <div className={s.field}>
      <label className={s.label} htmlFor={id}>
        {field.label}
      </label>
      {field.options ? (
        <select className={s.control} id={id} name={field.name} defaultValue="">
          <option value="" disabled>
            {field.placeholder}
          </option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          className={s.control}
          id={id}
          name={field.name}
          type={field.type ?? "text"}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete ?? "off"}
        />
      )}
    </div>
  );
}

export default function RegistrationStage({ mode }: { mode: Mode }) {
  const idPrefix = useId();

  const isTeam = mode === "team";
  const fields = isTeam ? TEAM_FIELDS : INDIVIDUAL_FIELDS;
  const other = OTHER[mode];

  return (
    <main className={s.wrap}>
      <form
        className={`${s.stage} ${isTeam ? s.team : s.individual}`}
        onSubmit={(event) => {
          // No backend yet -- wire this to the registration endpoint.
          event.preventDefault();
        }}
      >
        <Image
          className={`${s.plate} ${s.plateOn}`}
          src={PLATES[mode].src}
          alt=""
          fill
          sizes="(max-width: 1440px) 100vw, 1440px"
          placeholder="blur"
          blurDataURL={PLATES[mode].blurDataURL}
          preload
        />

        <h1 className={s.title}>
          {isTeam ? "Team Registration" : "Individual"}
        </h1>

        <DoorLink className={s.chip} href={other.href} aria-label={other.aria}>
          {other.label}
        </DoorLink>

        <div className={s.grid}>
          {fields.map((field) =>
            field.pairWith ? (
              <div className={s.split} key={field.name}>
                <Control field={field} idPrefix={idPrefix} />
                <Control field={field.pairWith} idPrefix={idPrefix} />
              </div>
            ) : (
              <Control field={field} key={field.name} idPrefix={idPrefix} />
            ),
          )}
        </div>

        <button className={s.submit} type="submit">
          Register
        </button>

        <DoorLink className={s.back} href="/register">
          Back
        </DoorLink>
      </form>
    </main>
  );
}
