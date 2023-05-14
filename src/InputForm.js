import { useState } from 'react';

export default function InputForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestList, setGuestList] = useState('');
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const newGuest = { firstName, lastName };
      const updatedList = [...guestList, newGuest];
      setGuestList(updatedList);
    }
  };

  return (
    <form>
      <label>
        First name{' '}
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last name{' '}
        <input
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
          }}
          onKeyUp={handleKeyPress}
        />
      </label>
    </form>
  );
}
