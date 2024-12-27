import { useState, useEffect, useRef } from "react";
import Picker from "@emoji-mart/react";

const EmojiPickerComponent = ({ onEmojiSelect }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker((prev) => !prev)}
        className="p-2 bg-gray-200 rounded-full"
      >
        😊
      </button>
      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute z-10 bg-white shadow-md rounded-lg p-2"
        >
          <Picker onEmojiSelect={onEmojiSelect} />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerComponent;
