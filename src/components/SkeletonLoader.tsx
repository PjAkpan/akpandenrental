const SkeletonLoader = ({ lines = 3 }) => {
    return (
      <div className="animate-pulse space-y-3">
        {[...Array(lines)].map((_, index) => (
          <div key={index} className="skeleton-loader"></div>
        ))}
      </div>
    );
  };
  
  export default SkeletonLoader;
  