import { Flex, Button, Box } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

interface ForgotPasswordProps {}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
  const [forgotPassword] = useForgotPasswordMutation();
  const [complete, setComplete] = useState(false);
  return (
    <Wrapper big={false}>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword({ variables: values });
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>Check your email for a recovery link.</Box>
          ) : (
            <Form>
              <Box>
                <InputField label="Email" name="email" placeholder="Email..." />
              </Box>
              <Flex mt={4} justifyContent={"center"} align={"center"}>
                <Button
                  type={"submit"}
                  isLoading={isSubmitting}
                  bgColor={"goldenrod"}
                >
                  Send Link
                </Button>
              </Flex>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ForgotPassword);
