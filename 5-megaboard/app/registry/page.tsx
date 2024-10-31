"use client";
import React, { useState } from "react";
import { Form, Input, Button, DatePicker, Upload, message } from "antd";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";
import CustomButton from "@/components/Button/CustomButton";
import emailjs from '@emailjs/browser';

const { RangePicker } = DatePicker;

const LoginForm = () => {
  const [form] = Form.useForm();
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");

  // Function to handle form submission
  const onFinish = (values: any) => {
    // Prepare the email template parameters
    const templateParams = {
      from_name: values.fullName,
      country: values.country,
      city: values.city,
      address: values.address,
      telegram: values.telegram,
      email: values.email,
      // Chuyển đổi các tệp thành URL nếu là các đối tượng File
      // upload: values.upload && Array.isArray(values.upload)
      // ? values.upload.map((file: any) => {
      //     // Kiểm tra xem file có phải là đối tượng File hay không
      //     if (file instanceof File) {
      //         return file; // Trả về file trực tiếp
      //     }
      //     return null; // Nếu không phải File, trả về null
      // }).filter(file => file !== null) // Lọc các giá trị null
      // : []
  };

    // Handle file uploads
    const formData = new FormData();
    if (values.upload) {
        values.upload.forEach((file: any) => {
            formData.append('upload', file); // Thêm tất cả các tệp vào FormData
        });
    }

    // Send the email with file attachment
    emailjs.send('service_wq5ka0r', 'template_livp3r5', { ...templateParams, my_file: formData },'9NKUqVas39RkoIC_V')
        .then((response) => {
            console.log('Email sent successfully:', response);
            // User feedback for success
          message.success("Email sent successfully")
          })
        .catch((error) => {
            console.error('Error sending email:', error);
            // User feedback for error
            alert('Error sending email. Please try again.');
        });

    console.log("Form values: ", values); // Keep this if you still want to log the values
};


  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setRegion(""); // Reset city value when country changes
    form.setFieldsValue({ city: undefined });
  };

  // Function to trigger form submission on button click
  const handleButtonClick = () => {
    form.submit();
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center ">
      <Form
        form={form}
        name="login_form"
        layout="vertical"
        onFinish={onFinish}
        style={{
          padding: "24px",
          color: "white",
        }}
        className="w-full max-w-lg shadow-lg rounded-xl bg-opacity-90 backdrop-blur-lg"
      >
        <span className="text-lg">Do you wanna post your billboard</span>
        {/* Full Name */}
        <Form.Item
          name="fullName"
          label={<label style={{ color: "white" }}>Username</label>}
          style={{ marginBottom: "12px" }}
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input placeholder="Input your full name" />
        </Form.Item>

        <div className="flex gap-4">
          <Form.Item
            name="country"
            label={<label style={{ color: "white" }}>Country</label>}
            rules={[{ required: true, message: "Please select your country!" }]}
            style={{ marginBottom: "12px" }}
            className="w-[50%]"
          >
            <CountryDropdown
              value={country}
              onChange={(val) => handleCountryChange(val)}
              classes="rounded-lg h-[30px] w-full"
            />
          </Form.Item>

          {/* City */}
          {country && (
            <Form.Item
              name="city"
              label={<label style={{ color: "white" }}>City</label>}
              rules={[{ required: true, message: "Please select your city!" }]}
              className="w-[50%]"
            >
              <RegionDropdown
                country={country}
                value={region}
                onChange={(val) => setRegion(val)}
                classes="rounded-lg h-[30px] w-full"
              />
            </Form.Item>
          )}
        </div>

        {/* Address */}
        <Form.Item
          name="address"
          label={<label style={{ color: "white" }}>Address</label>}
          rules={[{ required: true, message: "Please enter your address!" }]}
          style={{ marginBottom: "12px" }}
        >
          <Input placeholder="Input your address" />
        </Form.Item>

        {/* Date Range */}
        <Form.Item
          name="dateRange"
          label={<label style={{ color: "white" }}>Select Date Range</label>}
          rules={[{ required: true, message: "Please select a date range!" }]}
        >
          <RangePicker
            format="YYYY-MM-DD"
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }
            className="w-full"
          />
        </Form.Item>

        {/* Image Upload */}
        {/* <Form.Item
          name="upload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Please upload your image!" }]}
        >
          <Upload
            // action="/upload.do"
            listType="picture-card"
            maxCount={3} // Limit file upload to 3 images
          >
            <button
              style={{ border: 0, background: "none", color: "white" }}
              type="button"
            >
              <PlusOutlined />
              <div>Upload</div>
            </button>
          </Upload>
        </Form.Item> */}
        {/* Telegram */}
        <Form.Item
          name="telegram"
          label={<label style={{ color: "white" }}>Telegram</label>}
          rules={[{ required: true, message: "Please enter your Telegram username!" }]}
          style={{ marginBottom: "12px" }}
        >
          <Input placeholder="Input your Telegram username" />
        </Form.Item>

        {/* Email */}
        <Form.Item
          name="email"
          label={<label style={{ color: "white" }}>Email</label>}
          rules={[
            { required: true, message: "Please enter your email!" },
            { type: 'email', message: "Please enter a valid email address!" }
          ]}
          style={{ marginBottom: "12px" }}
        >
          <Input placeholder="Input your email address" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item style={{ marginBottom: "0px" }}>
          <CustomButton content="Submit" onclick={handleButtonClick} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
