import React from "react";
import { Wrapper } from "../components/Wrapper";
import { Formik, Form } from "formik";
import { InputField } from "../components/InputField";
import { Box, Button, Flex } from "@chakra-ui/react";
import {
  LoginMutationVariables,
  MeDocument,
  MeQuery,
  useLoginMutation,
  useRegisterMutation,
} from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withApollo } from "../utils/withApollo";

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
  const [login] = useLoginMutation();
  const router = useRouter();
  return (
    <Wrapper big={false}>
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values: LoginMutationVariables, { setErrors }) => {
          const response = await login({
            variables: values,
            update: (cache, { data }) => {
              console.log(cache);
              console.log(data);
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  me: data?.login?.user,
                  __typename: "Query",
                },
              });
              cache.evict({ fieldName: "posts:{}" });
            },
          });
          console.log(response);
          if (response?.data?.login?.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response?.data?.login?.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              label="Email or username"
              name="usernameOrEmail"
              placeholder="Email or username..."
            />
            <Box mt={4}>
              <InputField label="Password" name="password" type={"password"} />
            </Box>
            <Flex justifyContent={"space-between"} align={"center"} mt={4}>
              <Button bgColor={"goldenrod"} type={"submit"}>
                Login
              </Button>
              <Button
                bgColor={"goldenrod"}
                onClick={() => router.push("/forgot-password")}
              >
                Forgot Password?
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: true })(Login);
