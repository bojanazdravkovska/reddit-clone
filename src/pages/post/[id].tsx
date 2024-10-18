import React from "react";
import { withApollo } from "../../utils/withApollo";
import { useRouter } from "next/router";
import { usePostQuery } from "../../generated/graphql";
import { Layout } from "../../components/Layout";
import { Box, Heading, Text } from "@chakra-ui/react";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";

interface PostProps {}

const Post: React.FC<PostProps> = ({}) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const { data, error, loading } = usePostQuery({
    skip: intId === -1,
    variables: { id: intId },
  });
  if (loading) {
    return (
      <Layout>
        <Box>Loading...</Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box>{error.message}</Box>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>Post deleted.</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box>
        <Heading>{data.post.title}</Heading>
        <Text my={4}>{data.post.text}</Text>
        <EditDeletePostButtons
          id={data.post.id}
          creatorId={data.post.creator.id}
        />
      </Box>
    </Layout>
  );
};

export default withApollo({ ssr: false })(Post);
