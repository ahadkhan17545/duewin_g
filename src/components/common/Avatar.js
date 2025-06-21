import React from 'react';

const Avatar = ({ src, alt = "User Avatar", size = 64 }) => {
  return (
    <div
      className="rounded-full overflow-hidden border mt-1"
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default Avatar;
