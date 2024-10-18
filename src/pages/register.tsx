import React from "react";
import { Wrapper } from "../components/Wrapper";
import { Formik, Form } from "formik";
import { InputField } from "../components/InputField";
import { Box, Button, Flex } from "@chakra-ui/react";
import { MeDocument, MeQuery, useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withApollo } from "../utils/withApollo";

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
  const router = useRouter();
  const [register] = useRegisterMutation();
  return (
    <Wrapper big={false}>
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({
            variables: { options: values },
            update(cache, { data }) {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  me: data?.register?.user,
                },
              });
            },
          });
          if (response.data.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data.register.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField label="Email" name="email" placeholder="Email..." />
            <Box mt={4}>
              <InputField
                label="Username"
                name="username"
                placeholder="Username..."
              />
            </Box>
            <Box mt={4}>
              <InputField label="Password" name="password" type={"password"} />
            </Box>
            <Flex justifyContent={"center"} align={"center"} mt={4}>
              <Button bgColor={"goldenrod"} color={"white"} type={"submit"}>
                Register
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: true })(Register);
