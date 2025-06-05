import Invoice from "../domain/invoice.js";

class InvoiceService {
    constructor({ invoiceRepository }) {
        this.invoiceRepository = invoiceRepository;
    }

    async createInvoice(data) {
        const invoiceData = new Invoice(data)
        const newInvoice = await this.invoiceRepository.create(invoiceData.createInvoice);

        if (!newInvoice) {
            throw new Error("Failed to create invoice");
        }

        return newInvoice;
    }

    async getSingleInvoice(id) {
        const invoice = await this.invoiceRepository.findOne({ id });

        if (!invoice) {
            throw new Error("Invoice not found")
        }

        return invoice;
    }

    async getAllInvoice() {
        const invoice = await this.invoiceRepository.findAll({});

        if (!invoice) {
            throw new Error("Invoice not found")
        }

        return invoice;
    }

}

export default InvoiceService;