import React from "react";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { Flex, IconButton } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
  redirect?: boolean;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
  redirect,
}) => {
  const { data } = useMeQuery();
  const [deletePost] = useDeletePostMutation();
  const router = useRouter();
  if (data?.me?.id !== creatorId) {
    return null;
  }
  return (
    <Flex>
      <IconButton
        bgColor={"goldenrod"}
        aria-label="update-post"
        onClick={() => router.push(`/post/edit/${id}`)}
        icon={<EditIcon />}
      />
      <IconButton
        ml={4}
        bgColor={"crimson"}
        aria-label="delete-post"
        onClick={async () => {
          await deletePost({
            variables: { id: id },
            update: (cache) => cache.evict({ id: "Post:" + id }),
          });
          if (redirect) {
            router.push("/");
          }
        }}
        icon={<DeleteIcon />}
      />
    </Flex>
  );
};
