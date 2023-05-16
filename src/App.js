import { useEffect, useState } from 'react';
import styles from './App.module.scss';

export default function App() {
  // API Setup
  const baseUrl = 'https://6aa40e58-63d5-4116-8244-355803782cc0.id.repl.co';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // on first page load, fetch data from API

  async function fetchGuests() {
    setIsLoading(true);
    const response = await fetch(`${baseUrl}/guests`);
    const allGuests = await response.json();
    setGuests(allGuests);
    setIsLoading(false);
  }
  useEffect(() => {
    fetchGuests().catch((error) => console.log(error));
  }, []);

  // create user with API
  async function addGuest() {
    try {
      const response = await fetch(`${baseUrl}/guests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          attending: false,
        }),
      });
      const createdGuest = await response.json();
      return createdGuest;
    } catch (error) {
      console.log(error);
    }
  }
  // update user with API
  async function updateGuest(id) {
    try {
      const guestToUpdate = guests.find((guest) => guest.id === id); // find method to get the unique guest id
      const response = await fetch(`${baseUrl}/guests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attending: !guestToUpdate.attending }), // change attending status to opposite
      });
      const updatedGuest = await response.json();
      const updatedGuests = guests.map((guest) => {
        if (guest.id === updatedGuest.id) {
          return updatedGuest;
        } else {
          return guest;
        }
      });
      setGuests(updatedGuests);
    } catch (error) {
      console.log(error);
    }
  }

  // delete user with API
  async function deleteGuest(id) {
    try {
      const response = await fetch(`${baseUrl}/guests/${id}`, {
        method: 'DELETE',
      });
      const deletedGuest = await response.json();
      const newGuests = guests.filter((guest) => guest.id !== deletedGuest.id);
      setGuests(newGuests);
    } catch (error) {
      console.log(error);
    }
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    await addGuest();
    setFirstName('');
    setLastName('');
    await fetchGuests();
  };
  const handleKeyPress = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      await addGuest();
      setFirstName('');
      setLastName('');
      await fetchGuests();
    }
  };
  return (
    <main className={styles.mainContainer}>
      <section>
        <h1>Guest List</h1>
        <form onSubmit={handleSubmit}>
          <label>
            First name
            <input
              value={firstName}
              placeholder="First name"
              disabled={isLoading}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </label>
          <label>
            Last name
            <input
              value={lastName}
              placeholder="First name"
              disabled={isLoading}
              onChange={(event) => {
                setLastName(event.target.value);
              }}
              onKeyUp={handleKeyPress}
            />
          </label>
          <button disabled={isLoading}>Add guest</button>
        </form>
      </section>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <section>
          {guests.map((guest) => {
            return (
              <div
                className={styles.listItem}
                key={`guest-${guest.id}`}
                data-test-id="guest"
              >
                <div>
                  <input
                    aria-label={`${guest.firstName} ${guest.lastName} attending status`}
                    type="checkbox"
                    checked={guest.attending}
                    onChange={() => {
                      updateGuest(guest.id, guest.attending).catch((error) =>
                        console.log(error),
                      );
                    }}
                  />
                  <span>
                    {guest.attending === true ? 'attending' : 'not attending'}
                  </span>
                </div>
                <p>
                  {guest.firstName} {guest.lastName}
                </p>

                <button
                  aria-label={`remove ${guest.firstName}${guest.lastName}`}
                  onClick={() => {
                    deleteGuest(guest.id).catch((error) => console.log(error));
                  }}
                  disabled={isLoading}
                >
                  Remove guest
                </button>
              </div>
            );
          })}
        </section>
      )}
    </main>
  );
}
