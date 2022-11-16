export interface ContactERP {
  name:                        string;
  owner:                       string;
  creation:                    Date;
  modified:                    Date;
  modified_by:                 string;
  idx:                         number;
  docstatus:                   number;
  first_name:                  string;
  last_name:                   string;
  email_id:                    string;
  sync_with_google_contacts:   number;
  status:                      string;
  phone:                       string;
  mobile_no:                   string;
  image:                       string;
  pulled_from_google_contacts: number;
  is_primary_contact:          number;
  is_billing_contact:          number;
  unsubscribed:                number;
  doctype:                     string;
  email_ids:                   Partial<ContactData>[];
  phone_nos:                   Partial<ContactData>[];
  links:                       Partial<ContactData>[];
}

export interface ContactData {
  name:                  string;
  owner:                 string;
  creation:              Date;
  modified:              Date;
  modified_by:           string;
  parent:                string;
  parentfield:           string;
  parenttype:            string;
  idx:                   number;
  docstatus:             number;
  email_id?:             string;
  is_primary?:           number;
  doctype:               string;
  link_doctype?:         string;
  link_name?:            string;
  link_title?:           string;
  phone?:                string;
  is_primary_phone?:     number;
  is_primary_mobile_no?: number;
}
