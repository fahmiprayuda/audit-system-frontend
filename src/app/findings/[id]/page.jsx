import FindingDetailPage from "@/app/findings/[id]/FindingDetailPage";

export const metadata = {
  title: "Finding & Action Plans",
  description: "View finding details and action plans for each department.",
};

export default function Page() {
  return <FindingDetailPage />;
}