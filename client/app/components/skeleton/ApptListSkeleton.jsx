const ApptListSkeleton = () => {
  return (
    <div className="space-y-5  ">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex gap-4 p-3 rounded-lg animate-pulse">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>{" "}
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>{" "}
            <div className="flex items-center mt-2 gap-4">
              <div className="flex items-center text-xs text-muted-foreground">
                <div className="h-3 w-3 bg-gray-200 rounded-full mr-1"></div>{" "}
                <div className="h-3 bg-gray-200 rounded w-20"></div>{" "}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <div className="h-3 w-3 bg-gray-200 rounded-full mr-1"></div>{" "}
                <div className="h-3 bg-gray-200 rounded w-16"></div>{" "}
              </div>
            </div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>{" "}
        </div>
      ))}
    </div>
  );
};

export default ApptListSkeleton;
