import "reflect-metadata";
import { gql } from "apollo-server-core";
import { ApolloServer } from "apollo-server";
import { clearDatabase, closeDatabase } from "../test.db.config";
import { startServer } from "../test.server";

export const GET_ALL_USERS = gql`
  query getAllUsers {
    getAllUsers {
      id
      firstname
      lastname
      email
      role
      picture
      mood {
        icon
        name
      }
      campus {
        name
      }
    }
  }
`;

export const GET_ONE_USER = gql`
  query getUserById($id: ID!) {
    getUserById(id: $id) {
      id
      firstname
      lastname
      email
      town
      role
      picture
      campus {
        id
        name
      }
    }
  }
`;
export const CREATE_USER = gql`
  mutation createUser($input: UserInput!) {
    createUser(input: $input) {
      id
      firstname
      lastname
      email
      town
      role
      campus {
        name
      }
      mood {
        name
        icon
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      firstname
      lastname
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($input: UserInput!) {
    updateUser(input: $input) {
      id
      firstname
      lastname
      email
      town
      role
      campus {
        name
      }
    }
  }
`;

describe("test suite", () => {
  let apollo: ApolloServer;

  beforeAll(async () => {
    apollo = await startServer();
  });
  afterEach(async () => await clearDatabase());

  afterAll((done): void => {
    closeDatabase().then(() => apollo.stop().then(() => done()));
  });

  it("should return an empty list of users", async () => {
    const res = await apollo.executeOperation({ query: GET_ALL_USERS });

    expect(res.data).toBeDefined();
  });

  it("should insert user", async () => {
    const res = await apollo.executeOperation({
      query: CREATE_USER,
      variables: {
        data: {
          firstname: "firstname1",
          password: "secretpass",
          lastname: "lastname1",
          email: "email1@gmail.com",
          town: "Cannes",
          role: "STUDENT",
          campus: {
            name: "Paris",
            id: "2",
          },
        },
      },
    });

    if (res.data) {
      expect(res.data).toHaveProperty("createUser");
      expect(res.data.createUser).toHaveProperty("email");
      expect(res.data.createCourse).toEqual({
        firstname: "firstname1",
        lastname: "lastname1",
        email: "email1@gmail.com",
        town: "Cannes",
        role: "STUDENT",
        campus: {
          name: "Paris",
          id: "2",
        },
      });
    }
  });

  it("should be able to retrieve a user by its id", async () => {
    const responseCreation = await apollo.executeOperation({
      query: CREATE_USER,
      variables: {
        data: {
          firstname: "firstname1",
          password: "secretpass",
          lastname: "lastname1",
          email: "email1@gmail.com",
          town: "Cannes",
          role: "STUDENT",
          campus: {
            name: "Paris",
            id: "2",
          },
        },
      },
    });

    if (responseCreation.data) {
      const res2 = await apollo.executeOperation({
        query: GET_ALL_USERS,
        variables: { id: responseCreation.data.createUser },
      });
      if (res2.data) {
        expect(responseCreation.data?.createUser).toEqual(
          res2.data.getUserById,
        );
      }
    }
  });

  it("should update a user", async () => {
    const responseCreation = await apollo.executeOperation({
      query: CREATE_USER,
      variables: {
        data: {
          firstname: "firstname1",
          password: "secretpass",
          lastname: "lastname1",
          email: "email1@gmail.com",
          town: "Cannes",
          role: "STUDENT",
          campus: {
            name: "Paris",
            id: "2",
          },
        },
      },
    });
    if (responseCreation.data) {
      const responseUpdate = await apollo.executeOperation({
        query: UPDATE_USER,
        variables: {
          data: {
            id: responseCreation.data.createUser.id,
            firstname: "firstname1",
            lastname: "lastname1",
            email: "email120@gmail.com",
            town: "Paris",
            role: "TEACHER",
            campus: {
              name: "Paris",
              id: "2",
            },
          },
        },
      });
      if (responseUpdate.data) {
        expect(responseUpdate.data.updateUser).toEqual({
          firstname: "firstname1",
          lastname: "lastname1",
          email: "email120@gmail.com",
          town: "Paris",
          role: "TEACHER",
          campus: {
            name: "Paris",
            id: "2",
          },
        });
      }
    }
  });

  it("should delete a user", async () => {
    const responseCreation = await apollo.executeOperation({
      query: CREATE_USER,
      variables: {
        data: {
          firstname: "firstname1",
          password: "secretpass",
          lastname: "lastname1",
          email: "email1@gmail.com",
          town: "Cannes",
          role: "STUDENT",
          campus: {
            name: "Paris",
            id: "2",
          },
        },
      },
    });

    if (responseCreation.data) {
      const responseDelete = await apollo.executeOperation({
        query: CREATE_USER,
        variables: { id: responseCreation.data.createUser.id },
      });
      if (responseDelete.data) {
        expect(responseDelete.data.deleteUser.firstname).toEqual({
          firstname: "firstname1",
          password: "secretpass",
          lastname: "lastname1",
          email: "email1@gmail.com",
          town: "Cannes",
          role: "STUDENT",
          campus: {
            name: "Paris",
            id: "2",
          },
        });
      }
    }
  });
});
