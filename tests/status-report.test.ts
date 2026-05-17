import { Priority } from "@/lib/priority";
import { Report } from "@/lib/structures/report";
import { Status } from "@/lib/status";

describe("Status enum", () => {
  test("has correct values", () => {
    expect(Status.Acknowledged).toBe("Acknowledged");
    expect(Status.InProgress).toBe("In progress");
    expect(Status.Resolved).toBe("Resolved");
    expect(Status.Pending).toBe("Pending");
    expect(Status.Duplicate).toBe("Duplicate");
  });

  test("has exactly five statuses", () => {
    expect(Object.keys(Status)).toHaveLength(5);
  });
});

describe("Priority enum", () => {
  test("has correct values", () => {
    expect(Priority.Critical).toBe("Critical");
    expect(Priority.High).toBe("High");
    expect(Priority.Medium).toBe("Medium");
    expect(Priority.Low).toBe("Low");
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
    priority: Priority;
    complaintid?: string;
    image?: string;
    details?: string;
    address?: string;
    ward_id?: string;
    latitude?: number;
    longitude?: number;
    coords?: string;
    linked_complaint_id?: number;
  }>) {
    return new Report(
      overrides?.municipality ?? "Cape Town",
      overrides?.status ?? Status.Acknowledged,
      overrides?.issuetype ?? "Potholes",
      overrides?.creationtime ?? creationTime,
      overrides?.userid ?? "user1",
      overrides?.priority ?? Priority.Low,
      overrides?.complaintid,
      overrides?.image,
      overrides?.details,
      overrides?.address,
      overrides?.ward_id,
      overrides?.latitude,
      overrides?.longitude,
      overrides?.coords,
      overrides?.linked_complaint_id,
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

    test("getPriority returns correct value", () => {
      const report = makeReport({ priority: Priority.Low });
      expect(report.getPriority()).toBe(Priority.Low);
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

  // NEW TESTS FOR ADDITIONAL FIELDS (lines 56-73, 76-93)
  describe("additional location fields", () => {
    test("getAddress returns address when provided", () => {
      const report = makeReport({ address: "123 Main Street" });
      expect(report.getAddress()).toBe("123 Main Street");
    });

    test("getAddress returns fallback when not provided", () => {
      const report = makeReport();
      expect(report.getAddress()).toBe("No address");
    });

    test("getWardId returns ward_id when provided", () => {
      const report = makeReport({ ward_id: "Ward-5" });
      expect(report.getWardId()).toBe("Ward-5");
    });

    test("getWardId returns fallback when not provided", () => {
      const report = makeReport();
      expect(report.getWardId()).toBe("Not assigned");
    });

    test("getLatitude returns latitude when provided", () => {
      const report = makeReport({ latitude: -26.2 });
      expect(report.getLatitude()).toBe(-26.2);
    });

    test("getLatitude returns undefined when not provided", () => {
      const report = makeReport();
      expect(report.getLatitude()).toBeUndefined();
    });

    test("getLongitude returns longitude when provided", () => {
      const report = makeReport({ longitude: 28.0 });
      expect(report.getLongitude()).toBe(28.0);
    });

    test("getLongitude returns undefined when not provided", () => {
      const report = makeReport();
      expect(report.getLongitude()).toBeUndefined();
    });

    test("getCoords returns coords when provided", () => {
      const report = makeReport({ coords: "-26.2,28.0" });
      expect(report.getCoords()).toBe("-26.2,28.0");
    });

    test("getCoords returns empty string when not provided", () => {
      const report = makeReport();
      expect(report.getCoords()).toBe("");
    });

    test("getLinkedComplaintId returns linked_complaint_id when provided", () => {
      const report = makeReport({ linked_complaint_id: 5 });
      expect(report.getLinkedComplaintId()).toBe(5);
    });

    test("getLinkedComplaintId returns undefined when not provided", () => {
      const report = makeReport();
      expect(report.getLinkedComplaintId()).toBeUndefined();
    });
  });

  // NEW TESTS FOR SETTERS (lines 76-93)
  describe("setters for additional fields", () => {
    test("setAddress updates address", () => {
      const report = makeReport();
      report.setAddress("456 Oak Avenue");
      expect(report.getAddress()).toBe("456 Oak Avenue");
    });

    test("setWardId updates ward_id", () => {
      const report = makeReport();
      report.setWardId("Ward-10");
      expect(report.getWardId()).toBe("Ward-10");
    });

    test("setLatitude updates latitude", () => {
      const report = makeReport();
      report.setLatitude(-33.9);
      expect(report.getLatitude()).toBe(-33.9);
    });

    test("setLongitude updates longitude", () => {
      const report = makeReport();
      report.setLongitude(18.4);
      expect(report.getLongitude()).toBe(18.4);
    });

    test("setCoords updates coords", () => {
      const report = makeReport();
      report.setCoords("-33.9,18.4");
      expect(report.getCoords()).toBe("-33.9,18.4");
    });

    test("setLinkedComplaintId updates linked_complaint_id", () => {
      const report = makeReport();
      report.setLinkedComplaintId(10);
      expect(report.getLinkedComplaintId()).toBe(10);
    });
  });

  describe("toPlainObject", () => {
    test("converts all fields to plain object", () => {
      const report = new Report(
        "Cape Town",
        Status.Resolved,
        "Potholes",
        creationTime,
        "user123",
        Priority.High,
        "CMP-001",
        "http://image.jpg",
        "Big pothole",
        "123 Main St",
        "Ward-3",
        -26.2,
        28.0,
        "-26.2,28.0",
        5,
      );

      const plain = report.toPlainObject();

      expect(plain).toEqual({
        complaintid: "CMP-001",
        municipality: "Cape Town",
        status: "Resolved",
        issuetype: "Potholes",
        creationtime: creationTime.toISOString(),
        userid: "user123",
        priority: Priority.High,
        image: "http://image.jpg",
        details: "Big pothole",
        address: "123 Main St",
        ward_id: "Ward-3",
        latitude: -26.2,
        longitude: 28.0,
        coords: "-26.2,28.0",
        linked_complaint_id: 5,
      });
    });

    test("toPlainObject handles missing optional fields", () => {
      const report = makeReport();
      const plain = report.toPlainObject();

      expect(plain.complaintid).toBe("");
      expect(plain.image).toBeUndefined();
      expect(plain.details).toBe("No details");
      expect(plain.address).toBe("No address");
      expect(plain.ward_id).toBe("Not assigned");
      expect(plain.latitude).toBeUndefined();
      expect(plain.longitude).toBeUndefined();
      expect(plain.coords).toBe("");
      expect(plain.linked_complaint_id).toBeUndefined();
    });
  });

  describe("fromRecord", () => {
    test("creates Report from database record", () => {
      const record = {
        municipality: "Durban",
        status: "In progress",
        issuetype: "Flooding",
        creationtime: "2024-01-01T00:00:00.000Z",
        userid: "user456",
        priority: Priority.Critical,
        complaintid: "CMP-002",
        image: "http://flood.jpg",
        details: "Street flooded",
        address: "456 Beach Rd",
        ward_id: "Ward-7",
        latitude: -29.85,
        longitude: 31.02,
        coords: "-29.85,31.02",
        linked_complaint_id: 3,
      };

      const report = Report.fromRecord(record);

      expect(report.getMunicipality()).toBe("Durban");
      expect(report.getStatus()).toBe("In progress");
      expect(report.getIssueType()).toBe("Flooding");
      expect(report.getCreationTime()).toEqual(new Date("2024-01-01T00:00:00.000Z"));
      expect(report.getUserID()).toBe("user456");
      expect(report.getPriority()).toBe(Priority.Critical);
      expect(report.getComplaintId()).toBe("CMP-002");
      expect(report.getImage()).toBe("http://flood.jpg");
      expect(report.getDetails()).toBe("Street flooded");
      expect(report.getAddress()).toBe("456 Beach Rd");
      expect(report.getWardId()).toBe("Ward-7");
      expect(report.getLatitude()).toBe(-29.85);
      expect(report.getLongitude()).toBe(31.02);
      expect(report.getCoords()).toBe("-29.85,31.02");
      expect(report.getLinkedComplaintId()).toBe(3);
    });

    test("fromRecord handles missing optional fields", () => {
      const record = {
        municipality: "Joburg",
        status: "Pending",
        issuetype: "Road",
        creationtime: "2024-01-01T00:00:00.000Z",
        userid: "user789",
        priority: Priority.Medium,
      };

      const report = Report.fromRecord(record);

      expect(report.getComplaintId()).toBe("");
      expect(report.getImage()).toBe("No image");
      expect(report.getDetails()).toBe("No details");
      expect(report.getAddress()).toBe("No address");
      expect(report.getWardId()).toBe("Not assigned");
      expect(report.getCoords()).toBe("");
      expect(report.getLinkedComplaintId()).toBeUndefined();
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

    test("setPriority updates priority", () => {
      const report = makeReport();
      report.setPriority(Priority.Low);
      expect(report.getPriority()).toBe(Priority.Low);
    });

    test("setComplaintId updates complaint id", () => {
      const report = makeReport();
      report.setComplaintId("CMP-100");
      expect(report.getComplaintId()).toBe("CMP-100");
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