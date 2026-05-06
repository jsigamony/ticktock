/// <reference types="cypress" />

describe("Login screen", () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();
    cy.visit("/login");
  });

  it("renders the login form", () => {
    cy.contains("h2", "Welcome back").should("be.visible");
    cy.get('input[name="email"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.contains("button", "Sign in").should("be.enabled");
    cy.contains("ticktock").should("be.visible");
  });

  it("shows an error for invalid credentials", () => {
    cy.intercept("POST", "/api/auth/callback/credentials*").as("credentials");

    cy.get('input[name="email"]')
      .clear()
      .type("alice@ticktock.dev")
      .should("have.value", "alice@ticktock.dev");
    cy.get('input[name="password"]')
      .clear()
      .type("badpassword", { log: false })
      .should("have.value", "badpassword");
    cy.contains("button", "Sign in").click();

    cy.wait("@credentials");
    cy.contains("Invalid credentials").should("be.visible");
    cy.location("pathname").should("eq", "/login");
  });

  it("signs in with valid credentials", () => {
    cy.intercept("POST", "/api/auth/callback/credentials*").as("credentials");

    cy.get('input[name="email"]')
      .clear()
      .type("alice@ticktock.dev")
      .should("have.value", "alice@ticktock.dev");
    cy.get('input[name="password"]')
      .clear()
      .type("password123", { log: false })
      .should("have.value", "password123");
    cy.contains("button", "Sign in").click();

    cy.wait("@credentials");
    cy.location("pathname", { timeout: 10000 }).should("eq", "/dashboard");
    cy.contains("h1", "Your Timesheets").should("be.visible");
  });
});
