const TodayApptSkeleton = () => {
  return (
    <ul className="flex flex-col ml-18 border-l-2 border-gray-300 pl-4 py-2 space-y-8">
      {Array.from({ length: 4 }).map((_, index) => (
        <li key={index} className="group relative -ml-[23px] animate-pulse">
          <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <div className="w-3 h-3 rounded-full bg-gray-300 border-2 border-white" />
          </div>
          <div className="absolute -left-2 -translate-x-[calc(100%+8px)] top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
          </div>
          <div className="flex justify-between items-center gap-4 pl-4 bg-gray-100 rounded-lg p-2 ml-8 border-gray-200 border">
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>{" "}
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>{" "}
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>{" "}
            </div>
            <div className="h-5 w-5 bg-gray-200 rounded-full"></div>{" "}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodayApptSkeleton;
