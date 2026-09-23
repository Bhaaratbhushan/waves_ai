import type { Metadata } from "next";
import RegistrationStage from "../RegistrationStage";

export const metadata: Metadata = {
  title: "Team Registration | WAVES '26",
  description: "Register a team for WAVES '26 — Ashes to Ascension.",
};

export default function TeamRegistrationPage() {
  return <RegistrationStage mode="team" />;
}
