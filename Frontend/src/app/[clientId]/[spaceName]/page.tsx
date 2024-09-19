// collect customers feedback from the space


const TestimonialPage = ({
    params,
}: {
    params: { clientId: string; spaceName: string };
}) => {
    const { clientId, spaceName } = params;

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

    // const router = useRouter();

    // useEffect(() => {
    //     router.push(`/${clientId}/${spaceName}`);
    // }, [router, clientId, spaceName]);

    // const [space, setSpace] = useState<any>(null);
    // const [isLoading, setIsLoading] = useState<boolean>(true);
    // const [error, setError] = useState<any>(null);

    // useEffect(() => {
    //     const fetchSpace = async () => {
    //         try {
    //             const response = await fetch(
    //                 `https://api.trustsphere.xyz/v1/space/${clientId}/${spaceName}`,
    //             );
    //             const data = await response.json();
    //             setSpace(data);
    //             setIsLoading(false);
    //         } catch (error) {
    //             setError(error);
    //             setIsLoading(false);
    //         }
    //     };

    //     if (clientId && spaceName) {
    //         fetchSpace();
    //     }
    // }, [clientId, spaceName]);

    return (
        <div className="pb-20 pt-40">
            <p>customer feedback page</p>
            <p>{clientId}</p>
            <p>{spaceName}</p>
        </div>
    );
};

export default TestimonialPage;
