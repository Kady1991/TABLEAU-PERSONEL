import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Radio, Row, Col, DatePicker, Select } from 'antd';
import { MdWorkHistory } from "react-icons/md";
import axios from 'axios';

const FormService = ({ personId }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [personData, setPersonData] = useState(null);
    const [grades, setGrades] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [otherServices, setOtherServices] = useState([]);

    useEffect(() => {
        const fetchPersonData = async () => {
            try {
                const response = await axios.get(`https://server-iis.uccle.intra/API_Personne/api/Personne/${personId}`);
                setPersonData(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données de la personne:', error);
            }
        };


        const fetchAddresses = async () => {
            try {
                const response = await axios.get(`https://server-iis.uccle.intra/API_Personne/api/Adresses`);
                setAddresses(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des adresses:', error);
            }
        };

        const fetchOtherServices = async () => {
            try {
                const response = await axios.get(`https://server-iis.uccle.intra/API_Personne/api/affectation/services`);
                setOtherServices(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des autres services:', error);
            }
        };


        const fetchGrades = async () => {
            try {
                const gradesResponse = await axios.get(`https://server-iis.uccle.intra/API_Personne/api/wwgrades`);
                setGrades(gradesResponse.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des grades:', error);
            }
        };


        if (personId) {
            fetchPersonData();
        }
    }, [personId]);




    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = (values) => {
        // Logique de soumission du formulaire
        console.log(values);
        handleCloseModal();
    };

    return (
        <>
            <MdWorkHistory style={{ fontSize: '20px', cursor: 'pointer' }} onClick={handleOpenModal} />
            <Modal
                title="Ajouter un Service supplémentaire"
                open={isModalVisible}
                onCancel={handleCloseModal}
                style={{ textAlign: "center" }}
                centered


            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '100vh', // Ajuste la hauteur de la modal pour occuper tout l'écran
                    }}
                >
                    <Form
                        onFinish={handleSubmit}
                        initialValues={personData}
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
                                <Form.Item label="Autre Service" name="Service" rules={[{ required: true }]}>
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
                                <Form.Item label="Date d'entrée" name="dateEntree" rules={[{ required: true }]}>
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="grade"
                                    label="Grade"
                                    rules={[
                                        { required: false, message: "Veuillez choisir le grade" },
                                    ]}
                                >
                                    <Select
                                        style={{ width: "100%" }}
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
                            <Form.Item
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
                                name="service"
                                label="Service"
                                rules={[
                                    { required: true, message: "Veuillez choisir le service" },
                                ]}
                            >
                                <Select
                                    style={{ width: "100%" }}
                                    allowClear
                                    showSearch
                                    optionFilterProp="children"
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
                                <Form.Item label="Si Français" name="siFrancais" rules={[{ required: true }]}>
                                    <Radio.Group>
                                        <Radio value={true}>Oui</Radio>
                                        <Radio value={false}>Non</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Si Personnel" name="siPersonnel" rules={[{ required: true }]}>
                                    <Radio.Group>
                                        <Radio value={true}>Oui</Radio>
                                        <Radio value={false}>Non</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
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