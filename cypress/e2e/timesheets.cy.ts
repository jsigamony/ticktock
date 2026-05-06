/// <reference types="cypress" />

const paginatedTimesheets = Array.from({ length: 7 }, (_, index) => {
  const day = String(index + 1).padStart(2, "0");

  return {
    id: `page-ts-${index + 1}`,
    userId: "user-1",
    weekStart: `2025-06-${day}`,
    weekEnd: `2025-06-${String(index + 7).padStart(2, "0")}`,
    totalHours: 40 - index,
    status: index % 3 === 0
      ? "completed"
      : index % 3 === 1
        ? "incomplete"
        : "missing",
  };
});

const dateRangeTimesheets = [
  {
    id: "range-ts-1",
    userId: "user-1",
    weekStart: "2025-06-02",
    weekEnd: "2025-06-08",
    totalHours: 40,
    status: "completed",
  },
  {
    id: "range-ts-2",
    userId: "user-1",
    weekStart: "2025-06-09",
    weekEnd: "2025-06-15",
    totalHours: 24,
    status: "incomplete",
  },
  {
    id: "range-ts-3",
    userId: "user-1",
    weekStart: "2025-06-16",
    weekEnd: "2025-06-22",
    totalHours: 0,
    status: "missing",
  },
  {
    id: "range-ts-4",
    userId: "user-1",
    weekStart: "2025-06-23",
    weekEnd: "2025-06-29",
    totalHours: 40,
    status: "completed",
  },
];

const timesheetDetail = {
  timesheet: {
    id: "ts-1",
    userId: "user-1",
    weekStart: "2025-04-28",
    weekEnd: "2025-05-04",
    totalHours: 38,
    status: "incomplete",
  },
  days: [
    {
      date: "2025-04-28",
      entries: [
        {
          id: "e-1",
          timesheetId: "ts-1",
          date: "2025-04-28",
          project: "Project Alpha",
          task: "Frontend development",
          hours: 8,
          description: "Built login page components",
        },
      ],
    },
  ],
  loggedHours: 38,
  targetHours: 40,
};

const addedEntry = {
  id: "e-cypress",
  timesheetId: "ts-1",
  date: "2025-04-28",
  project: "Project Delta",
  task: "UI design",
  hours: 1,
  description: "Cypress add entry coverage",
};

const editedEntry = {
  ...addedEntry,
  project: "Project Gamma",
  task: "Research",
  hours: 2,
  description: "Cypress edit entry coverage",
};

function login(email = "alice@ticktock.dev", password = "password123") {
  cy.clearAllCookies();
  cy.clearAllLocalStorage();
  cy.clearAllSessionStorage();
  cy.intercept("POST", "/api/auth/callback/credentials*").as("credentials");
  cy.visit("/login");
  cy.get('input[name="email"]').clear().type(email).should("have.value", email);
  cy.get('input[name="password"]')
    .clear()
    .type(password, { log: false })
    .should("have.value", password);
  cy.contains("button", "Sign in").click();
  cy.wait("@credentials");
  cy.location("pathname", { timeout: 10000 }).should("eq", "/dashboard");
}

describe("Timesheets", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/timesheets?userId=*").as("getTimesheets");
    login();
    cy.wait("@getTimesheets")
      .its("request.url")
      .should("include", "userId=user-1");
  });

  it("shows the authenticated user's timesheets", () => {
    cy.contains("Alice Johnson").should("be.visible");
    cy.contains("h1", "Your Timesheets").should("be.visible");
    cy.contains("Completed").should("be.visible");
    cy.contains("Incomplete").should("be.visible");
    cy.contains("Missing").should("not.exist");
    cy.contains("Showing 1-2 of 2").should("be.visible");
  });

  it("opens a timesheet detail view", () => {
    cy.intercept("GET", "/api/timesheets/ts-1", timesheetDetail).as(
      "getTimesheetDetail",
    );

    cy.contains("button", "Update").click();
    cy.wait("@getTimesheetDetail");

    cy.contains(/This week.s timesheet/).should("be.visible");
    cy.contains("Frontend development").should("be.visible");
    cy.contains("Project Alpha").should("be.visible");
    cy.contains("38/40 hrs").should("be.visible");
  });

  it("adds, edits, and deletes a timesheet entry", () => {
    cy.intercept("GET", "/api/timesheets/ts-1", timesheetDetail).as(
      "getTimesheetDetail",
    );
    cy.intercept("POST", "/api/timesheets/ts-1", {
      statusCode: 201,
      body: addedEntry,
    }).as("addEntry");
    cy.intercept("PATCH", "/api/timesheets/ts-1", editedEntry).as("editEntry");
    cy.intercept("DELETE", "/api/timesheets/ts-1", editedEntry).as(
      "deleteEntry",
    );

    cy.contains("button", "Update").click();
    cy.wait("@getTimesheetDetail");
    cy.contains("38/40 hrs").should("be.visible");

    cy.contains("+ Add new task").click();
    cy.contains("h2", "Add New Entry").should("be.visible");
    cy.get("select").eq(0).select("Project Delta");
    cy.get("select").eq(1).select("UI design");
    cy.get("textarea").clear().type("Cypress add entry coverage");
    cy.contains("button", "Add entry").click();

    cy.wait("@addEntry").then(({ request, response }) => {
      expect(response?.statusCode).to.eq(201);
      expect(request.body).to.include({
        project: "Project Delta",
        task: "UI design",
        hours: 1,
      });
    });
    cy.contains("UI design").should("be.visible");
    cy.contains("Project Delta").should("be.visible");
    cy.contains("39/40 hrs").should("be.visible");

    cy.contains(".relative", "UI design")
      .find('button[aria-label="Entry actions"]')
      .click();
    cy.contains('[role="menuitem"]', "Edit").click();
    cy.contains("h2", "Edit Entry").should("be.visible");
    cy.get("select").eq(0).select("Project Gamma");
    cy.get("select").eq(1).select("Research");
    cy.get("textarea").clear().type("Cypress edit entry coverage");
    cy.contains("button", "+").click();
    cy.contains("button", "+").click();
    cy.contains("button", "Save changes").click();

    cy.wait("@editEntry").then(({ request, response }) => {
      expect(response?.statusCode).to.eq(200);
      expect(request.body).to.include({
        entryId: "e-cypress",
        project: "Project Gamma",
        task: "Research",
        hours: 2,
      });
    });
    cy.contains("Research").should("be.visible");
    cy.contains("Project Gamma").should("be.visible");
    cy.contains("UI design").should("not.exist");
    cy.contains("40/40 hrs").should("be.visible");

    cy.on("window:confirm", () => true);
    cy.contains(".relative", "Research")
      .find('button[aria-label="Entry actions"]')
      .click();
    cy.contains('[role="menuitem"]', "Delete").click();

    cy.wait("@deleteEntry").then(({ request, response }) => {
      expect(response?.statusCode).to.eq(200);
      expect(request.body).to.deep.equal({ entryId: "e-cypress" });
    });
    cy.contains("Research").should("not.exist");
    cy.contains("38/40 hrs").should("be.visible");
  });

  it("paginates the timesheets table", () => {
    cy.intercept("GET", "/api/timesheets?userId=*", paginatedTimesheets).as(
      "getPaginatedTimesheets",
    );

    login();
    cy.wait("@getPaginatedTimesheets");

    cy.contains("Showing 1-5 of 7").should("be.visible");
    cy.get("tbody tr").should("have.length", 5);
    cy.get("tbody tr").first().should("contain", "Jun 1");
    cy.get("tbody tr").last().should("contain", "Jun 5");

    cy.contains("button", "Next").click();
    cy.contains("Showing 6-7 of 7").should("be.visible");
    cy.get("tbody tr").should("have.length", 2);
    cy.get("tbody tr").first().should("contain", "Jun 6");
    cy.get("tbody tr").last().should("contain", "Jun 7");

    cy.contains("button", "Previous").click();
    cy.contains("Showing 1-5 of 7").should("be.visible");

    cy.get('select[aria-label="Rows per page"]').select("10");
    cy.contains("Showing 1-7 of 7").should("be.visible");
    cy.get("tbody tr").should("have.length", 7);
    cy.contains("button", "Next").should("be.disabled");
  });

  it("filters every week overlapping the selected date range", () => {
    cy.intercept("GET", "/api/timesheets?userId=*", dateRangeTimesheets).as(
      "getRangeTimesheets",
    );

    login();
    cy.wait("@getRangeTimesheets");

    cy.get('input[aria-label="Filter start date"]').type("2025-06-05");
    cy.get('input[aria-label="Filter end date"]').type("2025-06-17");

    cy.contains("Showing 1-3 of 3").should("be.visible");
    cy.get("tbody tr").should("have.length", 3);
    cy.get("tbody tr").eq(0).should("contain", "Jun 2");
    cy.get("tbody tr").eq(1).should("contain", "Jun 9");
    cy.get("tbody tr").eq(2).should("contain", "Jun 16");
    cy.contains("Jun 23").should("not.exist");

    cy.contains("Clear filters").click();
    cy.contains("Showing 1-4 of 4").should("be.visible");
  });

  it("supports open-ended date filters", () => {
    cy.intercept("GET", "/api/timesheets?userId=*", dateRangeTimesheets).as(
      "getRangeTimesheets",
    );

    login();
    cy.wait("@getRangeTimesheets");

    cy.get('input[aria-label="Filter start date"]').type("2025-06-17");
    cy.contains("Showing 1-2 of 2").should("be.visible");
    cy.get("tbody tr").eq(0).should("contain", "Jun 16");
    cy.get("tbody tr").eq(1).should("contain", "Jun 23");

    cy.contains("Clear filters").click();
    cy.get('input[aria-label="Filter end date"]').type("2025-06-10");
    cy.contains("Showing 1-2 of 2").should("be.visible");
    cy.get("tbody tr").eq(0).should("contain", "Jun 2");
    cy.get("tbody tr").eq(1).should("contain", "Jun 9");
  });
});
