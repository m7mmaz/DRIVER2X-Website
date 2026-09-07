import { createFileRoute } from "@tanstack/react-router";
import { Frontend } from "@/components/fe/Frontend";

const title = "DRIVER2X — Dynamic Driver 2 Sandbox";
const description =
  "A living-city rebuild of Driver 2: dynamic police, heat, fuel, civilian AI and more, built on REDRIVER2. Free launcher for Windows.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Frontend,
});
