import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Profiles from "../components/Profiles";

describe("Profiles Component", () => {

  // ─── Rendering ───────────────────────────────────────────────────────────────

  describe("Initial Render", () => {
    it("renders the modal on initial mount", () => {
      render(React.createElement(Profiles));
      expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
    });

    it("renders the admin name", () => {
      render(React.createElement(Profiles));
      expect(screen.getByText("Admin Name")).toBeInTheDocument();
    });

    it("renders the admin email address", () => {
      render(React.createElement(Profiles));
      expect(screen.getByText("admin@email.address")).toBeInTheDocument();
    });

    it("renders the admin phone number", () => {
      render(React.createElement(Profiles));
      expect(screen.getByText("admin phone number")).toBeInTheDocument();
    });

    it("renders the location string", () => {
      render(React.createElement(Profiles));
      expect(screen.getByText("Muncipality - District - Ward")).toBeInTheDocument();
    });

    it("renders the Admin role badge", () => {
      render(React.createElement(Profiles));
      expect(screen.getByText("Admin")).toBeInTheDocument();
    });

    it("renders the Logout button", () => {
      render(React.createElement(Profiles));
      // The <a> is nested inside a <button>, so ARIA suppresses the link role.
      // Testing Library exposes this as a button named "Logout".
      expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
    });

    it("renders the profile avatar placeholder section", () => {
      render(React.createElement(Profiles));
      // The avatar is a styled <section> — confirm the heading and avatar container are co-located
      const heading = screen.getByText("Admin Name");
      expect(heading.tagName).toBe("H2");
    });

    it("renders the Close button with correct accessible name", () => {
      render(React.createElement(Profiles));
      const closeBtn = screen.getByRole("button", { name: /close/i });
      expect(closeBtn).toBeInTheDocument();
    });
  });

  // ─── Close / Dismiss Behaviour ───────────────────────────────────────────────

  describe("Close Button", () => {
    it("hides the modal when the Close button is clicked", () => {
      render(React.createElement(Profiles));
      const closeBtn = screen.getByRole("button", { name: /close/i });
      fireEvent.click(closeBtn);
      expect(screen.queryByText("Admin Name")).not.toBeInTheDocument();
    });

    it("removes the email from the DOM after closing", () => {
      render(React.createElement(Profiles));
      fireEvent.click(screen.getByRole("button", { name: /close/i }));
      expect(screen.queryByText("admin@email.address")).not.toBeInTheDocument();
    });

    it("removes the Logout button from the DOM after closing", () => {
      render(React.createElement(Profiles));
      fireEvent.click(screen.getByRole("button", { name: /close/i }));
      expect(screen.queryByRole("button", { name: /logout/i })).not.toBeInTheDocument();
    });

    it("returns null (renders nothing) after closing", () => {
      const { container } = render(React.createElement(Profiles));
      fireEvent.click(screen.getByRole("button", { name: /close/i }));
      expect(container.firstChild).toBeNull();
    });

    it("Close button is only clickable once (modal gone afterwards)", () => {
      render(React.createElement(Profiles));
      const closeBtn = screen.getByRole("button", { name: /close/i });
      fireEvent.click(closeBtn);
      // Button should no longer exist in the DOM
      expect(screen.queryByRole("button", { name: /close/i })).not.toBeInTheDocument();
    });
  });

  // ─── Logout ──────────────────────────────────────────────────────────────────

  describe("Logout", () => {
    it("renders the logout anchor tag inside the button", () => {
      render(React.createElement(Profiles));
      // The <a> is nested inside <button> — query the anchor directly via text
      const logoutAnchor = screen.getByText("Logout");
      expect(logoutAnchor.tagName).toBe("A");
    });

    it("logout anchor has an href attribute", () => {
      render(React.createElement(Profiles));
      const logoutAnchor = screen.getByText("Logout");
      expect(logoutAnchor).toHaveAttribute("href");
    });

    it("logout anchor is wrapped in a button", () => {
      render(React.createElement(Profiles));
      const logoutAnchor = screen.getByText("Logout");
      expect(logoutAnchor.closest("button")).toBeInTheDocument();
    });
  });

  // ─── Styling / Structure ─────────────────────────────────────────────────────

  describe("CSS Classes and Structure", () => {
    it("the root section has the expected positioning classes", () => {
      const { container } = render(React.createElement(Profiles));
      const root = container.firstChild as HTMLElement;
      expect(root.className).toMatch(/absolute/);
      expect(root.className).toMatch(/top-full/);
      expect(root.className).toMatch(/right-4/);
    });

    it("the Close button has the red background class", () => {
      render(React.createElement(Profiles));
      const closeBtn = screen.getByRole("button", { name: /close/i });
      expect(closeBtn.className).toMatch(/bg-red-600/);
    });

    it("the Admin badge has the gray background class", () => {
      render(React.createElement(Profiles));
      const badge = screen.getByText("Admin");
      expect(badge.className).toMatch(/bg-gray-200/);
    });
  });

  // ─── Snapshot ────────────────────────────────────────────────────────────────

  describe("Snapshot", () => {
    it("matches the snapshot when visible", () => {
      const { asFragment } = render(React.createElement(Profiles));
      expect(asFragment()).toMatchSnapshot();
    });

    it("matches the snapshot when dismissed (null)", () => {
      const { asFragment } = render(React.createElement(Profiles));
      fireEvent.click(screen.getByRole("button", { name: /close/i }));
      expect(asFragment()).toMatchSnapshot();
    });
  });
});