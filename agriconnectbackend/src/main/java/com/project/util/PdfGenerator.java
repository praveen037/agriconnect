package com.project.util;

import com.project.entity.Order;
import com.project.entity.OrderItem;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

import java.io.ByteArrayOutputStream;

public class PdfGenerator {

    public static byte[] buildInvoicePdf(Order order) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12);

            // Title
            Paragraph title = new Paragraph("AgriConnect Invoice", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));

            // Order Info Table
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setSpacingBefore(10f);

            infoTable.addCell("Order ID");
            infoTable.addCell(String.valueOf(order.getId()));

            infoTable.addCell("Buyer");
            infoTable.addCell(order.getUser().getFirstName() + " " + order.getUser().getLastName());

            infoTable.addCell("Buyer Contact");
            infoTable.addCell(order.getUser().getMobileNumber());

            infoTable.addCell("Vendor");
            infoTable.addCell(order.getVendor() != null ? order.getVendor().getShopName() : "N/A");

            infoTable.addCell("Order Date");
            infoTable.addCell(order.getCreatedAt().toLocalDate().toString());

            infoTable.addCell("Order Status");
            infoTable.addCell(order.getOrderStatus().name());

            infoTable.addCell("Packed");
            infoTable.addCell(order.isPacked() ? "Yes" : "No");

            infoTable.addCell("Total Amount");
            infoTable.addCell("₹" + String.format("%.2f", order.getTotalAmount()));

            document.add(infoTable);
            document.add(new Paragraph(" "));

            // Items Table
            Paragraph itemsTitle = new Paragraph("Ordered Items", titleFont);
            itemsTitle.setSpacingBefore(10f);
            document.add(itemsTitle);

            PdfPTable itemTable = new PdfPTable(3);
            itemTable.setWidthPercentage(100);
            itemTable.setSpacingBefore(10f);

            itemTable.addCell("Product");
            itemTable.addCell("Quantity");
            itemTable.addCell("Subtotal");

            for (OrderItem item : order.getOrderItems()) {
                itemTable.addCell(item.getProduct().getName());
                itemTable.addCell(item.getQuantity() + " " + item.getProduct().getUnit());
                double subtotal = item.getProduct().getCost() * item.getQuantity();
                itemTable.addCell("₹" + String.format("%.2f", subtotal));
            }

            document.add(itemTable);
            document.add(new Paragraph(" "));

            // Footer
            Paragraph footer = new Paragraph("Thank you for using AgriConnect!", normalFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
        } catch (Exception e) {
            throw new RuntimeException("PDF generation failed", e);
        }

        return out.toByteArray();
    }
}