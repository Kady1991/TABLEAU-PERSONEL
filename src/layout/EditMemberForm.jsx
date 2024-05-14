import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Radio,
  Row,
  Col,
  DatePicker,
  Select,
} from "antd";
import { FiEdit } from "react-icons/fi";
import axios from "axios";
import dayjs from "dayjs";

// import moment from "moment";


const { Option } = Select;

const EditMemberForm = ({ IDPersonne }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [personData, setPersonData] = useState(null);
  const [grades, setGrades] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [otherServices, setOtherServices] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);
  const [selectedGradeDetails, setSelectedGradeDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState(null); // Initialiser la date à null


  /*   useEffect(() => {
    //console.log("AdresseComplete:", personData?.AdresseComplete);
  }, [personData]); */

  useEffect(() => {
    fetchData();
  }, [IDPersonne, form, isModalVisible]);

  const fetchData = async () => {
    if (!isModalVisible) return;
    if (IDPersonne) {
      console.log(IDPersonne);
      try {
        const personResponse = await axios.get(
          `https://server-iis.uccle.intra/API_Personne/api/Personne/${IDPersonne}`
        );
        //const personResponse = await axios.get(
        //  `https://localhost:44333/api/Personne/${IDPersonne}`
        // );
        personResponse.data.DateEntreeDate = personResponse?.data
          ?.DateEntreeDate
          ? dayjs(personResponse.data.DateEntreeDate, "YYYY-MM-DD")
          : undefined;

        setPersonData(personResponse.data);
        form.setFieldsValue(personResponse.data);
        console.log(personResponse.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de la personne:",
          error
        );
      }
    }

    try {
      const gradesResponse = await axios.get(
        `https://server-iis.uccle.intra/API_Personne/api/wwgrades`
      );
      setGrades(gradesResponse.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des grades:", error);
    }

    try {
      const addressesResponse = await axios.get(
        `https://server-iis.uccle.intra/API_Personne/api/Adresses`
      );
      setAddresses(addressesResponse.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des adresses:", error);
    }

    try {
      const servicesResponse = await axios.get(
        `https://server-iis.uccle.intra/API_Personne/api/affectation/services`
      );
      setOtherServices(servicesResponse.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des autres services:",
        error
      );
    }
  };
  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleServiceSelection = (value) => {
    const selectedService = otherServices.find(
      (service) => service.IDService === value
    );
    setSelectedServiceDetails(selectedService);
  };

  const handleGradeSelection = (value) => {
    const selectedGrade = otherGrades.find(
      (grade) => grade.WWGradeID === value
    );
    setSelectedGradeDetails(selectedGrade);
  };

  //verifier si la date est correcte
  // const isValidDate = (dateString) => {
  //   return moment(dateString, "YYYY-MM-DD", true).isValid();
  // };

  // Logique de soumission du formulaire
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // const option = {
      //   day: "numeric",
      //   month: "2-digit",
      //   year: "numeric",
      // };
      // const dateEntree = new Intl.DateTimeFormat("fr-FR", option).format(
      //   values.dateEntree
      // );
      const DateEntreeDate = values["DateEntreeDate"];
      const formData = {
        IDPersonne: personData?.IDPersonne,
        NomPersonne: values.NomPersonne,
        PrenomPersonne: values.PrenomPersonne,
        Email: values.Email,
        TelPro: values.TelPro == undefined ? null : values.TelPro,
        DateEntree: values.DateEntreeDate,
        WWGradeID: values.WWGradeID,
        AdresseID: values.AdresseID,
        ServiceID: values.ServiceID,
        SiFrancais: values.SiFrancais,
        SiServicePrincipal: values.SiServicePrincipal,
        SiTypePersonnel: values.SiTypePersonnel,
      };
      //console.log(formData);
      const linkEditPersonne = `https://server-iis.uccle.intra/API_Personne/api/Personne/edit?id=${IDPersonne}`;
      // const linkEditPersonne = `https://localhost:44333/api/Personne/edit?id=${IDPersonne}`;

      const response = await axios.put(linkEditPersonne, formData);

      if (response.status != 200) {
        throw new Error("Erreur lors de l'envoi des données");
      }
      // Afficher une alerte lorsque l'ajout est réussi
      alert("Ajout réussi !");
      console.log("Les modifications sont faites avec succès");
      // Fermer le formulaire après l'ajout réussi
      setFormSubmitted(true);
      handleCloseModal();
    } catch (error) {
      console.log(error);
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
      <FiEdit
        title="Editer"
        style={{
          fontSize: "20px",
          cursor: "pointer",
          color: "#095e74",
        }}
        onClick={handleOpenModal}
      />
      <Modal
        title="EDITER"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null} // Supprimer le footer pour ne pas afficher les boutons OK et Cancel
        style={{ textAlign: "center", minHeight: "70vh", minWidth: "70vh" }}
        centered
      >
        <div>
          <Form
            form={form}
            onFinish={handleSubmit}
            values={personData} // Utilisez initialValues ici
            layout="vertical"
            style={{
              maxWidth: "1000px",
              width: "100%",
              padding: "20px",
              backgroundColor: "#f0f2f5",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >

            <Row gutter={[16]}>
              <Col span={12}>
                <Form.Item
                  label="Nom"
                  name="NomPersonne"
                  // value={personData?.NomPersonne}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Prénom"
                  name="PrenomPersonne"
                  // value={personData?.PrenomPersonne}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Téléphone"
                  name="TelPro"
                  // value={personData?.TelPro}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="E-mail"
                  name="Email"
                  // value={personData?.Email}
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Veuillez saisir un e-mail valide",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
              <Form.Item
                style={{ width: "100%" }}
                label="Date"
                name="DateEntreeDate"
                rules={[{ required: true, message: "Veuillez choisir une date" }]}
              >
                <DatePicker
                  style={{ width: "99%" }}
                  // defaultValue={personData ? dayjs(personData.DateEntreeDate) : null}
                />
              </Form.Item>
              </Col>

              <Col span={12}>
              <Form.Item
                style={{ width: "100%" }}
                label="Grade"
                name="WWGradeID"
                // value={personData?.WWGradeID}
                rules={[
                  { required: true, message: "Veuillez sélectionner un grade" },
                ]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {grades.map((grade) => (
                    <Option key={grade.IDWWGrade} value={grade.IDWWGrade}>
                      {grade.NomWWGradeFr}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              </Col>

              <Col span={12}>
              <Form.Item
                style={{ width: "100%" }}
                label="Adresse"
                name="AdresseID"
                // value={personData?.AdresseID}
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner une adresse",
                  },
                ]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {addresses.map((address) => (
                    <Option key={address.IDAdresse} value={address.IDAdresse}>
                      {address.AdresseComplete}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              </Col>

              <Col span={12}>
              <Form.Item
                style={{ width: "100%" }}
                name="ServiceID"
                label="Service"
                // value={personData?.ServiceID}
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
                  {otherServices.map((service) => (
                    <Option key={service.IDService} value={service.IDService}>
                      {service.NomServiceFr}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Si Français"
                  name="SiFrancais"
                  // value={personData?.SiFrancais}
                  rules={[
                    {
                      required: true,
                      message: "Veuillez sélectionner une option",
                    },
                  ]}
                >
                  <Radio.Group>
                    <Radio value={true}>FR</Radio>
                    <Radio value={false}>Nl</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Si Personnel"
                  name="SiTypePersonnel"
                  // value={personData?.SiTypePersonnel}
                  rules={[
                    {
                      required: true,
                      message: "Veuillez sélectionner une option",
                    },
                  ]}
                >
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button style={{ margin: 10 }} type="primary" htmlType="submit">
                  Valider
                </Button>
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
