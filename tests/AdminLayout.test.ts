import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminLayout from "../layouts/AdminLayout"; 

// Mock Profiles so AdminLayout tests are isolated from Profiles internals.
// The mock renders a simple identifiable element instead of the real modal.
jest.mock("@/components/Profiles", () => ({
  __esModule: true,
  default: () => React.createElement("div", { "data-testid": "profiles-modal" }, "Profiles Modal"),
}));

describe("AdminLayout Component", () => {

  // ─── Static Structure ─────────────────────────────────────────────────────

  describe("Static Structure", () => {
    it("renders the portal title in the header", () => {
      render(React.createElement(AdminLayout));
      expect(screen.getByText("Muncipal Portal Project")).toBeInTheDocument();
    });

    it("renders the header element", () => {
      render(React.createElement(AdminLayout));
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("renders the main element", () => {
      render(React.createElement(AdminLayout));
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("renders the footer element", () => {
      render(React.createElement(AdminLayout));
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("renders the copyright notice in the footer", () => {
      render(React.createElement(AdminLayout));
      expect(screen.getByText(/© 2026 sudoers1/i)).toBeInTheDocument();
    });

    it("renders the avatar/profile trigger section", () => {
      const { container } = render(React.createElement(AdminLayout));
      // The clickable avatar is a <section> with rounded styling
      const avatar = container.querySelector(".rounded-4xl");
      expect(avatar).toBeInTheDocument();
    });

    it("header has the correct background class", () => {
      render(React.createElement(AdminLayout));
      const header = screen.getByRole("banner");
      expect(header.className).toMatch(/bg-gray-400/);
    });

    it("footer has the fixed positioning class", () => {
      render(React.createElement(AdminLayout));
      const footer = screen.getByRole("contentinfo");
      expect(footer.className).toMatch(/fixed/);
    });
  });

  // ─── Profiles Modal — Initial State ──────────────────────────────────────

  describe("Profiles Modal — Initial State", () => {
    it("does not render Profiles on initial mount", () => {
      render(React.createElement(AdminLayout));
      expect(screen.queryByTestId("profiles-modal")).not.toBeInTheDocument();
    });

    it("showModal defaults to false so Profiles is hidden", () => {
      render(React.createElement(AdminLayout));
      expect(screen.queryByText("Profiles Modal")).not.toBeInTheDocument();
    });
  });

  // ─── Profiles Modal — Show on Click ──────────────────────────────────────

  describe("Profiles Modal — Show on Click", () => {
    it("renders Profiles after clicking the avatar section", () => {
      const { container } = render(React.createElement(AdminLayout));
      const avatar = container.querySelector(".rounded-4xl") as HTMLElement;
      fireEvent.click(avatar);
      expect(screen.getByTestId("profiles-modal")).toBeInTheDocument();
    });

    it("shows the Profiles modal content after clicking the avatar", () => {
      const { container } = render(React.createElement(AdminLayout));
      const avatar = container.querySelector(".rounded-4xl") as HTMLElement;
      fireEvent.click(avatar);
      expect(screen.getByText("Profiles Modal")).toBeInTheDocument();
    });

    it("Profiles remains visible after a single click", () => {
      const { container } = render(React.createElement(AdminLayout));
      const avatar = container.querySelector(".rounded-4xl") as HTMLElement;
      fireEvent.click(avatar);
      expect(screen.getByTestId("profiles-modal")).toBeInTheDocument();
    });

    it("clicking the avatar multiple times keeps Profiles visible", () => {
      const { container } = render(React.createElement(AdminLayout));
      const avatar = container.querySelector(".rounded-4xl") as HTMLElement;
      fireEvent.click(avatar);
      fireEvent.click(avatar);
      // showModal is set to true on each click — modal stays visible
      expect(screen.getByTestId("profiles-modal")).toBeInTheDocument();
    });
  });

  // ─── Snapshot ─────────────────────────────────────────────────────────────

  describe("Snapshot", () => {
    it("matches snapshot before modal is opened", () => {
      const { asFragment } = render(React.createElement(AdminLayout));
      expect(asFragment()).toMatchSnapshot();
    });

    it("matches snapshot after modal is opened", () => {
      const { asFragment, container } = render(React.createElement(AdminLayout));
      const avatar = container.querySelector(".rounded-4xl") as HTMLElement;
      fireEvent.click(avatar);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});