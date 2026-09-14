import { CopyPage } from "@/components/site/CopyPage";

export default function Page() {
  return (
    <CopyPage
      title="Security notes"
      lead="This demo stores nothing about you on a server."
      paragraphs={[
        "Log in with the on-screen demo email only. Do not paste real passwords into this app.",
        "Theme choice lives in the browser. Mock tables live in memory while the server process runs.",
        "A production version would need real auth, encryption, and private networks. This repo does not.",
      ]}
    />
  );
}
