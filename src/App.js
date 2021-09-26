import './App.css';
import { useEffect, useState } from 'react';
import useFetch from './useFetch';

function App() {
  const [guests, setGuests] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [attending, setAttending] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { get, post, loading } = useFetch(
    'https://my-react-guest-list-serv.herokuapp.com',
  );
  const baseUrl = 'https://my-react-guest-list-serv.herokuapp.com';

  useEffect(() => {
    get('/').then((data) => {
      if (data) {
        setGuests(data);
      }
    });
  }, [get, guests]);

  function deleteGuestOnServer(id) {
    fetch(baseUrl + '/' + id, {
      method: 'delete',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.error(error));
  }

  function toggleAttending(id) {
    setAttending(!attending);
    fetch(baseUrl + '/' + id, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ attending }),
    })
      .then((response) => {
        console.log(response);
        response.json();
      })
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    if (!firstName) {
      return;
    } else if (!lastName) {
      return;
    } else {
      post('/', { id: guests.length + 1, firstName, lastName }).then((data) => {
        console.log(data);
        if (data) {
          setGuests([
            ...guests,
            { id: guests.length + 1, firstName, lastName },
          ]);
          setFirstName('');
          setLastName('');
        }
      });
    }
  }

  if (loading) {
    return <p>loading...</p>;
  }

  return (
    <div className="App">
      <h1>The Yellow Guest List</h1>
      <button onClick={() => setDisabled(!disabled)}>Form On / Off</button>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="first-name">First name: </label>
        <input
          id="first-name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <label htmlFor="last-name">Last name: </label>
        <input
          id="last-name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <button disabled={disabled}>Add Guest</button>
      </form>

      <ul>
        {guests.map((guest) => (
          <li key={guest.id}>
            {guest.firstName} {guest.lastName}{' '}
            <button onClick={() => toggleAttending(guest.id)}>Attending</button>
            {guest.attending ? <span>Yes</span> : <span>No</span>}
            <button onClick={() => deleteGuestOnServer(guest.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
