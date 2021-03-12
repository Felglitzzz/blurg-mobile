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

export const GET_MY_BLOG = gql`
  query user {
    user {
      id
      profile {
        fullName
      }
      blogs {
        totalCount
        list {
          id
          title
          content
          createdDate
          updatedDate
        }
      }
    }
  }
`;

export const GET_ALL_BLOGS = gql`
query fetchAllBlogs {
  fetchAllBlogs {
    totalCount   
    list {
      id
      title
      content
      createdDate
      updatedDate
      profile {
          fullName
      }
    }
  }
}`;

export const GET_ONE_BLOG = gql`
  query fetchOneBlog($id: String!) {
    fetchOneBlog(id: $id) {
      id
      title
      content
      createdDate
      updatedDate
      profile {
          fullName
      }
    }
  }`

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
      title
      content
      createdDate
      updatedDate
      profile {
        fullName
      }
    }
  }
`;

