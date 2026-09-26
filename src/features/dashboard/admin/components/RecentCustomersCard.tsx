type RecentCustomer = {
  id: string;
  name: string;
  phone: string;
};

type RecentCustomersCardProps = {
  customers: RecentCustomer[];
};

export default function RecentCustomersCard({ customers }: RecentCustomersCardProps) {
  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_10px_30px_-20px_rgba(15,118,110,0.2)]">
      <h3 className="text-lg font-semibold text-[#0F172A]">Clientes recientes</h3>

      {customers.length === 0 ? (
        <p className="mt-4 text-sm text-[#64748B]">Todavía no hay clientes registrados.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {customers.map((customer) => (
            <li key={customer.id} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
              <p className="font-medium text-[#0F172A]">{customer.name}</p>
              <p className="mt-1 text-sm text-[#64748B]">{customer.phone}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}