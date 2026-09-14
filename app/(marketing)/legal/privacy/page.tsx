import { CopyPage } from "@/components/site/CopyPage";

export default function Page() {
  return (
    <CopyPage
      title="Privacy"
      lead="We do not collect accounts. Demo login is printed on the login page."
      paragraphs={[
        "Do not type a real email password here.",
        "Browser theme is stored in localStorage on your machine.",
      ]}
    />
  );
}
