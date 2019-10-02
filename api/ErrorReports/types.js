export default `
type ErrorReport {
  _id: String
  user: User
  userId: String
  userAgent: String
  level: Int
  message: String
  path: String
  stack: [String]
  reactStack: [String]
  createdAtUTC: DateTime
  createdById: String
  createdBy: User
}

type ErrorReports {
  total: Int
  errorReports: [ErrorReport]
}

input ErrorReportInput {
  _id: String
  userId: String
  userAgent: String
  level: Int!
  message: String!
  path: String
  stack: [String]
  reactStack: [String]
}
`;
