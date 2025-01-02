import type { Client } from '@/constants/mock-api';

interface ClientTableProps {
  data: Client[];
  pageCount: number;
  totalData?: number;
}

const ClientTable = ({ data, pageCount, totalData }: ClientTableProps) => {
  // Component implementation
};

export default ClientTable;
