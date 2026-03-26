export interface ItemRow {
  id: string;
  description: string;
  unitRate: number;
  qty: number;
  amount: number;
}

export interface ScopeItem {
  description: string;
  knResponsibility: boolean;
  clientResponsibility: boolean;
}

export interface QuotationData {
  documentType: 'QUOTATION' | 'INVOICE';
  quoteNo: string;
  date: string;
  
  // Customer Details
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  siteLocation: string;
  gstNumber: string;

  // System Details
  systemSize: string;
  serviceType: string;
  systemType: string;
  roofType: string;
  numPanels: string;
  panelWattage: string;
  inverterModel: string;
  netMetering: string;
  subsidyApplicable: string;

  // Items
  items: ItemRow[];

  // Summary
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  govSubsidy: number;
  netPrice: number;

  // Bank Details
  bankName: string;
  accHolderName: string;
  accNumber: string;
  ifscCode: string;
  branch: string;

  // Structure
  structureType: string;
  windSpeed: string;
  structureWarranty: string;

  // Scope
  scopeOfWork: ScopeItem[];

  // Terms
  paymentTerms: string;
  timeline: string;
  completionDays: string;
  warrantyTerms: string;

  // Product Details
  moduleManufacturer: string;
  moduleWattage: string;
  moduleWarranty: string;
  inverterManufacturer: string;
  inverterWarranty: string;

  // Signatory
  signatoryName: string;
  signatoryDesignation: string;
}
