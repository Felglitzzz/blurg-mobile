import { gql } from "@apollo/client";

export const GET_USER = gql`
  query user {
    user {
      id
      email
      role
      profile {
        id
        firstName
        lastName
        phoneNumber
        image
      }
    }
  }
`;


export const REGISTER_USER = gql`
  mutation signup ($userRegistrationInput: UserRegistrationInput!) {
    signup(userRegistrationInput: $userRegistrationInput) {
        accessToken
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login ($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
        accessToken
    }
  }
`;

export const SAVE_BLOG = gql`
  mutation saveBlog ($saveBlogInput: SaveBlogInput!) {
    saveBlog(saveBlogInput: $saveBlogInput) {
      id
      heading
      title
      content
      image
      blogType
      createdDate
      updatedDate
      publishedDate
      category {
          name
      }
      profile {
          firstName
          lastName
      }
    }
  }
`;

