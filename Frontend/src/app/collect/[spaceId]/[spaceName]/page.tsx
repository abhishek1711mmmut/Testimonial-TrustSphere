import ReviewForm from "@/components/CollectFeedback";

const TestimonialPage = ({
  params,
}: {
  params: { spaceId: string; spaceName: string };
}) => {
  const { spaceId, spaceName } = params;

  return (
    <div className="pt-20">
      <ReviewForm spaceId={spaceId} spaceName={spaceName} />
    </div>
  );
};

export default TestimonialPage;
