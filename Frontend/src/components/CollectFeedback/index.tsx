import Link from "next/link";

const CollectFeedback = ({
  clientId,
  spaceName,
}: {
  clientId: string;
  spaceName: string;
}) => {
  // create a temp spaceInfo object
  // const spaceInfo = {
  //     spaceName,
  //     companyLogo: null,
  //     headerTitle: "This is a header title",
  //     customMessage: "This is a custom message",
  //     questions: [
  //         "Who are you / what are you working on?",
  //         "How has [our product / service] helped you?",
  //         "What is the best thing about [our product / service]",
  //     ],
  // };
  return <div className="animate_top">feedback component</div>;
};

export default CollectFeedback;
