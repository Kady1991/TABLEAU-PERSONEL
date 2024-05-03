import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Radio, Row, Col } from 'antd';
import { MdWorkHistory } from "react-icons/md";
import axios from 'axios';

const FormService = ({ personId }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [personData, setPersonData] = useState(null);

    useEffect(() => {
        const fetchPersonData = async () => {
            try {
                const response = await axios.get(`https://server-iis.uccle.intra/API_Personne/api/Personne/${personId}`);
                setPersonData(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données de la personne:', error);
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
            <MdWorkHistory style={{ fontSize: '20px', cursor: 'pointer', }} onClick={handleOpenModal} />
            <Modal
                title="Ajouter un Service suplémentaire"
                open={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
            >
                {personData && (

                    <div style={{ width: '100%' }}>
                        <Form onFinish={handleSubmit} initialValues={personData} >
                            <Row gutter={[16, 16]} className={personData && !personData.siFrancais && !personData.siPersonnel ? 'disabled-row' : ''}>
                                <Col span={10}>
                                    <Form.Item label="Nom" name="NomPersonne" rules={[{ required: true }]}>
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={10}>
                                    <Form.Item label="Prénom" name="PrenomPersonne" rules={[{ required: true }]}>
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={10}>
                                    <Form.Item label="Service" name="NomRueFr" rules={[{ required: true }]}>
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item label="Téléphone" name="tel" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="E-mail" name="email" rules={[{ required: true, type: 'email' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Grade" name="grade" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Adresse" name="adresse" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Service" name="service" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Si Français" name="siFrancais" rules={[{ required: true }]}>
                                <Radio.Group>
                                    <Radio value={true}>Oui</Radio>
                                    <Radio value={false}>Non</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label="Si Personnel" name="siPersonnel" rules={[{ required: true }]}>
                                <Radio.Group>
                                    <Radio value={true}>Oui</Radio>
                                    <Radio value={false}>Non</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item>
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                                    <Button style={{ margin: 10 }} type="primary" htmlType="submit">Valider</Button>
                                    <Button onClick={handleCloseModal}>Annuler</Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </div>



                )}
            </Modal>
        </>
    );
};

export default FormService;
