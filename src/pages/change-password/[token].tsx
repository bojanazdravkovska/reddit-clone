import { NextPage } from "next";
import React from "react";
import { Wrapper } from "../../components/Wrapper";
import { Form, Formik } from "formik";
import { Box, Button, Flex } from "@chakra-ui/react";
import { InputField } from "../../components/InputField";
import { useChangePasswordMutation } from "../../generated/graphql";
import { useRouter } from "next/router";
import { toErrorMap } from "../../utils/toErrorMap";
import { withApollo } from "../../utils/withApollo";

const ChangePassword: NextPage<{}> = ({}) => {
  const [changePassword] = useChangePasswordMutation();
  const router = useRouter();
  return (
    <Wrapper big={false}>
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            variables: {
              token:
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
              newPassword: values.newPassword,
            },
          });
          if (response.data.changePassword.errors) {
            setErrors(toErrorMap(response.data.changePassword.errors));
          } else if (response.data.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box>
              <InputField
                label="New Password"
                name="newPassword"
                placeholder="New Password..."
                type="password"
              />
            </Box>
            <Flex mt={4} justifyContent={"center"} align={"center"}>
              <Button type="submit" bgColor={"goldenrod"}>
                Change Password
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ChangePassword);
