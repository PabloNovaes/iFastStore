import { Metadata } from "next"
import { Home } from "./content"

export const metadata: Metadata = {
  title: "Casa"
}

export default function Page() {
  return <Home />
}