import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers Page",
  keywords: ["dashboard", "customers"],
  robots: "noindex",
};

export default function Page() {
  return <p>Customers Page</p>;
}
