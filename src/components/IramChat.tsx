import React, { useState } from 'react';
import iramAvatar from '../assets/images/iram-avatar.png.png';

export default function IramChat() {
const [isOpen, setIsOpen] = useState(false);

return (
<>
{isOpen && ( <div className="fixed bottom-28 left-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"> <div className="bg-[#006B4F] text-white px-4 py-3 flex justify-between items-center"> <div> <h3 className="font-semibold">Iram</h3> <p className="text-xs opacity-90">Infantree Assistant</p> </div>

```
        <button
          onClick={() => setIsOpen(false)}
          className="text-xl"
        >
          ×
        </button>
      </div>

      <div className="p-4">
        <div className="bg-gray-100 rounded-2xl p-3 text-sm text-gray-800">
          <p>Hello 👋 I am Iram, your Infantree Assistant.</p>

          <p className="mt-2">
            Main baby massage, mother massage aur hamari services se jude
            aapke sawalon me madad kar sakti hoon.
          </p>

          <p className="mt-2 font-medium">
            Kya aap baby massage ke baare me jaanna chahte hain ya mother
            massage ke baare me?
          </p>
        </div>

        <div className="mt-4">
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full border rounded-xl px-3 py-2 text-sm"
          />
        </div>

        <button className="w-full mt-3 bg-[#006B4F] text-white py-2 rounded-xl">
          Send
        </button>
      </div>
    </div>
  )}

  <button
    aria-label="Iram"
    title="Iram"
    onClick={() => setIsOpen(!isOpen)}
    className="fixed bottom-8 left-6 z-50 bg-[#E18A00] p-2 rounded-full shadow-lg hover:scale-105 transition-all duration-200"
  >
    <img
      src={iramAvatar}
      alt="Iram"
      className="w-14 h-14 rounded-full object-cover"
    />
  </button>
</>
```

);
}
