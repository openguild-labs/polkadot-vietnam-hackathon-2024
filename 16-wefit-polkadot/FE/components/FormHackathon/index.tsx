import React, { useState, ChangeEvent, FormEvent } from "react";
import { Input, Button } from "@nextui-org/react";
import { parseZonedDateTime } from "@internationalized/date";
import toast, { Toaster } from 'react-hot-toast';
import useRegister from '../hooks/useRegister';
import { useSession } from 'next-auth/react';
import { Upload, Loader2 } from 'lucide-react';
import DateRangePicker from "../DateTimePicker";
import LoadingForm from "../LoadingForm";

export default function FormHackathon() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        prize1: '',
        prize2: '',
        prize3: '',
        startDate: parseZonedDateTime("2024-04-01T00:45[America/Los_Angeles]"),
        endDate: parseZonedDateTime("2024-04-08T11:15[America/Los_Angeles]"),
    });

    const { register: registerUser, isLoading: isRegisterLoading } = useRegister();
    const { data: session } = useSession() || {};

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result;
                if (typeof result === 'string') {
                    setSelectedFile(result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // Submit transaction first
            await handleSubmitTransaction();
            
            // Then handle registration
            await registerUser(session?.user?.email);
            
            // Submit form data
            const dataToSubmit = {
                ...formData,
                image: selectedFile,
            };
            
            // Simulating API call delay
            await new Promise(resolve => setTimeout(resolve, 5000));
            setTimeout(() => {
                
            }, 3000);
            toast.success('Hackathon created successfully!');
            
            // Reset form
            setFormData({
                name: '',
                description: '',
                prize1: '',
                prize2: '',
                prize3: '',
                startDate: parseZonedDateTime("2024-04-01T00:45[America/Los_Angeles]"),
                endDate: parseZonedDateTime("2024-04-08T11:15[America/Los_Angeles]"),
            });
            setSelectedFile(null);
            
        } catch (error) {
            setTimeout(() => {
                
            }, 3000);
            console.error('Submission error:', error);
            toast.error('Failed to create hackathon. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitTransaction = async () => {
        const response = await fetch('/api/submitTransaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: process.env.NEXT_PUBLIC_RAZOR_ADDRESS,
                to: 'your_receiver_address',
                amount: 1000000000000000,
                memo: 'Hackathon registration fee',
            }),
        });

        if (!response.ok) {
            throw new Error('Transaction failed');
        }

        return response.json();
    };

    return (
        <form className="flex flex-col gap-4 text-gray-700" onSubmit={handleSubmit}>
            <Input
                isRequired
                isDisabled={isSubmitting}
                label="Name of Hackathon"
                name="name"
                value={formData.name}
                onChange={handleChange}
                color="default"
                variant="bordered"
            />
            <Input
                isRequired
                isDisabled={isSubmitting}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                color="default"
                variant="bordered"
            />
            <div className="flex flex-row gap-4 w-full">
                <Input
                    isRequired
                    isDisabled={isSubmitting}
                    label="Top 1"
                    name="prize1"
                    value={formData.prize1}
                    onChange={handleChange}
                    color="default"
                    variant="bordered"
                />
                <Input
                    isRequired
                    isDisabled={isSubmitting}
                    label="Top 2"
                    name="prize2"
                    value={formData.prize2}
                    onChange={handleChange}
                    color="default"
                    variant="bordered"
                />
                <Input
                    isRequired
                    isDisabled={isSubmitting}
                    label="Top 3"
                    name="prize3"
                    value={formData.prize3}
                    onChange={handleChange}
                    color="default"
                    variant="bordered"
                />
            </div>

            <div className="w-full max-w-xl flex flex-row gap-4">
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                    <DateRangePicker />
                </div>
            </div>
            
            <div className="flex flex-col items-center gap-4">
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept="image/*"
                    disabled={isSubmitting}
                />
                <label htmlFor="file-upload">
                    <div className={`flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full transition-colors duration-200 ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90 cursor-pointer'
                    }`}>
                        <Upload size={18} />
                        <span>Choose file</span>
                    </div>
                </label>

                {selectedFile && (
                    <div className="flex justify-center w-full">
                        <img
                            src={selectedFile}
                            alt="Preview"
                            className="object-cover w-[200px] h-[200px] rounded-lg"
                        />
                    </div>
                )}
            </div>

            <div className="flex gap-2 justify-end">
                <Button 
                    fullWidth 
                    color="primary" 
                    type="submit" 
                    className="text-white"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Creating...</span>
                        </div>
                    ) : (
                        'Create'
                    )}
                </Button>
            </div>
            {isSubmitting &&
                <div>
                    <LoadingForm />
                </div>
            }
            
            <Toaster position="top-right" />
        </form>
    );
}