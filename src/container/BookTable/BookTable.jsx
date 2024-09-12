import React, {useState, useEffect} from 'react';

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { addMonths, format, parse } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BeatLoader from 'react-spinners/BeatLoader'; 
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './BookTable.css'
import useCustomFetch from '../../reducers/useCustomFetch';


const BookTable = () => {

    const { customFetch } = useCustomFetch();
    const [selectedDate, setSelectedDate] = useState(null);
    const [isButtonEnabled, setIsButtonEnabled] = useState(false); 
    const [tables, setTables] = useState([]);
    const [displayTables, setDisplayTables] = useState(false);
    const [bookTable, setBookTable] = useState(null);
    const [bookTime, setBookTime] = useState(null);
    const [bookDate, setBookDate] = useState(null);
    const [tableSelected, setTableSelected] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [selectedTime, setSelectedTime] = useState(null);
    const [showAvailibilityBox, setShowAvailibilityBox] = useState(false);
    const [tableDetails, setTableDetails] = useState(null);
    const [timeSlot, setTimeSlot] = useState(null);
    const [showActiveBookings, setShowActiveBookings] = useState(false);
    const [showPastBookings, setShowPastBookings] = useState(false);
    const [activeBookings,setActiveBookings] = useState([]);
    const [pastBookings, setPastBookings] = useState([]);
    const [reservationId, setReservationId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {    
      activeBooking();
    }, [])
    

    const today = new Date();
    const sixMonthsFromToday = addMonths(today, 6);

    const disableDateAfter6PM = (date) => {
      const now = new Date();
      const hours = now.getHours();
      const isToday = date.toDateString() === now.toDateString();
  
      // If it's after 18:00:00 and the date is today, disable it
      return isToday && hours >= 18;
    };
  
    const checkAvailability = async (e) => {
      e.preventDefault();
      console.log(activeBookings);
      
      if(activeBookings.length > 0){
        setMessageType('error');
        setMessage("Only one reservation is allowed at a time!");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      }
      
      else{

      setLoading(true); 

      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      setBookDate(formattedDate);
      setTableSelected(false);
      console.log(formattedDate);

      const response = await customFetch('https://restaurant-springboot-backend-admin-hvbsbzg5hvekhedz.uksouth-01.azurewebsites.net/api/auth/user/check-availability', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestedDate : formattedDate }),
        credentials: 'include',
      });

      const data = await response.json();

      if(response.ok) {
        setShowAvailibilityBox(true);
        setTables(data.restaurantTables);
        setDisplayTables(true);
        setSelectedDate(format(selectedDate, 'EEEE, MMMM d, y'));
        setShowActiveBookings(false);
        setShowPastBookings(false);
      }
      else {
        console.error('Failed to fetch');
      }
      setLoading(false);
    }
    }

    const formatTime = (timeString) => {
      const parsedTime = parse(timeString, 'HH:mm:ss', new Date());
      return format(parsedTime, 'h:mm a');
    };

    const booking = async (e) => {
      e.preventDefault();

      setLoading(true); 

      const response = await customFetch('https://restaurant-springboot-backend-admin-hvbsbzg5hvekhedz.uksouth-01.azurewebsites.net/api/auth/user/book-table', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({tableId : bookTable, timeSlot : bookTime, reservationDate : bookDate}),
        credentials: 'include',
      });

      console.log(bookTable, bookTime, bookDate);
      const data = await response.json();
      console.log(data);

      if(response.ok) {
        console.log("response okay")
        setMessageType('success');
        setMessage(data.message);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
        setShowAvailibilityBox(false);
          setTableDetails(null);
          setTimeSlot(null);
          setSelectedDate(null);
      }
      else {
        console.error('Failed to fetch');
      }

      setLoading(false);
    }

    const activeBooking = async () => {

      const response = await customFetch('https://restaurant-springboot-backend-admin-hvbsbzg5hvekhedz.uksouth-01.azurewebsites.net/api/auth/user/view-booking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if(response.ok) {
        setActiveBookings(data.reservationDetails);
      }
      else {
        console.error('Failed to fetch');
      }
    }

    const pastBooking = async () => {

      setLoading(true);

      const response = await customFetch('https://restaurant-springboot-backend-admin-hvbsbzg5hvekhedz.uksouth-01.azurewebsites.net/api/auth/user/view-history', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if(response.ok) {
        setPastBookings(data.reservationDetails);
      }
      else {
        console.error('Failed to fetch');
      }
      setLoading(false);
    }

    const cancelBooking = async (reservationId) => {

      setLoading(true);

      const response = await customFetch('https://restaurant-springboot-backend-admin-hvbsbzg5hvekhedz.uksouth-01.azurewebsites.net/api/auth/user/cancel-booking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({reservationId : reservationId}),
        credentials: 'include',
      });

      const data = await response.json();

      if(response.ok) {
        setMessageType('success');
        setMessage(data.message);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
        activeBooking();
      }
      else {
        console.error('Failed to fetch');
      }
      setLoading(false);
    }

    return (
      <div className='book-body'>
        {showMessage && <div className={`floating-message ${messageType}`}>{message}</div>}
        {loading && (
                <div className="overlay">
                    <BeatLoader color="#ffffff" loading={loading} size={20} />
                </div>
            )}
        <div className="book-box">
        <div className="book-header">
            <header>Book Table</header>
        </div>
        <form onSubmit={checkAvailability} className='date-form'>
          <DayPicker 
            startMonth={today} 
            endMonth={sixMonthsFromToday}
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={[
              {before: today},
              {after: sixMonthsFromToday},
              disableDateAfter6PM,
            ]}
            className="day-picker"
            style={{ color: "white"}}
          />
          <div class="input-submit">
            <button type="submit" className="submit-btn check-availabilty-btn" id="submit" disabled= {selectedDate ? false : true}></button>
            <label for="submit">Check Availability</label>
          </div>
        </form>
        </div>

        <div className="dropdown-container">
    <div className="active-dropdown-container">
        {/* Dropdown for Active Bookings */}
        <div className="dropdown">
        <div className='dropdown-btn-container'>

            <button
                className="dropdown-btn"
                onClick={() => {
                    activeBooking();
                    setShowActiveBookings(!showActiveBookings);
                    setShowPastBookings(false);
                }}
            >
            </button>
            <label for="dropdown-booking">View Active Bookings</label>
            </div>
            {showActiveBookings && (
                <div className="dropdown-content">
                  {activeBookings && activeBookings.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Table</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeBookings.map((booking) => (
                                <tr key={booking.reservationId}>
                                    <td>{booking.tableDesc}</td>
                                    <td>{booking.reservationDate}</td>
                                    <td>{formatTime(booking.reservationTime)}</td>
                                    <td>
                                        <button
                                          className='cancel-booking-btn'
                                          onClick={() => {
                                                cancelBooking(booking.reservationId);
                                          }}
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            ))}
                           </tbody>
                    </table>
                    ) : (
                      <div className="no-data-message">Nothing to Display!</div> 

                    )}
                </div>
            )}
        </div>
    </div>

    <div className="past-dropdown-container">
        {/* Dropdown for Past Bookings */}
        <div className="dropdown">
          <div className='dropdown-btn-container'>
            <button
                className="dropdown-btn"
                id='dropdown-booking'
                onClick={() => {
                    pastBooking();
                    setShowPastBookings(!showPastBookings);
                    setShowActiveBookings(false);
                }}
            >
            </button>
            <label for="dropdown-booking">Booking History</label>
          </div>
            {showPastBookings && (
                <div className="dropdown-content">
                  {pastBookings && pastBookings.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Table</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pastBookings.map((booking) => (
                                <tr key={booking.reservationId}>
                                    <td>{booking.tableDesc}</td>
                                    <td>{booking.reservationDate}</td>
                                    <td>{formatTime(booking.reservationTime)}</td>
                                    <td>{booking.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    ) : (
                      <div className="no-data-message">Nothing to Display!</div> 
                    )}
                </div>
            )}
        </div>
    </div>
</div>


    {showAvailibilityBox && (
      <div className="availability-floating-box">
        <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={() => {
          setShowAvailibilityBox(false);
          setTableDetails(null);
          setTimeSlot(null);
          setSelectedDate(null);
        }} />
    <form onSubmit={booking} className='table-form'>
    {tables.length > 0 ? (
      <div className="tables-container">
      <div class="legend">
          <div class="legend-item">
              <div class="color-box green"></div>
              <span>Available</span>
          </div>
          <div class="legend-item">
              <div class="color-box yellow"></div>
              <span>Selected</span>
          </div>
          <div class="legend-item">
              <div class="color-box red"></div>
              <span>Booked</span>
          </div>
      </div>
      <div className="table-row">
        {tables.map((table) => (
          <div key={table.id} className="table-card">
            <img src={`https://restaurant-springboot-backend-admin-hvbsbzg5hvekhedz.uksouth-01.azurewebsites.net${table.tableImg}`} alt="table" className="table-img"/>
            <div className="card-divider"></div>
            <div className="time-slots">
              {table.availableSlots.map((availableSlot) => (
                <div key={availableSlot.timeSlot}>
                  <button
                    type="button"
                    className={`button-${availableSlot.status} time-slot`}
                    disabled={availableSlot.status !== "available"}
                    onClick={() => {
                      setBookTime(availableSlot.timeSlot);
                      setTimeSlot(formatTime(availableSlot.timeSlot));
                      setBookTable(table.id);
                      setTableSelected(true);
                      setTableDetails(table.tableDesc);
                    }}
                  >
                    {formatTime(availableSlot.timeSlot)}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        </div>
        <div className="confirm-floating-container">
      <div className="details">
        <p><strong>Table Selected :</strong> <span>{tableDetails || '--'}</span></p>
        <p><strong>Date :</strong> <span>{selectedDate}</span></p>
        <p><strong>Time Slot :</strong> <span>{timeSlot || '--'}</span></p>
      </div>
      <div className='booking-button'>
      <button type='submit' id="book-table-button" disabled={!bookTime}></button>
      <label for="book-table-button">Book Table</label>
      </div>
    </div>
    </div>
) : (
  <div className='booking-info'>
    <p>**We accept booking upto to 6 months only.</p>
  </div>
)}
  </form>
  </div>
  )}
      </div>
    )
}

export default BookTable;