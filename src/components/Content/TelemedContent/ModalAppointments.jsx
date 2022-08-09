import { Modal, Form } from 'react-bootstrap';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getDeps } from "../../../features/departments/depsSlice";
import { getUsers } from "../../../features/users/userSlice";
import { addAppointment } from "../../../features/appointment/appointmentSlice";
import styles from "./Telemed.module.css";

const ModalAppointments = (showModalAppoint, setShowModalAppoint) => {
   const dispatch = useDispatch();

   const deps = useSelector((state) => state.deps.departments);
   const users = useSelector((state) => state.usersReducer.users);
   const userId = useSelector((state) => state.usersReducer.userId);
   const appointment = useSelector((state) => state.appointmentsReducer.appointment);

   const appointmentsUser = appointment.filter((appointment) => appointment.user === userId);

   const [selectedService, setSelectedService] = useState();
   const [selectedDoctor, setSelectedDoctor] = useState();

   useEffect(() => {
      dispatch(getDeps());
   }, [dispatch]);

   useEffect(() => {
      dispatch(getUsers());
   }, [dispatch]);

   const doctors = users.filter((doc) => doc.role === "doctor");

   const handleClose = () => {
      setShowModalAppoint(false);
   }

   const handleSelectServices = (selected) => {
      setSelectedService(selected);
   }

   const handleSelectDoctor = (selected) => {
      setSelectedDoctor(selected);
   }

   const handleAddAppointment = (e) => {
      const doctorId = selectedDoctor;
      const user = userId;
      const service = selectedService;
      e.preventDefault();
      dispatch(addAppointment({doctorId, user, service}));
   }

   return (
      <Modal
         show={showModalAppoint}
         onHide={handleClose}
         keyboard={true}
         backdrop="static"
         style={{ fontFamily: "Roboto Condensed, sans-serif" }}
      >
         <Modal.Header closeButton onClick={handleClose}>
            <Modal.Title>
               Запись на телемедицину
            </Modal.Title>
         </Modal.Header>

         <Modal.Body>
            <Form>
               <Form.Group className="mb-3" controlId="formBasicServices">
                  <Form.Label style={{ color: "black" }}>Выберите услугу</Form.Label>
                  <Form.Select onChange={(e) => handleSelectServices(e.target.value)}
                     value={selectedService}>
                     <option />
                     {deps.map((dep, index) => {
                        return (
                           <option style={index % 2 === 0 ?
                              { fontSize: "18px", background: "white" }
                              :
                              { fontSize: "18px", background: "#7bbbf8" }}
                              value={dep._id}
                              key={index}>
                              {dep.title}
                           </option>
                        )
                     })}
                  </Form.Select>
               </Form.Group>

               <Form.Group className="mb-3" controlId="formBasicDoctor">
                  <Form.Label style={{ color: "black" }}>Выберите врача</Form.Label>
                  <Form.Select onChange={(e) => handleSelectDoctor(e.target.value)}
                     value={selectedDoctor}>
                     <option />
                     {doctors.map((doc, index) => {
                        return (
                           <option style={index % 2 === 0 ?
                              { fontSize: "18px", background: "white" }
                              :
                              { fontSize: "18px", background: "#7bbbf8" }}
                              value={doc._id}
                              key={index}>
                              {doc.lastName} {doc.firstName}
                           </option>
                        )
                     })}
                  </Form.Select>
               </Form.Group>

               <Form.Group className="d-flex justify-content-end mb-3" controlId="formBasicButton">
                  <button onClick={handleAddAppointment} className={styles.btn}>ЗАПИСАТЬСЯ</button>
               </Form.Group>
            </Form>
         </Modal.Body>
      </Modal>
   )
};
export default ModalAppointments;