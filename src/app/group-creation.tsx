"use client";

import { addMonths, differenceInMonths, endOfMonth, format, startOfMonth } from "date-fns";
import { Fragment, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/utils/cn";

export const GroupCreation = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(addMonths(new Date(), 2));
  const [repeatEvery, setRepeatEvery] = useState(1);

  const { timeSlots, editTimeSlot, addDayToShow, removeDayToShow, isDayEnabled } = useTimeSlots();

  return (
    <div className='flex flex-col gap-y-4'>
      <Card className='flex flex-col gap-y-4 p-4'>
        <div className='flex items-center gap-x-2'>
          <p>Start Date</p>
          <InputDate date={startDate} setDate={setStartDate} />
        </div>
        <div className='flex items-center gap-x-2'>
          <p>End Date</p>
          <InputDate date={endDate} setDate={setEndDate} />
        </div>

        <div className='flex items-center gap-x-2'>
          <p>Repeat every</p>
          <Input
            className='w-20'
            type='number'
            step={1}
            value={repeatEvery}
            onChange={(evt) => setRepeatEvery(evt.target.valueAsNumber)}
          />
          <p>weeks</p>
        </div>

        <div className='flex flex-row justify-center gap-4 pt-3'>
          {weekDays.map((w) => (
            <Button
              className='flex h-10 items-center justify-center rounded-full'
              key={w}
              onClick={() => {
                if (isDayEnabled(w)) {
                  removeDayToShow(w);
                } else {
                  addDayToShow(w);
                }
              }}
              variant={isDayEnabled(w) ? "default" : "outline"}
            >
              <p className='font-medium'>{w[0]!.toUpperCase()}</p>
            </Button>
          ))}
        </div>

        <div className='grid grid-cols-[1fr_2fr] gap-x-2 gap-y-1'>
          {timeSlots
            .sort((a, b) => weekDays.indexOf(a.day) - weekDays.indexOf(b.day))
            .map((ts) => (
              <Fragment key={`${ts.day}-${ts.start}-${ts.end}`}>
                <p className='capitalize'>{ts.day}</p>
                <div className='flex items-center gap-x-2'>
                  <Input
                    type='time'
                    value={ts.start}
                    onChange={(e) => editTimeSlot(ts.day, e.target.value, ts.end)}
                  />
                  -
                  <Input
                    type='time'
                    value={ts.end}
                    onChange={(e) => editTimeSlot(ts.day, ts.start, e.target.value)}
                  />
                </div>
              </Fragment>
            ))}
        </div>
      </Card>

      <Card>
        <Calendar
          initialFocus
          mode='multiple'
          disableNavigation
          selected={selectedDates}
          onSelect={(days) => setSelectedDates(days || [])}
          numberOfMonths={differenceInMonths(endOfMonth(endDate!), startOfMonth(startDate!)) + 1}
          fromDate={startDate!}
          toDate={endDate!}
        />
      </Card>
    </div>
  );
};

const weekDays = [
  "domingo",
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
] as const;
type WeekDay = (typeof weekDays)[number];

type TimeSlot = {
  day: WeekDay;
  start: string; // "HH:MM"
  end: string;
};

function useTimeSlots() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  const addDayToShow = (day: WeekDay) => {
    setTimeSlots((prevSlots) => [...prevSlots, { day, start: "12:00", end: "13:00" }]);
  };

  const removeDayToShow = (day: WeekDay) => {
    setTimeSlots((prevSlots) => prevSlots.filter((s) => s.day !== day));
  };

  const isDayEnabled = (day: WeekDay) => {
    return timeSlots.some((s) => s.day === day);
  };

  const editTimeSlot = (day: WeekDay, start: string, end: string) => {
    setTimeSlots((prevSlots) => {
      const index = prevSlots.findIndex((s) => s.day === day);
      if (index === -1) return prevSlots;

      const newSlots = [...prevSlots];
      newSlots[index] = { day, start, end };
      return newSlots;
    });
  };

  return {
    timeSlots,
    editTimeSlot,
    addDayToShow,
    removeDayToShow,
    isDayEnabled,
  };
}

function InputDate({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar mode='single' selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
