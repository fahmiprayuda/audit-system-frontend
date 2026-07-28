import CreateFindingPage from "@/app/projects/[id]/findings/create/CreateFindingPage";

export const metadata = {
    title: "Create Finding",
    description: "Create Finding",
}
export default function page() {

    return (
        <CreateFindingPage />
    );
}