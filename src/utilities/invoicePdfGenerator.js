import PDFDocument from "pdfkit";

class InvoicePdfGenerator {
    generate(invoice) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    size: "A4",
                    margin: 50,
                    info: {
                        Title: `Invoice INV${invoice.id}`,
                        Author: "Noosphere",
                        Subject: "Invoice",
                    },
                });

                const buffers = [];
                doc.on("data", buffers.push.bind(buffers));
                doc.on("end", () => resolve(Buffer.concat(buffers)));
                doc.on("error", reject);

                const tenant = invoice.tenant || {};
                const plan = invoice.plan || {};

                doc.fontSize(22).fillColor("#004ABA").font("Helvetica-Bold").text("Noosphere");
                doc.moveDown(0.5);
                doc.fontSize(16).fillColor("#1f2937").text(`Invoice INV${invoice.id}`);
                doc.moveDown();

                doc.fontSize(11).fillColor("#374151").font("Helvetica-Bold").text("Billed to");
                doc.font("Helvetica").text(tenant.companyName || "");
                if (tenant.email) doc.text(tenant.email);
                doc.moveDown();

                const rows = [
                    ["Plan", plan.name || ""],
                    ["Billing frequency", invoice.billingFrequency || ""],
                    ["Status", invoice.status || ""],
                    ["Due date", invoice.dueDate ? new Date(invoice.dueDate).toDateString() : ""],
                    ["Amount due", `$${Number(invoice.total ?? 0).toFixed(2)}`],
                ];

                rows.forEach(([label, value]) => {
                    doc.font("Helvetica-Bold").text(`${label}: `, { continued: true });
                    doc.font("Helvetica").text(value);
                });

                doc.moveDown(2);
                doc.fontSize(9).fillColor("#6b7280").text("Thank you for your business.", { align: "center" });

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }
}

const invoicePdfGenerator = new InvoicePdfGenerator();
export default invoicePdfGenerator;
