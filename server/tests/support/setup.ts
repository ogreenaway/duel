import supertest, { Test } from "supertest";

import TestAgent from "supertest/lib/agent";

/******************************************************************************
                                    Run
******************************************************************************/

let agent: TestAgent<Test> | undefined;

beforeAll(async () => {
  try {
    const app = (await import("@src/server")).default;
    agent = supertest.agent(app);
  } catch (error) {
    // If app import fails, some tests may not work (for unit tests that don't need the server)
    // This is expected for unit tests that don't require the Express app
  }
});

/******************************************************************************
                                    Export
******************************************************************************/

export { agent };
