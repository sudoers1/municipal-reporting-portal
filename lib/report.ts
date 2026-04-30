import { Priority } from "./priority";
import { Status } from "./status";


export class Report {
    constructor(
        private municipality: string,
        private status: Status,
        private issuetype: string,
        private creationtime: Date,
        private userid: string,
        private priority: Priority,
        private image?: string,
        private details?: string,
    ) {
        this.municipality = municipality;
        this.status = status;
        this.image = image;
        this.issuetype = issuetype;
        this.details = details;
        this.creationtime = creationtime;
        this.userid = userid;
        this.priority = priority;
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

    getPriority(): Priority{
        return this.priority;
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


}
