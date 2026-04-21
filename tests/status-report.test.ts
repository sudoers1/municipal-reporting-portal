import { Report } from "@/lib/report";
import { Status } from "@/lib/status";

describe("Status enum", () => {
  test("has correct values", () => {
    expect(Status.Acknowledged).toBe("Acknowledged");
    expect(Status.InProgress).toBe("In progress");
    expect(Status.Resolved).toBe("Resolved");
  });

  test("has exactly three statuses", () => {
    expect(Object.keys(Status)).toHaveLength(3);
  });
});

describe("Report", () => {
  const creationTime = new Date("2024-01-01");

  function makeReport(overrides?: Partial<{
    municipality: string;
    status: Status;
    issuetype: string;
    creationtime: Date;
    userid: string;
    image: string;
    details: string;
  }>) {
    return new Report(
      overrides?.municipality ?? "Cape Town",
      overrides?.status ?? Status.Acknowledged,
      overrides?.issuetype ?? "Potholes",
      overrides?.creationtime ?? creationTime,
      overrides?.userid ?? "user1",
      overrides?.image,
      overrides?.details,
    );
  }

  describe("getters return constructor values", () => {
    test("getMunicipality returns correct value", () => {
      const report = makeReport({ municipality: "Hermanus" });
      expect(report.getMunicipality()).toBe("Hermanus");
    });

    test("getStatus returns correct value", () => {
      const report = makeReport({ status: Status.InProgress });
      expect(report.getStatus()).toBe("In progress");
    });

    test("getIssueType returns correct value", () => {
      const report = makeReport({ issuetype: "Flooding" });
      expect(report.getIssueType()).toBe("Flooding");
    });

    test("getCreationTime returns correct date", () => {
      const report = makeReport({ creationtime: creationTime });
      expect(report.getCreationTime()).toEqual(creationTime);
    });

    test("getUserID returns correct value", () => {
      const report = makeReport({ userid: "user42" });
      expect(report.getUserID()).toBe("user42");
    });
  });

  describe("optional fields", () => {
    test("getImage returns image when provided", () => {
      const report = makeReport({ image: "http://img.url/photo.jpg" });
      expect(report.getImage()).toBe("http://img.url/photo.jpg");
    });

    test("getImage returns fallback when not provided", () => {
      const report = makeReport();
      expect(report.getImage()).toBe("No image");
    });

    test("getDetails returns details when provided", () => {
      const report = makeReport({ details: "Large pothole on main road" });
      expect(report.getDetails()).toBe("Large pothole on main road");
    });

    test("getDetails returns fallback when not provided", () => {
      const report = makeReport();
      expect(report.getDetails()).toBe("No details");
    });
  });

  describe("setters update values correctly", () => {
    test("setMunicipality updates municipality", () => {
      const report = makeReport();
      report.setMunicipality("Stellenbosch");
      expect(report.getMunicipality()).toBe("Stellenbosch");
    });

    test("setStatus updates status", () => {
      const report = makeReport({ status: Status.Acknowledged });
      report.setStatus(Status.Resolved);
      expect(report.getStatus()).toBe("Resolved");
    });

    test("setImage updates image", () => {
      const report = makeReport();
      report.setImage("http://new-image.url/photo.jpg");
      expect(report.getImage()).toBe("http://new-image.url/photo.jpg");
    });

    test("setIssueType updates issue type", () => {
      const report = makeReport();
      report.setIssueType("Burst pipe");
      expect(report.getIssueType()).toBe("Burst pipe");
    });

    test("setDetails updates details", () => {
      const report = makeReport();
      report.setDetails("Updated description");
      expect(report.getDetails()).toBe("Updated description");
    });

    test("setCreationTime updates creation time", () => {
      const report = makeReport();
      const newDate = new Date("2025-06-15");
      report.setCreationTime(newDate);
      expect(report.getCreationTime()).toEqual(newDate);
    });

    test("setUserID updates user id", () => {
      const report = makeReport();
      report.setUserID("user99");
      expect(report.getUserID()).toBe("user99");
    });
  });

  describe("status transitions", () => {
    test("can transition from Acknowledged to InProgress", () => {
      const report = makeReport({ status: Status.Acknowledged });
      report.setStatus(Status.InProgress);
      expect(report.getStatus()).toBe("In progress");
    });

    test("can transition from InProgress to Resolved", () => {
      const report = makeReport({ status: Status.InProgress });
      report.setStatus(Status.Resolved);
      expect(report.getStatus()).toBe("Resolved");
    });
  });
});