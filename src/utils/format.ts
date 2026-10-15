export const rupee = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

export const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
