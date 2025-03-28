import QuestionPage from "./ClientPage";

export type paramsType = Promise<{ id: string }>;

type Props = {
  params: paramsType;
};

const Page = async ({ params }: Props) => {
  const { id } = await params;
  return <QuestionPage id={id} />;
};

export default Page;
