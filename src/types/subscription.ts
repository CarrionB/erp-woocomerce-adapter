export interface SubscriptionPlan {
  name:                   string;
  owner:                  string;
  creation:               Date;
  modified:               Date;
  modified_by:            string;
  idx:                    number;
  docstatus:              number;
  plan_name:              string;
  currency:               string;
  item:                   string;
  price_determination:    string;
  cost:                   number;
  billing_interval:       string;
  billing_interval_count: number;
  doctype:                string;
}

export interface Subscription {
  name:                                string;
  owner:                               string;
  creation:                            Date;
  modified:                            Date;
  modified_by:                         string;
  idx:                                 number;
  docstatus:                           number;
  party_type:                          string;
  party:                               string;
  company:                             string;
  status:                              string;
  start_date:                          Date;
  end_date:                            Date;
  follow_calendar_months:              number;
  generate_new_invoices_past_due_date: number;
  current_invoice_start:               Date;
  current_invoice_end:                 Date;
  days_until_due:                      number;
  cancel_at_period_end:                number;
  generate_invoice_at_period_start:    number;
  apply_additional_discount:           string;
  additional_discount_percentage:      number;
  additional_discount_amount:          number;
  submit_invoice:                      number;
  cost_center:                         string;
  doctype:                             string;
  plans:                               DocumentData[];
  invoices:                            DocumentData[];
}

interface DocumentData {
  name:           string;
  owner:          string;
  creation:       Date;
  modified:       Date;
  modified_by:    string;
  parent:         string;
  parentfield:    string;
  parenttype:     string;
  idx:            number;
  docstatus:      number;
  document_type?: string;
  invoice?:       string;
  doctype:        string;
  plan?:          string;
  qty?:           number;
}
