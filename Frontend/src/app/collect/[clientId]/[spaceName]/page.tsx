import CollectFeedback from "@/components/CollectFeedback";

const TestimonialPage = ({
  params,
}: {
  params: { clientId: string; spaceName: string };
}) => {
  const { clientId, spaceName } = params;

  return (
    <div className="pt-20">
      <CollectFeedback clientId={clientId} spaceName={spaceName} />
    </div>
  );
};

export default TestimonialPage;
