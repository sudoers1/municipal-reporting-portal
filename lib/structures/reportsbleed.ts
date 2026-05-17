import { Priority } from "../priority";
import { Status } from "../status";

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
    private address?: string,
    private ward_id?: string,
    private latitude?: number,
    private longitude?: number,
    private coords?: string,
    private linked_complaint_id?: number,
  ) {}

  getComplaintId(): string { return this.complaintid ?? ""; }
  getMunicipality(): string { return this.municipality; }
  getStatus(): string { return this.status; }
  getImage(): string { return this.image ?? "No image"; }
  getIssueType(): string { return this.issuetype; }
  getDetails(): string { return this.details ?? "No details"; }
  getCreationTime(): Date { return this.creationtime; }
  getUserID(): string { return this.userid; }
  getPriority(): Priority { return this.priority; }
  getAddress(): string { return this.address ?? "No address"; }
  getWardId(): string { return this.ward_id ?? "Not assigned"; }
  getLatitude(): number | undefined { return this.latitude; }
  getLongitude(): number | undefined { return this.longitude; }
  getCoords(): string { return this.coords ?? ""; }
  getLinkedComplaintId(): number | undefined { return this.linked_complaint_id; } 

  setComplaintId(complaintid: string): void { this.complaintid = complaintid; }
  setMunicipality(municipality: string): void { this.municipality = municipality; }
  setStatus(status: Status): void { this.status = status; }
  setImage(image: string): void { this.image = image; }
  setIssueType(issuetype: string): void { this.issuetype = issuetype; }
  setDetails(details: string): void { this.details = details; }
  setCreationTime(creationtime: Date): void { this.creationtime = creationtime; }
  setUserID(userid: string): void { this.userid = userid; }
  setPriority(priority: Priority): void { this.priority = priority; }
  setAddress(address: string): void { this.address = address; }
  setWardId(ward_id: string): void { this.ward_id = ward_id; }
  setLatitude(latitude: number): void { this.latitude = latitude; }
  setLongitude(longitude: number): void { this.longitude = longitude; }
  setCoords(coords: string): void { this.coords = coords; }
  setLinkedComplaintId(linked_complaint_id: number): void { this.linked_complaint_id = linked_complaint_id; }

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
      address: this.getAddress(),
      ward_id: this.getWardId(),
      latitude: this.latitude,
      longitude: this.longitude,
      coords: this.getCoords(),
      linked_complaint_id: this.getLinkedComplaintId(),
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
      d.address,
      d.ward_id,
      d.latitude,
      d.longitude,
      d.coords,
      d.linked_complaint_id,
    );
  }
}