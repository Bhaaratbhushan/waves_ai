import type { Metadata } from "next";
import RegistrationStage from "../RegistrationStage";

export const metadata: Metadata = {
  title: "Individual Registration | WAVES '26",
  description: "Register as an individual for WAVES '26 — Ashes to Ascension.",
};

export default function IndividualRegistrationPage() {
  return <RegistrationStage mode="individual" />;
}
