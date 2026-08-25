import { redirect } from "next/navigation";

export default function QAPage({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/contact#qa`);
}
