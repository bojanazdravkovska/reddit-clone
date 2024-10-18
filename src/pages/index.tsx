import React from "react";
import { Layout } from "../components/Layout";
import { withApollo } from "../utils/withApollo";
import { usePostsQuery } from "../generated/graphql";
import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { UpdootSection } from "../components/UpdootSection";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";

const Index = () => {
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });

  const router = useRouter();

  if (!loading && !data) {
    return (
      <div>
        <div>you got query failed for some reason</div>
        <div>{error?.message}</div>
      </div>
    );
  }
  return (
    <Layout>
      {!data && loading ? (
        <Box>Loading..</Box>
      ) : (
        <Box>
          <Flex justifyContent={"space-between"} align={"center"}>
            <Heading>Posts</Heading>
            <Button
              onClick={() => router.push("/create-post")}
              bg={"goldenrod"}
            >
              Create Post
            </Button>
          </Flex>
          <Box border={"1px solid goldenrod"} mt={8}>
            <Stack spacing={8}>
              {data?.posts.posts?.map((p) => {
                return (
                  <Box borderWidth={"1px"} shadow={"md"} p={2} key={p.id}>
                    <Flex justifyContent={"space-between"} align={"center"}>
                      <Box>
                        <Heading
                          _hover={{ cursor: "pointer" }}
                          onClick={() => router.push(`/post/${p.id}`)}
                          as={"h4"}
                          size={"md"}
                        >
                          {p.title}
                        </Heading>
                        <Text mt={4}>{p.textSnippet}...</Text>
                        <Text mt={4}>Posted by: {p.creator.username}</Text>
                        <EditDeletePostButtons
                          id={p.id}
                          creatorId={p.creator.id}
                        />
                      </Box>
                      <Box>
                        <UpdootSection post={p} />
                      </Box>
                    </Flex>
                  </Box>
                );
              })}
            </Stack>
          </Box>
          <Flex mt={4} justifyContent={"center"} align={"center"}>
            {data?.posts?.hasMore && (
              <Button
                onClick={() => {
                  fetchMore({
                    variables: {
                      limit: variables?.limit,
                      cursor:
                        data.posts.posts[data.posts.posts.length - 1].createdAt,
                    },
                  });
                }}
                bgColor={"goldenrod"}
              >
                Load More
              </Button>
            )}
          </Flex>
        </Box>
      )}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Index);
