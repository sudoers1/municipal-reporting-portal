import { Priority } from "./priority";
import { Status } from "./status";
//intended to replace reports class. separate for now to ensure nothing breaks
export class ReportsBleed {
  constructor(
    private municipality: string,
    private status: Status,
    private issuetype: string,
    private creationtime: Date,
    private userid: string,
    private priority: Priority,
    private complaintid?: string,
    private image?: string,
    private details?: string,
  ) {}

  getComplaintId(): string {
    return this.complaintid ?? "";
  }
  getMunicipality(): string {
    return this.municipality;
  }
  getStatus(): string {
    return this.status;
  }
  getImage(): string {
    return this.image ?? "No image";
  }
  getIssueType(): string {
    return this.issuetype;
  }
  getDetails(): string {
    return this.details ?? "No details";
  }
  getCreationTime(): Date {
    return this.creationtime;
  }
  getUserID(): string {
    return this.userid;
  }
  getPriority(): Priority {
    return this.priority;
  }

  setComplaintId(complaintid: string): void {
    this.complaintid = complaintid;
  }
  setMunicipality(municipality: string): void {
    this.municipality = municipality;
  }
  setStatus(status: Status): void {
    this.status = status;
  }
  setImage(image: string): void {
    this.image = image;
  }
  setIssueType(issuetype: string): void {
    this.issuetype = issuetype;
  }
  setDetails(details: string): void {
    this.details = details;
  }
  setCreationTime(creationtime: Date): void {
    this.creationtime = creationtime;
  }
  setUserID(userid: string): void {
    this.userid = userid;
  }
  setPriority(priority: Priority): void {
    this.priority = priority;
  }

  toPlainObject() {
    return {
      complaintid: this.getComplaintId(),
      municipality: this.getMunicipality(),
      status: this.getStatus(),
      issuetype: this.getIssueType(),
      creationtime: this.getCreationTime().toISOString(),
      userid: this.getUserID(),
      priority: this.getPriority(),
      image: this.image,
      details: this.getDetails(),
    };
  }

  static fromRecord(d: Record<string, any>): ReportsBleed {
    return new ReportsBleed(
      d.municipality,
      d.status as Status,
      d.issuetype,
      new Date(d.creationtime),
      d.userid ?? "",
      d.priority as Priority,
      d.complaintid,
      d.image,
      d.details,
    );
  }
}