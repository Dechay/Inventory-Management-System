import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ReportData {
  stockIn: any[];
  stockOut: any[];
  summary: {
    inwardQuantity: number;
    inwardValue: number;
    outwardQuantity: number;
    outwardValue: number;
  };
  currentStock: {
    id: number;
    itemName: string;
    quantity: number;
    price: number;
  };
  closingBalance: {
    quantity: number;
    value: number;
  };
}

const InventoryReportForm = ({
  filters,
}: {
  filters: { item: string; startDate: string; endDate: string; filter: string };
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const companyInfoRef = useRef<HTMLDivElement>(null); // Ref for company info
  const reportContentRef = useRef<HTMLDivElement>(null); // Ref for report content
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to format date as DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // British style (DD/MM/YYYY)
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `/api/reports/inventory?item=${filters.item}&startDate=${filters.startDate}&endDate=${filters.endDate}&filter=${filters.filter}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch report data');
        }

        const result = await response.json();
        if (result.success) {
          setReportData(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch report');
        }
      } catch (error) {
        console.error('Error fetching report:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch report');
      } finally {
        setLoading(false);
      }
    };

    if (filters) {
      fetchReport();
    }
  }, [filters]);

  const handleDownload = async () => {
    setOpenDialog(false);
    if (!companyInfoRef.current || !reportContentRef.current) return;

    // Capture company info
    const companyInfoCanvas = await html2canvas(companyInfoRef.current, {
      scale: 2,
    });
    const companyInfoImgData = companyInfoCanvas.toDataURL("image/png");

    // Capture report content
    const reportContentCanvas = await html2canvas(reportContentRef.current, {
      scale: 2,
    });
    const reportContentImgData = reportContentCanvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Add company info to PDF
    pdf.addImage(
      companyInfoImgData,
      "PNG",
      0,
      0,
      210,
      (companyInfoCanvas.height * 210) / companyInfoCanvas.width
    );

    // Add report content to PDF, positioning it after company info
    const reportContentYPosition =
      (companyInfoCanvas.height * 210) / companyInfoCanvas.width; // Adjust as needed based on company info height
    pdf.addImage(
      reportContentImgData,
      "PNG",
      0,
      reportContentYPosition,
      210,
      (reportContentCanvas.height * 210) / reportContentCanvas.width
    );

    pdf.save("inventory_report.pdf");
  };

  const handlePrint = () => {
    if (!reportRef.current) return;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(
        "<html><head><title>Inventory Report</title></head><body>"
      );
      printWindow.document.write(reportRef.current.outerHTML);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Box sx={{ padding: 3, textAlign: "center" }}>
      <div ref={reportRef}>
        {/* Company Information */}
        <div ref={companyInfoRef}>
          <Typography variant="h6" fontWeight="bold">
            New Edge Technologies Pvt. Ltd.
          </Typography>
          <Typography variant="body2">
            2nd Floor, City Mall, Chubachu.
          </Typography>
          <Typography variant="body2">P.O. Box-1616</Typography>
          <Typography variant="body2">TPN No: NAC0078</Typography>
          <Typography variant="body2">
            Contact: +975-02-336792/337189/337190, +975-174117539/17611511
          </Typography>
        </div>

        {/* Filter Information */}
        <div ref={reportContentRef}>
          <Typography variant="h6" fontWeight="bold" sx={{ marginTop: 2 }}>
            {reportData?.currentStock?.itemName || "Loading..."}
          </Typography>
          <Typography variant="body2">
            Period: {formatDate(filters.startDate)} to {formatDate(filters.endDate)}
          </Typography>

          {/* Paper Layout for Report Content */}
          <Paper sx={{ marginTop: 3, padding: 2 }}>
            {/* Table Header */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 2,
                marginBottom: 2,
              }}
            >
              <Typography variant="body2" fontWeight="bold">
                Particulars
              </Typography>
              <Typography variant="body2" fontWeight="bold" align="center">
                Inwards Quantity
              </Typography>
              <Typography variant="body2" fontWeight="bold" align="center">
                Inwards Value
              </Typography>
              <Typography variant="body2" fontWeight="bold" align="center">
                Outwards Quantity
              </Typography>
              <Typography variant="body2" fontWeight="bold" align="center">
                Outwards Value
              </Typography>
              <Typography variant="body2" fontWeight="bold" align="center">
                Closing Balance Quantity
              </Typography>
              <Typography variant="body2" fontWeight="bold" align="center">
                Closing Balance Value
              </Typography>
            </Box>

            {/* Data Rows */}
            {loading ? (
              <Typography>Loading...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : reportData ? (
              <>
                {/* Opening Balance */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: 2,
                  }}
                >
                  <Typography variant="body2">Opening Balance</Typography>
                  <Typography variant="body2" align="center">-</Typography>
                  <Typography variant="body2" align="center">-</Typography>
                  <Typography variant="body2" align="center">-</Typography>
                  <Typography variant="body2" align="center">-</Typography>
                  <Typography variant="body2" align="center">
                    {reportData.currentStock.quantity} Pcs
                  </Typography>
                  <Typography variant="body2" align="center">
                    {(reportData.currentStock.quantity * reportData.currentStock.price).toFixed(2)}
                  </Typography>
                </Box>

                {/* Stock Movements */}
                {reportData.stockIn.map((inward, index) => (
                  <Box
                    key={`in-${index}`}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      gap: 2,
                      marginTop: 1,
                    }}
                  >
                    <Typography variant="body2">
                      {new Date(inward.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" align="center">{inward.quantity}</Typography>
                    <Typography variant="body2" align="center">
                      {(inward.quantity * inward.rate).toFixed(2)}
                    </Typography>
                    <Typography variant="body2" align="center">-</Typography>
                    <Typography variant="body2" align="center">-</Typography>
                    <Typography variant="body2" align="center">
                      {inward.balanceQty} Pcs
                    </Typography>
                    <Typography variant="body2" align="center">
                      {inward.balanceValue.toFixed(2)}
                    </Typography>
                  </Box>
                ))}

                {/* Closing Balance */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: 2,
                    marginTop: 1,
                  }}
                >
                  <Typography variant="body2">Grand Total</Typography>
                  <Typography variant="body2" align="center">
                    {reportData.summary.inwardQuantity}
                  </Typography>
                  <Typography variant="body2" align="center">
                    {reportData.summary.inwardValue.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" align="center">
                    {reportData.summary.outwardQuantity}
                  </Typography>
                  <Typography variant="body2" align="center">
                    {reportData.summary.outwardValue.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" align="center">
                    {reportData.closingBalance.quantity} Pcs
                  </Typography>
                  <Typography variant="body2" align="center">
                    {reportData.closingBalance.value.toFixed(2)}
                  </Typography>
                </Box>
              </>
            ) : null}
          </Paper>
        </div>
      </div>

      {/* Download and Print Buttons */}
      <Box sx={{ marginTop: 3, display: "flex", gap: 2, ml: 112 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
          sx={{ fontSize: 12 }}
        >
          Download
        </Button>
        <Button variant="contained" color="primary" onClick={handlePrint}>
          Print
        </Button>
      </Box>

      {/* Download Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Download</DialogTitle>
        <DialogContent>
          <Typography>Download report as PDF?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setOpenDialog(false)}
          >
            No
          </Button>
          <Button variant="outlined" onClick={handleDownload}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryReportForm;
