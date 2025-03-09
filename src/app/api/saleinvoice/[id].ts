import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Get a specific invoice by ID
    try {
      const invoice = await prisma.invoice.findUnique({
        where: { id: String(id) },
        include: {
          items: true, // Include related invoice items
        },
      });

      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }

      return res.status(200).json(invoice);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching invoice', error });
    }
  } else if (req.method === 'PUT') {
    // Update an existing invoice by ID
    const {
      invoiceTo,
      date,
      paymentMode,
      consignee,
      supplier,
      deliveryNote,
      destination,
      buyersOrderNo,
      dispatchedDocNo,
      dispatchedThrough,
      termsOfDelivery,
      items,
    } = req.body;

    try {
      const updatedInvoice = await prisma.invoice.update({
        where: { id: String(id) },
        data: {
          invoiceTo,
          date,
          paymentMode,
          consignee,
          supplier,
          deliveryNote,
          destination,
          buyersOrderNo,
          dispatchedDocNo,
          dispatchedThrough,
          termsOfDelivery,
          items: {
            update: items, // Update invoice items as well
          },
        },
      });
      return res.status(200).json(updatedInvoice);
    } catch (error) {
      return res.status(500).json({ message: 'Error updating invoice', error });
    }
  } else if (req.method === 'DELETE') {
    // Delete an invoice by ID
    try {
      await prisma.invoice.delete({
        where: { id: String(id) },
      });
      return res.status(204).end(); // No content
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting invoice', error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
