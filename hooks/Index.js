import request, { gql } from "graphql-request";
const MASTER_URL =
  "https://api-us-east-1-shared-usea1-02.hygraph.com/v2/clwt6l7rm004n07w8upkcznlw/master";

export const updateProfileInfo = async (
  paidUpdate,
  paidStatus,
  user,
  FullName,
  score=0,
  paidDate = 0
) => {
  const email = user?.primaryEmailAddress.emailAddress;
  const profilePic = user?.imageUrl;
  if (paidUpdate) {
    const GET_ITEMS =gql`
    mutation MyMutation {
      upsertStudent(
        upsert: {create: {email: "${email}",
        fullName: "${fullName}", 
        paidDate: ${paidDate}, 
        paidStatus: "${paidStatus}", 
        profilePic: "${profilePic}", 
        score: ${score}}, 
        update: {paidDate: ${paidDate}, 
          paidStatus: "${paidStatus}", 
          profilePic: "${profilePic}", 
          score: ${score}}}
        where: {email: "${email}"}
      ) {
        id
      }
      publishStudent(where: {email: "${email}"}) {
        id
      }
    }
`;
    const result = await request(MASTER_URL, GET_ITEMS);
    return result;
  } else {
    const GET_ITEMS =
      gql`
      mutation MyMutation {
        upsertStudent(
          upsert: {create: {email: "${email}",
          fullName: "${FullName}", 
          paidDate: ${paidDate}, 
          paidStatus: "${paidStatus}", 
          profilePic: "${profilePic}", 
          score: ${score}}, 
          update: {
            score: ${score},
            fullName: "${FullName}", 
            profilePic: "${profilePic}"}}
          where: {email: "${email}"}
        ) {
          id
        }
        publishStudent(where: {email: "${email}"}) {
          id
        }
      }
  `;
    const result = await request(MASTER_URL, GET_ITEMS);
    return result;
  }
};

export const leaderBoardInfo = async() => {
  const GET_ITEMS = gql`
    query Students {
      students(orderBy: score_DESC) {
        fullName
        profilePic
        score
      }
    }
  `;
  
  const result = await request(MASTER_URL, GET_ITEMS);
    return result;
}

export const getStudentInfo = async (userEmail) => {
  const GET_ITEMS = gql`
    query Students {
      student(where: {email: "${userEmail}"}) {
        paidStatus
        school
        score
        paidDate
      }
    }
  `;
  const result = await request(MASTER_URL, GET_ITEMS);
    return result;
}

export const updatePayment = async (Email, paidDate, transId) => {
  const GET_ITEMS = gql`
  mutation MyMutation {
    upsertStudent(
      upsert: {update: {paidDate: ${paidDate}, paidStatus: "Yes", transId: "${transId}"}, create: {email: ""}}
      where: {email: "${Email}"}
    ) {
      id
    }
    publishStudent(where: {email: "${Email}"}) {
      id
    }
  }
  `;
  const result = await request(MASTER_URL, GET_ITEMS);
    return result;
}

export const updateIsPaid = async (Email, isPaid) => {
  const GET_ITEMS = gql`
  mutation MyMutation {
    upsertStudent(
      upsert: {update: {paidStatus: "${isPaid}"}, create: {email: ""}}
      where: {email: "${Email}"}
    ) {
      id
    }
    publishStudent(where: {email: "${Email}"}) {
      id
    }
  }
  `;
  const result = await request(MASTER_URL, GET_ITEMS);
    return result;
}

export const getTopicList = async () => {
  const GET_ITEMS = gql`
  query Grades {
    topics() {
      createdBy {
        name
      }
      grade
      banner {
        url
      }
      subtopics
      topic
      topicDetails {
        title
        example1 {
          markdown
        }
        example2 {
          markdown
        }
        exercise {
          markdown
        }
        explanation {
          markdown
        }
        extras {
          markdown
        }
      }
    }
  }
  `;

  const result = await request(MASTER_URL, GET_ITEMS);
    return result;
}

export const getQuestions = async (category) => {
  const GET_ITEMS = gql`
  query MyQuery {
    assessments {
      questionCategory
      questions {
        answer
        question {
          html
        }
        questionSolution {
          html
        }
      }
    }
  }
  `;

  const result = await request(MASTER_URL, GET_ITEMS);
    return result;
}