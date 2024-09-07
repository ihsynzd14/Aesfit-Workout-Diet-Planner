import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { HealthMetricsInput, HealthMetricsOutput } from '../api/healthapi';

interface HealthMetricsFormProps {
  onSubmit: (data: HealthMetricsInput) => void;
  initialData: HealthMetricsOutput | null;
  isLoading: boolean;
}

const HealthMetricsForm: React.FC<HealthMetricsFormProps> = ({ onSubmit, initialData, isLoading }) => {
  const [formData, setFormData] = useState<HealthMetricsInput>(initialData || {
    height: 0,
    weight: 0,
    age: 0,
    gender: 'male',
    activityLevel: 'moderate'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: name === 'age' ? parseInt(value) : parseFloat(value) }));
  };

  const handleSelectChange = (name: 'gender' | 'activityLevel', value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4 ">
        <div>
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            name="height"
            type="number"
            value={formData.height}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select onValueChange={(value) => handleSelectChange('gender', value)} value={formData.gender}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="activityLevel">Activity Level</Label>
        <Select onValueChange={(value) => handleSelectChange('activityLevel', value)} value={formData.activityLevel}>
          <SelectTrigger>
            <SelectValue placeholder="Select activity level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sedentary">Sedentary</SelectItem>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="very_active">Very Active</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          'Save Health Metrics'
        )}
      </Button>
    </form>
  );
};

export default HealthMetricsForm;