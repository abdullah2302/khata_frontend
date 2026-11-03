import { money, fmtDate } from './format';

// A polite payment reminder, ready to paste into an email or chat.
export const reminderMessage = (inv, senderName) => {
  const overdue = inv.status === 'overdue';
  const first = inv.client?.name?.split(' ')[0] || 'there';
  return (
    `Hi ${first}, ${overdue ? 'a friendly reminder that' : 'just a note that'} invoice ${inv.invoiceNumber} ` +
    `for ${money(inv.amount)} ${overdue ? 'was due on' : 'is due on'} ${fmtDate(inv.dueDate)}. ` +
    `Could you let me know when I can expect the payment? Thank you. ${senderName}`
  );
};

export const whatsappLink = (text) => `https://wa.me/?text=${encodeURIComponent(text)}`;
