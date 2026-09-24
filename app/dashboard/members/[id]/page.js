import MemberPreview from "@/components/dashboard/MemberPreview";

export default async function MemberDetailsPage({
  params,
}) {
  const { id } = await params;

  return (
    <MemberPreview
      memberId={id}
    />
  );
}