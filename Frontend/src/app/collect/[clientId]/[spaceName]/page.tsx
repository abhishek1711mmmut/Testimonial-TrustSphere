import ReviewForm from "@/components/CollectFeedback";

const TestimonialPage = ({
  params,
}: {
  params: { clientId: string; spaceName: string };
}) => {
  const { clientId, spaceName } = params;

  return (
    <div className="pt-20">
      <ReviewForm clientId={clientId} spaceName={spaceName} />
    </div>
  );
};

export default TestimonialPage;
