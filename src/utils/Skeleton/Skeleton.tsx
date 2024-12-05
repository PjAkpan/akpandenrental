
import React from "react";
import clsx from "clsx";
import "./Skeleton.css";

type SkeletonProps = {
  width?: string;
  height?: string;
  circle?: boolean;
  className?: string;
};

const Skeleton: React.FC<SkeletonProps> = ({ width, height, circle, className }) => {
  return (
    <div
      className={clsx("skeleton", circle && "skeleton-circle", className)}
      style={{ width, height }}
    ></div>
  );
};

export default Skeleton;
