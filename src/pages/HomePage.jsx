import { useState, useEffect } from 'react'
import { Modal } from '../components/Modal/Modal';
import './HomePage.css'

export function HomePage() {

    //const [conflict, setConflict] = useState(false);
    const [reservations, setreservations] = useState([]);
    const [hasError, setHasError] = useState({
        meetingName: false,
        date: false,
        start: false,
        end: false,
        room: false
    });

   // const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
 
    const [ idToDelete, setIdToDelete ] = useState(null);

    const [form, setForm] = useState({
        meetingName: '',
        date: '',
        start: '',
        end: '',
        room: ''
    });

     const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        message: ''
    });

    function handleChange(event) {

        const { name, value } = event.target;

        setForm(prevForm => (
            {
                ...prevForm,
                [name]: value
            }
        ));

        if(hasError[name]){
            setHasError(prevErrors => ({
                ...prevErrors,
                [name]: false
            }))
        }
    }

    function closeModal(){
        setModalConfig({isOpen: false, message: '', footer: null});
    }

    function createReservation() {

        const newErrors = {
            meetingName: !form.meetingName.trim(),
            date: !form.date.trim(),
            start: !form.start.trim(),
            end: !form.end.trim(),
            room: !form.room.trim()
        }

        setHasError(newErrors);

        if(Object.values(newErrors).some(Boolean)){
            setModalConfig({isOpen: true, message: 'Fill in all fields.'});
            return;
        }

        if(checkTimeConflict(form, reservations)){
            setModalConfig({isOpen: true, message: 'Date, time, and room already filled in!'});
            return;
        }

        if(checkInvalidTime(form)){
            setModalConfig({isOpen: true, message: 'Invalid time. Try again!'});
            return;
        }

        /*
        const theresAnError = Object.values(newErrors).some(error => error === true);

        if(theresAnError){
            setIsErrorModalOpen(true)
            return;
        }

        setIsErrorModalOpen(false);

        const isConflicting = checkTimeConflict(form, reservations);

        if(isConflicting){
            setConflict(true);
            return;
        }
        */
        
        const newReservation = {
            id: crypto.randomUUID(),
            ...form
        }

        setreservations(prevReservations => [
            ...prevReservations,
            newReservation
        ]);

        setForm(
            {
                meetingName: '',
                date: '',
                start: '',
                end: '',
                room: ''
            }
        )

        setHasError({
            meetingName: false,
            date: false,
            start: false,
            end: false,
            room: false
        });

    };

    function requestDeletion(id){
        setIdToDelete(id);
        setModalConfig({isOpen: true, message: 'Do you really want to delete the meeting?', footer: true});
    }

    function confirmDeletion(){
        if (!idToDelete) return;
        
        setreservations(prevReservations => 
            prevReservations.filter(reserva => reserva.id !== idToDelete)
        );

        setIdToDelete(null);
        closeModal();
    }

    function cancelDeletion(){
        setIdToDelete(null);
        closeModal();
    }

    function hourToMinutes(timeString){
        const [ hours, minutes ] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    }

    function checkTimeConflict(newMeeting, currentReservations){
        const newStart = hourToMinutes(newMeeting.start);
        const newEnd = hourToMinutes(newMeeting.end);

        return currentReservations.some(reservation => {

            const isSameRoomAndDate = reservation.date === newMeeting.date && reservation.room === newMeeting.room;

            if(isSameRoomAndDate){
                const existingStart = hourToMinutes(reservation.start);
                const existingEnd = hourToMinutes(reservation.end);

                const hasOverLap = newStart < existingEnd && newEnd > existingStart;

                return hasOverLap;
            }

            return false;
        })
    }

    function checkInvalidTime(newMeeting){
        const newStart = hourToMinutes(newMeeting.start);
        const newEnd = hourToMinutes(newMeeting.end);

        return newStart >= newEnd;
    }

    useEffect(() => {
        console.log(reservations);
    }, [reservations])


    return (
        <main>

            {
                <Modal 
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                message={modalConfig.message}
                footer={modalConfig.footer}
                confirm={confirmDeletion}
                cancel={cancelDeletion}
                >
                </Modal>
            }

             {

            /*
                idToDelete && (
                    <div id="confirmBox" className="overlay2
         ">
                        <div className="confirmMessage">
                            Do you really want to delete the meeting?

                            <div className="btnsBox">
                                <button 
                                id='cancelar'
                                onClick={cancelDeletion}
                                >Cancel</button>
                                <button 
                                id='confirmar'
                                 onClick={confirmDeletion}
                                >Confirm</button>
                            </div>
                        </div>
                    </div>
                )
                    */
            }

            <div className="mainContent">
                <h1>Meeting Booking</h1>
                <img width="200px" src="../../public/images/main-image.png" alt="" />

                <div className="inputBox">
                    <div className="inputItemBox">
                        <label htmlFor="meetingName">Meeting Name</label>
                        <input
                            style={{ border: hasError.meetingName ? '1px solid red' : '1px solid rgba(0, 0, 0, 0.3)' }}
                            maxlength="20"
                            type="text"
                            name="meetingName"
                            id="meetingName"
                            required="required"
                            placeholder="Meeting name..."
                            onChange={handleChange}
                            value={form.meetingName}
                        />
                    </div>
                    <div className="inputItemBox">
                        <label htmlFor="dateReuniao">Meeting Date</label>
                        <input
                            style={{ border: hasError.date ? '1px solid red' : '1px solid rgba(0, 0, 0, 0.3)' }}
                            type="date"
                            name="date"
                            id="dateReuniao"
                            onChange={handleChange}
                            value={form.date}
                        />
                    </div>
                    <div className="inputItemBox">
                        <label htmlFor="horariostart">Meeting Time</label>
                        <input
                            style={{ border: hasError.start ? '1px solid red' : '1px solid rgba(0, 0, 0, 0.3)' }}
                            type="time"
                            step="1800"
                            name="start"
                            id="horariostart"
                            onChange={handleChange}
                            value={form.start}
                        />
                    </div>
                    <div className="inputItemBox">
                        <label htmlFor="horarioend">End Time</label>
                        <input
                            style={{ border: hasError.end ? '1px solid red' : '1px solid rgba(0, 0, 0, 0.3)' }}
                            type="time"
                            step="1800"
                            name="end"
                            id="horarioend"
                            onChange={handleChange}
                            value={form.end}
                        />
                    </div>
                    <div className="inputItemBox">
                        <label htmlFor="rooms">Room</label>
                        <select
                            id="rooms"
                            name="room"
                            onChange={handleChange}
                            value={form.room}
                            style={{ border: hasError.room ? '1px solid red' : '1px solid rgba(0, 0, 0, 0.3)' }}
                        >
                            <option value=''>Select a room...</option>
                            <option value="roomOne">1° room</option>
                            <option value="roomTwo">2° room</option>
                            <option value="roomThree">3° room</option>
                            <option value="roomFour">4° room</option>
                            <option value="roomFive">5° room</option>
                        </select>
                    </div>
                </div>
                <button onClick={createReservation} id="btnReservar">reserve</button>
            </div>

            <section className="reservations">
                {
                    reservations.map((reserva) => {
                        return (
                            <div key={reserva.id} className="resevaBox">
                                <img 
                                className='deleteReunion' 
                                width='40px' 
                                src='../../public/images/close-icon.svg'
                                onClick={()=>{
                                    requestDeletion(reserva.id)
                                }}
                                ></img>
                                <p id="smeetingName">{reserva.meetingName.toUpperCase()}</p>
                                <p>LOCAL: <span>{reserva.room.toUpperCase()}</span></p>
                                <p>HORÁRIO: <span>{reserva.start} - {reserva.end}</span></p>
                                <p>date: <span>{reserva.date}</span></p>
                            </div>
                        )
                    })
                }
            </section>
        </main>
    )
}

