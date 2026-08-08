import type { Metadata } from "next";
import { HomePageView } from "@/components/home/HomePageView";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export const revalidate = 300;

export default async function HomePage() {
  return <HomePageView />;
}
