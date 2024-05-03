
import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { MdWorkHistory } from "react-icons/md";

const FormService = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

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
        title="Formulaire de Service"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form onFinish={handleSubmit}>
          <Form.Item label="Nom" name="nom" initialValue="John" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item label="Prénom" name="prenom" initialValue="Doe" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item label="Service" name="service" initialValue="Service A" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item label="Téléphone" name="tel" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="E-mail" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <div style={{display:"flex", justifyContent:"center", alignItems:"center", }}>
            <Button style={{margin:10}} type="primary" htmlType="submit">Valider</Button>
            <Button onClick={handleCloseModal}>Annuler</Button>
            </div>
           
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default FormService;