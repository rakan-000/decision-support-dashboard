import { DecisionsView } from "@/components/decisions/decisions-view";
import { getOpenActions, getRecommendationsList } from "@/lib/db";

export const runtime = "nodejs";

export default async function DecisionsPage() {
  const [actions, recs] = await Promise.all([
    getOpenActions(),
    getRecommendationsList(),
  ]);
  const recommended = recs.filter(
    (r) => r.status === "accepted" || r.status === "implemented",
  );
  return <DecisionsView actions={actions} recommended={recommended} />;
}
