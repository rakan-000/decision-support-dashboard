import { RecommendationsView } from "@/components/recommendations/recommendations-view";
import { getRecommendationsList } from "@/lib/db";

export const runtime = "nodejs";

export default async function RecommendationsPage() {
  const items = await getRecommendationsList();
  return <RecommendationsView items={items} />;
}
