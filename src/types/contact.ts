export interface ContactFormData {
  "your-name": string;
  "your-number": string;
  "your-email": string;
  "address-wallet": string;
  "event-location": string;
  message: string;
}

export interface FormErrors {
  "your-name"?: string;
  "your-number"?: string;
  "your-email"?: string;
  "address-wallet"?: string;
  "event-location"?: string;
  contact?: string;
} 