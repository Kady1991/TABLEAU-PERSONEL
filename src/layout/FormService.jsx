import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Radio, Row, Col, DatePicker, Select } from 'antd';
import { MdMedicalServices } from "react-icons/md";
import axios from 'axios';
import '../assets/index.css';

import { LIEN_API_PERSONNE } from '../config';

const { Option } = Select;

const FormService = ({ IDPersonneService }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [personData, setPersonData] = useState(null);
    const [grades, setGrades] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [otherServices, setOtherServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [selectedServiceDetails, setSelectedServiceDetails] = useState(null); // Ajout de l'état pour stocker les détails du service sélectionné
    const [isPersonnelSelected, setIsPersonnelSelected] = useState(false); // Ajout de l'état pour gérer l'affichage du champ supplémentaire
    const [typePersonnelData, setTypePersonnelData] = useState([]);
    const [typePersonnelList, setTypePersonnelList] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const personResponse = await axios.get(
                    `${LIEN_API_PERSONNE}/api/Personne/${IDPersonneService}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );
                setPersonData(personResponse.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données de la personne:', error);
                if (error.response) {
                    console.error('Détails de l\'erreur (error.response.data) :', error.response.data);
                }
            }


            try {
                const gradesResponse = await axios.get(`${LIEN_API_PERSONNE}/api/wwgrades`);
                setGrades(gradesResponse.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des grades:', error);
            }

            try {
                const addressesResponse = await axios.get(`${LIEN_API_PERSONNE}/api/Adresses`);
                setAddresses(addressesResponse.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des adresses:', error);
            }


            // Récupérer la liste des types de personnel depuis votre API
            try {
                const typePersonnelResponse = await axios.get(
                    `${LIEN_API_PERSONNE}/api/typepersonnel`
                );
                setTypePersonnelList(typePersonnelResponse.data);

            } catch (error) {
                console.error("Erreur lors du chargement des données:", error);
            }

            try {
                const servicesResponse = await axios.get(`${LIEN_API_PERSONNE}/api/affectation/services`);
                setOtherServices(servicesResponse.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des autres services:', error);
            }
        };

        fetchData();
    }, [IDPersonneService]);

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const handleServiceSelection = (value) => {
        // Recherche des détails du service sélectionné
        const selectedService = otherServices.find(service => service.IDService === value);
        setSelectedServiceDetails(selectedService);
    };

    const handlePersonnelSelection = (value) => {
        setIsPersonnelSelected(value);
    };



    // Logique de soumission du formulaire
    const handleSubmit = async (values) => {
        setLoading(true);
        setLoading(true);
        try {
            const option = {
                day: "numeric",
                month: "2-digit",
                year: "numeric",
            };
            const dateEntree = new Intl.DateTimeFormat("fr-FR", option).format(
                values.dateEntree
            );

            const formData = {
                NomPersonne: values.nom,
                PrenomPersonne: values.prenom,
                Email: values.email,
                TelPro: values.telephone == undefined ? null : values.telephone,
                DateEntree: dateEntree,
                WWGradeID: values.grade,
                AdresseID: values.AdresseID,
                ServiceID: values.service,
                SiFrancais: values.siFrancais,
                SiServicePrincipal: values.SiServicePrincipal,
                SiTypePersonnel: values.SiTypePersonnel,
                TypePersonnelID: values.TypePersonnelID,
            };
            console.log(formData);
            const response = await axios.post(
                "https://server-iis.uccle.intra/API_Personne/api/Personne",
                formData
            );

            if (!response.data) {
                throw new Error("Erreur lors de l'envoi des données");
            }
            // Afficher une alerte lorsque l'ajout est réussi
            alert("Ajout réussi !");
            console.log("Nouveau service ajouté avec succès");
            // Fermer le formulaire après l'ajout réussi
            setFormSubmitted(true);

        } catch (error) {
            console.error("Erreur lors de l'envoi des données", error);
        } finally {
            setLoading(false);
        }
    };

    if (formSubmitted) {
        // Si le formulaire a été soumis avec succès, ne rend pas le formulaire
        return null;
    }

    return (
        <>
            <MdMedicalServices className='Service-icon' title='Ajouter un service' onClick={handleOpenModal} />
            <Modal
                title="Ajouter un Service supplémentaire"
                open={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
                style={{ textAlign: "center", minHeight: "60vh", minWidth: "70vh", }}
                centered
            >

                <div

                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '50vh', // Ajuste la hauteur de la modal pour occuper tout l'écran
                    }}
                >
                    <Form
                        onFinish={handleSubmit}
                        values={personData}
                        layout="vertical"
                        style={{
                            maxWidth: "50vw",
                            width: "100%",
                            backgroundColor: "#f0f2f5",
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            padding: "2rem",
                        }}
                        initialValues={{
                            NomPersonne: personData ? personData.NomPersonne : '', // Assurez-vous que personData est défini et extrayez le nom si possible
                            PrenomPersonne: personData ? personData.PrenomPersonne : '', // Assurez-vous que personData est défini et extrayez le prénom si possible
                            NomServiceFr: personData ? personData.NomServiceFr : '',
                            siPersonnel: false,
                            siFrancais: true,
                        }}
                    >
                        <Row gutter={[16]}>
                            <Col span={12}>
                                <Form.Item label="Nom" name="NomPersonne" rules={[{ required: true }]}>
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Prénom" name="PrenomPersonne" rules={[{ required: true }]}>
                                    <Input disabled />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label="Service principal" name="NomServiceFr" rules={[{ required: true }]}>
                                    <Input disabled />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label="Téléphone" name="tel" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="E-mail" name="email" rules={[{ required: true, type: 'email' }]}>
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label="Date" name="dateEntree" rules={[{ required: true, message: "Veuillez choisir la date d'entrée" }]}>
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    style={{ width: "100%" }}
                                    name="grade"
                                    label="Grade"
                                    rules={[
                                        { required: true, message: "Veuillez choisir le grade" },
                                    ]}
                                >
                                    <Select

                                        allowClear
                                        showSearch
                                        optionFilterProp="children"
                                    >
                                        <Option key="placeholder" value="" disabled>
                                            Sélectionner un grade
                                        </Option>
                                        {grades.map(grade => (
                                            <Option key={grade.IDWWGrade} value={grade.IDWWGrade}>
                                                {grade.NomWWGradeFr}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={24}>

                                <Form.Item
                                    style={{ width: "100%" }}
                                    name="adresse"
                                    label="Adresse"
                                    rules={[
                                        { required: true, message: "Veuillez choisir l'adresse" },
                                    ]}
                                >
                                    <Select
                                        style={{ width: "100%" }}
                                        allowClear
                                        showSearch
                                        optionFilterProp="children"
                                    >
                                        <Option key="placeholder" value="" disabled>
                                            Sélectionner une adresse
                                        </Option>
                                        {addresses.map((adresse) => ( // Ici, j'ai corrigé `adresseData` en `addresses`
                                            <Option
                                                key={adresse.IDAdresse}
                                                value={adresse.IDAdresse}
                                            >
                                                {adresse.AdresseComplete}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>


                            <Col span={24}>
                                <Form.Item
                                    style={{ width: "100%" }}
                                    name="service"
                                    label="Service supplémentaire"
                                    rules={[
                                        { required: true, message: "Veuillez choisir le service" },
                                    ]}
                                >
                                    <Select

                                        allowClear
                                        showSearch
                                        optionFilterProp="children"
                                        onChange={handleServiceSelection}
                                    >
                                        <Option key="placeholder" value="" disabled>
                                            Sélectionner un service
                                        </Option>
                                        {otherServices.map(service => (
                                            <Option key={service.IDService} value={service.IDService}>
                                                {service.NomServiceFr} {service.NomServiceNl}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <Form.Item
                                        name="siPersonnel"
                                        label="Personnel"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Veuillez choisir si le membre est personnel",
                                            },
                                        ]}
                                    >
                                        <Radio.Group onChange={(e) => handlePersonnelSelection(e.target.value)}>
                                            <Radio value={true}>Oui</Radio>
                                            <Radio value={false}>Non</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </div>
                                {isPersonnelSelected && (
                                    <Form.Item
                                        name="TypePersonnelID"
                                        label="Type de personnel"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Veuillez choisir le type de personnel",
                                            },
                                        ]}
                                    >
                                        <Select
                                            style={{ width: "100%" }}
                                            allowClear
                                            showSearch
                                            optionFilterProp="children"
                                        >
                                            {typePersonnelList.map(typePersonnel => (
                                                <Option key={typePersonnel.IDTypePersonnel} value={typePersonnel.IDTypePersonnel}>
                                                    {typePersonnel.NomTypePersonnelFr}
                                                </Option>
                                            ))}
                                        </Select>

                                    </Form.Item>
                                )}
                            </Col>

                            <Col span={12}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <Form.Item
                                        name="siFrancais"
                                        label="Français"
                                        rules={[
                                            { required: true, message: "Veuillez choisir la langue" },
                                        ]}
                                    >
                                        <Radio.Group>
                                            <Radio value={true}>FR</Radio>
                                            <Radio value={false}>Nl</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </div>
                            </Col>


                        </Row>

                        {selectedServiceDetails && (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "auto auto", // Deux colonnes
                                    gap: 1, // Espacement entre les éléments
                                }}
                            >
                                <div style={{ textAlign: "left" }}>
                                    <p>
                                        <span style={{ fontWeight: "bold" }}>Chef du Service:</span>{" "}
                                        {selectedServiceDetails.NomChefService}
                                        {"  "}
                                        {selectedServiceDetails.PrenomChefService}
                                    </p>

                                    <p>
                                        <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                                            Chef du Département:
                                        </span>
                                        {"  "}
                                        {selectedServiceDetails.NomChefDepartement}{" "}
                                        {selectedServiceDetails.PrenomChefDepartement}
                                    </p>
                                </div>
                            </div>
                        )}
                        <Form.Item>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Button style={{ margin: 10 }} type="primary" htmlType="submit">Valider</Button>
                                <Button onClick={handleCloseModal}>Annuler</Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    );
};


export default FormService;