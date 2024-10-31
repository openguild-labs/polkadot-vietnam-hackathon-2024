"use client"
import React, { useState } from 'react';
import { Form, Button, Slider } from 'antd';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
interface Pros{
    onFilter: (filters:any)=>void
}
const FilterBillBoard = ({ onFilter }:Pros) => {
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [priceRange, setPriceRange] = useState([500, 20000]);
  const [sizeRange, setSizeRange] = useState([100, 1000]);

  const handleCountryChange = (val:any) => {
    setCountry(val);
    setRegion(''); // Reset city when country changes
  };

  const handleSubmit = () => {
    // Pass all filters back, even if some are not selected
    const filterData = {
      country: country || undefined,
      region: region || undefined,
      priceRange: priceRange || undefined,
      sizeRange: sizeRange || undefined,
    };
    onFilter(filterData);
  };

  return (
    <div className="h-full flex flex-col p-4 rounded-lg text-white justify-center">
      <Form layout="vertical" onFinish={handleSubmit}>

        {/* Country */}
        <Form.Item
          name="country"
          label={<label style={{ color: 'white' }}>Country</label>}
          style={{ marginBottom: '12px' }}
        >
          <CountryDropdown
            value={country}
            onChange={handleCountryChange}
            classes="rounded-lg h-[30px] w-full"
          />
        </Form.Item>

        {/* City */}
        {country && (
          <Form.Item
            name="city"
            label={<label style={{ color: 'white' }}>City</label>}
            style={{ marginBottom: '12px' }}
          >
            <RegionDropdown
              country={country}
              value={region}
              onChange={(val) => setRegion(val)}
              classes="rounded-lg h-[30px] w-full"
            />
          </Form.Item>
        )}

        {/* Price Range Slider */}
        <Form.Item label={<label style={{ color: 'white' }}>Price Range</label>}>
          <Slider
            range
            step={100}
            min={500}
            max={20000}
            defaultValue={priceRange}
            onChange={(value) => setPriceRange(value)}
          />
          <div className="flex justify-between text-white">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </Form.Item>

        {/* Size Range Slider */}
        <Form.Item label={<label style={{ color: 'white' }}>Billboard Size (sq.ft.)</label>}>
          <Slider
            range
            step={10}
            min={50}
            max={1000}
            defaultValue={sizeRange}
            onChange={(value) => setSizeRange(value)}
          />
          <div className="flex justify-between text-white">
            <span>{sizeRange[0]} sq.ft.</span>
            <span>{sizeRange[1]} sq.ft.</span>
          </div>
        </Form.Item>

        {/* Search Button */}
        <Form.Item>
          <Button type="primary" variant='solid' color='default' htmlType="submit" block>
            Search
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FilterBillBoard;
