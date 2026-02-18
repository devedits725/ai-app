import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BasicCalculator from "@/components/calculators/BasicCalculator";
import PercentageCalculator from "@/components/calculators/PercentageCalculator";
import DiscountCalculator from "@/components/calculators/DiscountCalculator";
import AgeCalculator from "@/components/calculators/AgeCalculator";
import ExamScoreCalculator from "@/components/calculators/ExamScoreCalculator";

const CalculatorPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader title="Calculator Tools" />
      <Tabs defaultValue="basic" className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <TabsList className="w-full grid grid-cols-5 h-auto">
            <TabsTrigger value="basic" className="text-xs py-1.5">Basic</TabsTrigger>
            <TabsTrigger value="percent" className="text-xs py-1.5">%</TabsTrigger>
            <TabsTrigger value="discount" className="text-xs py-1.5">Discount</TabsTrigger>
            <TabsTrigger value="age" className="text-xs py-1.5">Age</TabsTrigger>
            <TabsTrigger value="exam" className="text-xs py-1.5">Exam</TabsTrigger>
          </TabsList>
        </div>
        <div className="flex-1 p-4 pb-20">
          <TabsContent value="basic"><BasicCalculator /></TabsContent>
          <TabsContent value="percent"><PercentageCalculator /></TabsContent>
          <TabsContent value="discount"><DiscountCalculator /></TabsContent>
          <TabsContent value="age"><AgeCalculator /></TabsContent>
          <TabsContent value="exam"><ExamScoreCalculator /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default CalculatorPage;
