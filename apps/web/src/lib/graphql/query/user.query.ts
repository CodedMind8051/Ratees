import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser {
    getUser {
      _id
      username
      email
      profileImage
    }
  }
`;

export const UPDATE_USERNAME = gql`
  mutation UpdateUsername($username: String!) {
    updateUsername(username: $username) {
      _id
      username
      email
      profileImage
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($currentPassword: String!, $newPassword: String!) {
    updatePassword(currentPassword: $currentPassword, newPassword: $newPassword)
  }
`;
