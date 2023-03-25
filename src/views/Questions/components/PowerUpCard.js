import React from "react";

const PowerUpCard = ({
  name,
  identifier,
  onSelect,
  used = false,
  disabled = false,
}) => {
  return (
    <div className=" w-full h-60  rounded-md">
      {used ? (
        <div className="flex flex-col gap-2">
          <img
            className=" w-full object-contain h-60 cursor-pointer"
            src={`/images/powerup_card_${identifier}.png`}
            alt="Selected PowerUp"
          />
          <p className=" text-hr text-center font-bold">{name}</p>
        </div>
      ) : (
        <img
          onClick={() => {
            if (!disabled) onSelect();
          }}
          style={{ userSelect: disabled || used ? "none" : "auto" }}
          className="w-full object-contain h-full cursor-pointer"
          src="/images/back.jpg"
          alt="PowerUp"
        />
      )}
    </div>
  );
};

export default PowerUpCard;
