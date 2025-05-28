import { Card, CardContent } from "@/components/ui/card";

const StatCardSkeleton = () => {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <Card
          key={index}
          className="hover:shadow-md transition-shadow duration-200"
        >
          <CardContent className="p-4 md:p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="h-4 w-[150px] bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
                <div className="h-8 w-[80px] bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse" />
              </div>
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            </div>
            <div className="flex items-center mt-4">
              <div className="h-4 w-[100px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default StatCardSkeleton;
