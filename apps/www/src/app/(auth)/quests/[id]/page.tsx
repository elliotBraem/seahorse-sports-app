import QuestDetails from "./_components/questDetails";

export default async function QuestPage({
  params,
}: {
  params: { id: string };
}) {
  const questId = parseInt(params.id);

  return <QuestDetails />;
}
