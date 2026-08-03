export interface ClientReservation {
  id: string;
  serviceName: string;
  startAtLabel: string;
  status: string;
}

export interface ClientTableCustomer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  isActive: boolean;
  createdAtLabel: string;
  reservations: ClientReservation[];
}