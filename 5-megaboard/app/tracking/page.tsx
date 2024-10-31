"use client"
import React, { useState } from 'react';
import { Calendar } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const App: React.FC = () => {
  const [value, setValue] = useState(() => dayjs('2024-11-25'));
  const [selectedValue, setSelectedValue] = useState(() => dayjs('2024-11-25'));

  const onSelect = (newValue: Dayjs) => {
    setValue(newValue);
    setSelectedValue(newValue);
  };

  const onPanelChange = (newValue: Dayjs) => {
    setValue(newValue);
  };

  const highlightedRange = {
    start: dayjs('2024-11-05'),
    end: dayjs('2024-11-22')
  };

  const dateCellRender = (date: Dayjs) => {
    const isHighlighted = date.isSameOrAfter(highlightedRange.start, 'day') && 
                          date.isSameOrBefore(highlightedRange.end, 'day');
    return isHighlighted ? <div className="ant-picker-cell-inner" style={{ backgroundColor: 'red' }} /> : null;
  };

  return (
    <div className='w-full min-h-screen flex justify-center items-center'>
      <div className='mt-[68px] w-[70%] h-[40%]'>
        <Calendar 
          value={value} 
          onSelect={onSelect} 
          onPanelChange={onPanelChange} 
          dateCellRender={dateCellRender}
          style={{
            borderRadius:"12px",
            padding:"8px",
          }}
        />
      </div>
    </div>
  );
};

export default App;
