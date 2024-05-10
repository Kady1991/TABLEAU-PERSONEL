import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, Button, Radio, Row, Col, DatePicker, Select } from 'antd';
import { FiEdit } from "react-icons/fi";
import axios from 'axios';

const { Option } = Select;

const EditMemberForm = ({ personId }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [personData, setPersonData] = useState(null);
    const [grades, setGrades] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [otherServices, setOtherServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [selectedServiceDetails, setSelectedServiceDetails] = useState(null); 
    const [form] = Form.useForm(); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const personResponse = await axios.get(`https://server-iis.uccle.intra/API_Personne/api/Personne/${personId}`);
                setPersonData(personResponse.data);
                console.log(personResponse);
                form.setFieldsValue(personResponse.data); // Pré-remplir les champs avec les données de la personne
            } catch (error) {
                console.error('Erreur lors de la récupération des données de la personne:', error);
            }

            try {
                const gradesResponse = await axios.get(`https://server-iis.uccle.intra/API_Personne/api/wwgrades`);
                setGrades(gradesResponse.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des grades:', error);
            }

            try {
                const addressesResponse = await axios.get(`https://server-iis.uccle.intra/API_Personne/api/Adresses`);
                setAddresses(addressesResponse.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des adresses:', error);
            }

            try {
                const servicesResponse = await axios.get(`https://server-iis.uccle.intra/API_Personne/api/affectation/services`);
                setOtherServices(servicesResponse.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des autres services:', error);
            }
        };

        fetchData();
    }, [personId, form]);

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const handleServiceSelection = (value) => {
        const selectedService = otherServices.find(service => service.IDService === value);
        setSelectedServiceDetails(selectedService);
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
                    AdresseID: values.adresse,
                    ServiceID: values.service,
                    SiFrancais: values.siFrancais,
                    SiServicePrincipal: true,
                    SiTypePersonnel: values.siPersonnel,
                };
                console.log(formData);
                const response = await axios.put(
                    `https://server-iis.uccle.intra/API_Personne/api/Personne/edit${personId}`,
                    values
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
            <FiEdit title='Editer' style={{ fontSize: '20px', cursor: 'pointer', color: '#095e74', marginBottom: "10px" }} onClick={handleOpenModal} />
            <Modal
                title="EDITER"
                visible={isModalVisible}
                onCancel={handleCloseModal}
                style={{ textAlign: "center" }}
                centered
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '100vh',
                    }}
                >
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        layout="vertical"
                        style={{
                            maxWidth: "800px",
                            width: "100%",
                            padding: "20px",
                            backgroundColor: "#f0f2f5",
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        }}
                    >
                        <Row gutter={[16]}>
                            <Col span={12}>
                                <Form.Item label="Nom" name="NomPersonne" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Prénom" name="PrenomPersonne" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Service principal" name="NomServiceFr" rules={[{ required: true }]}>
                                    <Input />
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
                                    {addresses.map(address => (
                                        <Option key={address.IDAdresse} value={address.IDAdresse}>
                                            {address.NomRueFr} {address.NomRueNl}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                style={{ width: "100%" }}
                                name="service"
                                label="Service"
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
                            <Col span={12}>
                                <Form.Item label="Français" name="siFrancais" rules={[{ required: true }]}>
                                    <Radio.Group>
                                        <Radio value={true}>FR</Radio>
                                        <Radio value={false}>Nl</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Personnel" name="siPersonnel" rules={[{ required: true }]}>
                                    <Radio.Group>
                                        <Radio value={true}>Oui</Radio>
                                        <Radio value={false}>Non</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        {selectedServiceDetails && (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "auto auto",
                                    gap: 1,
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

export default EditMemberForm;
