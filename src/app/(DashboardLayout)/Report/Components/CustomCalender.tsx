import {
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Typography,
    Box,
    Paper,
    Divider,
  } from "@mui/material";
  import { useState } from "react";
  import DatePicker from "react-datepicker";
  import "react-datepicker/dist/react-datepicker.css";
  
  interface CustomCalendarProps {
    startDate: Date | null;
    endDate: Date | null;
    setStartDate: (date: Date | null) => void;
    setEndDate: (date: Date | null) => void;
  }
  
  const CustomCalendar: React.FC<CustomCalendarProps> = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
  }) => {
    const [selectedView, setSelectedView] = useState<"day" | "month">("month");
  
    return (
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 900, display: "flex" }}>
        {/* Sidebar for View Selection */}
        <Box sx={{ minWidth: 150, borderRight: "2px solid #007bff", paddingRight: 2 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Custom
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              value={selectedView}
              onChange={(event) => setSelectedView(event.target.value as "day" | "month")}
            >
              <FormControlLabel value="day" control={<Radio color="primary" />} label="By day" />
              <FormControlLabel value="month" control={<Radio color="primary" />} label="By month" />
            </RadioGroup>
          </FormControl>
        </Box>
  
        {/* Calendar Section */}
        <Box sx={{ flex: 1, paddingLeft: 2 }}>
          {/* Date Inputs */}
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Box>
              <Typography variant="body1" fontWeight="bold">From</Typography>
              <DatePicker
                selected={startDate}
                onChange={setStartDate} // ✅ Use prop function
                dateFormat={selectedView === "month" ? "MMM, yyyy" : "dd/MM/yyyy"}
                showMonthYearPicker={selectedView === "month"}
                showPopperArrow={false}
                customInput={<TextField variant="outlined" size="small" sx={{ width: 150 }} />}
              />
            </Box>
  
            <Box>
              <Typography variant="body1" fontWeight="bold">To</Typography>
              <DatePicker
                selected={endDate}
                onChange={setEndDate} // ✅ Use prop function
                dateFormat={selectedView === "month" ? "MMM, yyyy" : "dd/MM/yyyy"}
                showMonthYearPicker={selectedView === "month"}
                showPopperArrow={false}
                customInput={<TextField variant="outlined" size="small" sx={{ width: 150 }} />}
              />
            </Box>
          </Box>
  
          <Divider sx={{ my: 2 }} />
  
          {/* Dual Inline Calendar View */}
          <Box display="flex" justifyContent="center" gap={4}>
            <DatePicker
              selected={startDate}
              onChange={setStartDate} // ✅ Use prop function
              dateFormat={selectedView === "month" ? "MM/yyyy" : "dd/MM/yyyy"}
              showMonthYearPicker={selectedView === "month"}
              inline
            />
            <DatePicker
              selected={endDate}
              onChange={setEndDate} // ✅ Use prop function
              dateFormat={selectedView === "month" ? "MM/yyyy" : "dd/MM/yyyy"}
              showMonthYearPicker={selectedView === "month"}
              inline
            />
          </Box>
        </Box>
      </Paper>
    );
  };
  
  export default CustomCalendar;