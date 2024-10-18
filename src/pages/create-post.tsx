import React from "react";
import { Wrapper } from "../components/Wrapper";
import { Form, Formik } from "formik";
import { Box, Button, Flex } from "@chakra-ui/react";
import { InputField } from "../components/InputField";
import { useCreatePostMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { withApollo } from "../utils/withApollo";
import gql from "graphql-tag";

interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = ({}) => {
  const [createPost] = useCreatePostMutation();
  const { data } = useMeQuery();
  const router = useRouter();
  return (
    <Wrapper big={false}>
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values, { setErrors }) => {
          if (!data?.me) {
            const errorMap: Record<string, string> = {};
            errorMap["title"] = "You are not logged in";
            setErrors(errorMap);
          } else {
            await createPost({
              variables: { input: { title: values.title, text: values.text } },
              update(cache, { data: { createPost } }) {
                cache.modify({
                  fields: {
                    posts(existingPosts = []) {
                      if (!Array.isArray(existingPosts)) {
                        return [createPost];
                      }
                      const newPostRef = cache.writeFragment({
                        data: createPost,
                        fragment: gql`
                          fragment NewPost on Post {
                            id
                            createdAt
                            updatedAt
                            title
                            points
                            # text
                            # creatorId
                            textSnippet
                            voteStatus
                            creator {
                              id
                              username
                            }
                          }
                        `,
                      });
                      return [...existingPosts, newPostRef];
                    },
                  },
                });
              },
              // update: (cache) => {
              //   cache.evict({ fieldName: "posts:{}" });
              // },
            });
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box>
              <InputField label="Title" name="title" placeholder="Title..." />
            </Box>
            <Box mt={4}>
              <InputField
                label="Text"
                name="text"
                placeholder="Text..."
                textArea
              />
            </Box>
            <Flex mt={4} justifyContent={"center"} align={"center"}>
              <Button
                type="submit"
                isLoading={isSubmitting}
                bgColor={"goldenrod"}
              >
                Create Post
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(CreatePost);
