import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import Calendar from "react-native-calendar-range-picker";
import { useDispatch, useSelector } from "react-redux";
import {
  getDateRangeBooking,
  getDateRangeOut,
} from "../../redux/actions/dateRangeActions";
import { format } from "date-fns";
import CalendarPicker from "react-native-calendar-picker";
import { useFocusEffect } from "@react-navigation/native";

export default function InputDateComponents({
  handleDateRange,
  dateRange,
  handleChangeDateRange,
}) {
  // Use local state to store the selected date range
  const [dateRangeBooking, setDateRangeBooking] = useState(dateRange);

  const { dateRangeBooking: dateRangeRedux } = useSelector(
    (state) => state.dateRangeBooking
  );
  const { dateRangeDefault } = useSelector((state) => state.dateRangeDefault);
  const { dateRangeOut } = useSelector((state) => state.dateOut);
  const { apartment, loading } = useSelector((state) => state.apartmentDetail);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [smallestDay, setSmallestDay] = useState(null);
  const dispatch = useDispatch();

  // Function to handle date range changes
  const onDateRangeChange = (value, type) => {
    if (type === "END_DATE") {
      setEndDate(value);
    } else {
      setEndDate(null);
      setStartDate(value);
    }
  };

  useEffect(() => {
    let result = [];
    if (startDate) {
      let timeBooked = apartment.timeHasBooked;

      timeBooked.forEach((element) => {
        let checkIn = new Date(element.checkIn);
        let checkOut = new Date(element.checkOut);

        if (startDate <= checkIn) {
          result.push(checkOut);
        } else if (startDate >= checkIn) {
          result.push(checkIn);
        }
      });

      let x = dateDiffIsGreaterTwo(apartment.timeHasBooked);

      x.forEach((e) => {
        result.push(new Date(e));
      });

      dispatch(getDateRangeOut(result));
    }
  }, [startDate, apartment]);

  const dateDiffIsGreaterTwo = (array) => {
    let arr = [];
    array.forEach((element) => {
      let checkIn = new Date(element.checkIn);
      let checkOut = new Date(element.checkOut);
      const timeDifference = checkOut.getTime() - checkIn.getTime();
      const daysDifference = timeDifference / (1000 * 3600 * 24);

      if (daysDifference > 1) {
        let theDateStart = checkIn;
        theDateStart = new Date(theDateStart.getTime() + 24 * 60 * 60 * 1000);
        while (theDateStart.getTime() < checkOut.getTime()) {
          arr.push(theDateStart);
          theDateStart = new Date(theDateStart.getTime() + 24 * 60 * 60 * 1000);
        }
      }
    });

    return arr;
  };

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(
        getDateRangeBooking({
          startTimeBooking: new Date(startDate),
          endTimeBooking: new Date(endDate),
        })
      );
    }
  }, [startDate, endDate, dispatch]);

  return (
    <View className="w-full h-[800px]">
      {/* <Calendar
        startDate={format(
          new Date(dateRangeRedux.startTimeBooking),
          "yyyy-MM-dd"
        )}
        endDate={format(new Date(dateRangeRedux.endTimeBooking), "yyyy-MM-dd")}
        disabledBeforeToday
        futureYearRange={30}
        onChange={onDateRangeChange}
      /> */}
      <CalendarPicker
        startFromMonday={true}
        initialDate={new Date(dateRangeRedux.startTimeBooking)}
        // selectedStartDate={new Date(dateRangeRedux.startTimeBooking)}
        // selectedEndDate={new Date(dateRangeRedux.endTimeBooking)}
        allowRangeSelection={true}
        minDate={new Date(dateRangeDefault.startTimeDefault)}
        maxDate={new Date(dateRangeDefault.endTimeDefault)}
        selectedDayColor="#5C98F2"
        todayBackgroundColor="#5C98F2"
        selectedDayTextColor="#000000"
        scaleFactor={375}
        onDateChange={onDateRangeChange}
        disabledDates={dateRangeOut}
      />
    </View>
  );
}
