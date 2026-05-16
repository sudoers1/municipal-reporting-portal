export class Feedback {
  constructor(
    private feedbackId: number,
    private userId: string,
    private complaintId: number,
    private details: string,
    private image: string,
    private creationtime: Date,
    private rating: number,
    private name: string,
  ) {}

  // Getters
  getFeedbackId(): number {
    return this.feedbackId;
  }

  getUserId(): string {
    return this.userId;
  }

  getComplaintId(): number {
    return this.complaintId;
  }

  getDetails(): string {
    return this.details;
  }

  getImage(): string {
    return this.image;
  }

  getCreationTime(): Date {
    return this.creationtime;
  }

  getRating(): number {
    return this.rating;
  }

  getName(): string {
    return this.name;
  }

  // Setters
  setFeedbackId(feedbackId: number): void {
    this.feedbackId = feedbackId;
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  setComplaintId(complaintId: number): void {
    this.complaintId = complaintId;
  }

  setDetails(details: string): void {
    this.details = details;
  }

  setImage(image: string): void {
    this.image = image;
  }

  setCreationTime(creationtime: Date): void {
    this.creationtime = creationtime;
  }

  setRating(rating: number): void {
    this.rating = rating;
  }

  setName(name: string): void {
    this.name = name;
  }

  // Convert to plain object for table rendering
  toPlainObject() {
    return {
      feedbackId: this.getFeedbackId(),
      userId: this.getUserId(),
      complaintId: this.getComplaintId(),
      details: this.getDetails(),
      image: this.getImage(),
      creationtime: this.getCreationTime().toISOString(),
      rating: this.getRating(),
      name: this.getName(),
      stars:this.getRatingStars()
    };
  }

  
  static fromRecord(d: Record<string, any>): Feedback {
    return new Feedback(
      d.feedbackId,
      d.userId,
      d.complaintId,
      d.details,
      d.image,
      new Date(d.creationtime),
      d.rating ?? 1, // Default to 1 if not provided
      d.name, 
    );
  }
validateForInsert(): string | null {
  if (!this.userId) {
    return "User ID is missing";
  }
  if (!this.complaintId) {
    return "Complaint ID is missing";
  }
  if (!this.details || this.details.trim() === "") {
    return "Please provide feedback details";
  }
  if (!this.image) {
    return "Image is required";
  }
  if (!this.name || this.name.trim() === "") {
    return "User name is missing";
  }
  if (this.rating < 1 || this.rating > 5) {
    return "Please provide a valid rating (1-5)";
  }
  
  return null; 
}

isValid(): boolean {
  return !!(
    this.feedbackId &&
    this.userId &&
    this.complaintId &&
    this.details &&
    this.image &&
    this.creationtime &&
    this.name &&
    this.rating >= 1 &&
    this.rating <= 5
  );
}
  // Get rating as stars
  getRatingStars(): string {
    const fullStar = '★';
    const emptyStar = '☆';
    return fullStar.repeat(this.rating) + emptyStar.repeat(5 - this.rating);
  }

  // Get formatted date string
  getFormattedDate(locale: string = 'en-US'): string {
    return this.creationtime.toLocaleString(locale);
  }
}